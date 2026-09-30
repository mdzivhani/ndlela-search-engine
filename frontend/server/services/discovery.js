const number = (value, fallback, min, max) => {
  if (value === undefined || value === "") return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max)
    throw Object.assign(new Error("Invalid numeric filter"), { status: 400 });
  return parsed;
};
const words = (value) => String(value || "").toLowerCase();
const array = (value) =>
  value === undefined
    ? []
    : (Array.isArray(value) ? value : [value]).map(words);
function distanceKm(a, b) {
  const rad = (n) => (n * Math.PI) / 180;
  const dlat = rad(b.latitude - a.latitude),
    dlng = rad(b.longitude - a.longitude);
  const v =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(rad(a.latitude)) *
      Math.cos(rad(b.latitude)) *
      Math.sin(dlng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(v), Math.sqrt(Math.max(0, 1 - v)));
}
function filterListings(listings, params = {}) {
  const q = words(params.q).trim();
  const min = number(params.minPrice, 0, 0, 10000000),
    max = number(params.maxPrice, Infinity, 0, 10000000);
  const hasPriceFilter =
    (params.minPrice !== undefined && params.minPrice !== "") ||
    (params.maxPrice !== undefined && params.maxPrice !== "");
  const rating = number(params.minRating, 0, 0, 5);
  const lat = number(params.lat, undefined, -90, 90),
    lng = number(params.lng, undefined, -180, 180);
  if ((lat === undefined) !== (lng === undefined))
    throw Object.assign(new Error("Both latitude and longitude are required"), {
      status: 400,
    });
  const radius = number(params.radiusKm, Infinity, 1, 20000);
  const bounds = ["north", "south", "east", "west"].map((k) =>
    number(params[k], undefined, -180, 180),
  );
  if (
    bounds.some((v) => v !== undefined) &&
    bounds.some((v) => v === undefined)
  )
    throw Object.assign(new Error("All map bounds are required"), {
      status: 400,
    });
  const facilities = array(params.facility || params.facilities),
    activities = array(params.activityType || params.activityTypes);
  let results = listings
    .map((item) => ({
      ...item,
      ...(lat !== undefined
        ? {
            distanceKm:
              Math.round(
                distanceKm({ latitude: lat, longitude: lng }, item) * 10,
              ) / 10,
          }
        : {}),
    }))
    .filter((item) => {
      const text = words(
        [
          item.name,
          item.description,
          item.city,
          item.province,
          item.category,
          ...(item.activityTypes || []),
        ].join(" "),
      );
      return (
        (!q || q === "*" || q.split(/\s+/).every((w) => text.includes(w))) &&
        (!params.category || words(item.category) === words(params.category)) &&
        (!params.province || words(item.province) === words(params.province)) &&
        (Number.isFinite(item.priceFrom)
          ? item.priceFrom >= min && item.priceFrom <= max
          : !hasPriceFilter) &&
        (item.rating || 0) >= rating &&
        facilities.every((f) =>
          (item.facilities || []).some((v) => words(v) === f),
        ) &&
        (!activities.length ||
          activities.some((f) =>
            (item.activityTypes || []).some((v) => words(v).includes(f)),
          )) &&
        (lat === undefined || item.distanceKm <= radius) &&
        (bounds[0] === undefined ||
          (item.latitude <= bounds[0] &&
            item.latitude >= bounds[1] &&
            item.longitude <= bounds[2] &&
            item.longitude >= bounds[3]))
      );
    });
  const sorts = {
    price_low: (a, b) =>
      (Number.isFinite(a.priceFrom) ? a.priceFrom : Infinity) -
      (Number.isFinite(b.priceFrom) ? b.priceFrom : Infinity),
    price_high: (a, b) =>
      (Number.isFinite(b.priceFrom) ? b.priceFrom : -Infinity) -
      (Number.isFinite(a.priceFrom) ? a.priceFrom : -Infinity),
    rating: (a, b) => b.rating - a.rating,
    most_reviewed: (a, b) => b.reviewCount - a.reviewCount,
    distance: (a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity),
  };
  if (sorts[params.sortBy]) results.sort(sorts[params.sortBy]);
  const total = results.length,
    offset = Math.floor(number(params.offset, 0, 0, 1000000)),
    limit = Math.floor(number(params.limit, 20, 1, 100));
  return {
    results: results.slice(offset, offset + limit),
    total,
    query: params.q || "*",
  };
}
function planTrip(listings, input) {
  const adults = Math.floor(number(input.adults, 2, 1, 20)),
    days = Math.floor(number(input.days, 2, 1, 14)),
    budget = number(input.budget, 4000, 1, 1000000);
  const destination = words(input.destination).trim();
  const candidates = listings
    .filter(
      (l) =>
        !destination || words(`${l.city} ${l.province}`).includes(destination),
    )
    .filter(
      (l) =>
        !input.interest ||
        words(`${l.category} ${(l.activityTypes || []).join(" ")}`).includes(
          words(input.interest),
        ),
    )
    .filter((listing) => Number.isFinite(listing.priceFrom))
    .sort((a, b) => a.priceFrom - b.priceFrom);
  const stops = [];
  let estimatedTotal = 0;
  for (const listing of candidates) {
    const cost = listing.priceFrom * adults;
    if (estimatedTotal + cost > budget || stops.length >= days * 2) continue;
    const previous = stops.length
      ? candidates.find((l) => l.id === stops[stops.length - 1].listingId)
      : null;
    if (previous && distanceKm(previous, listing) > 150) continue;
    stops.push({
      listingId: listing.id,
      name: listing.name,
      day: Math.floor(stops.length / 2) + 1,
      cost,
      notes: "",
      estimatedTravelMinutes: previous
        ? Math.ceil(distanceKm(previous, listing) * 1.35)
        : 0,
    });
    estimatedTotal += cost;
  }
  const warnings = [
    "Prices are estimates per person. Transport, meals and overnight accommodation are excluded unless explicitly included in a selected service.",
    "Travel times are rough geographic estimates, not driving directions. Confirm opening hours and availability with each operator.",
  ];
  if (stops.length < days * 2)
    warnings.push(
      "There are not enough matching options within this budget to fill every day. Try a wider destination or a larger budget.",
    );
  return {
    title: `${input.destination || "South Africa"} getaway`,
    destination: input.destination || "",
    adults,
    days,
    budget,
    stops,
    estimatedTotal,
    warnings,
  };
}
module.exports = { filterListings, planTrip, distanceKm };
