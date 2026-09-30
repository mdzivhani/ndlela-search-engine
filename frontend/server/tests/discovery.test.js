const { test } = require("node:test");
const assert = require("node:assert/strict");
const { filterListings, planTrip } = require("../services/discovery");
const listings = [
  {
    id: "a",
    name: "Forest walk",
    city: "Cape Town",
    province: "Western Cape",
    description: "Nature",
    category: "Activities",
    priceFrom: 100,
    rating: 4,
    reviewCount: 2,
    latitude: -33.9,
    longitude: 18.4,
    facilities: ["Parking"],
    activityTypes: ["Nature"],
  },
  {
    id: "b",
    name: "Mountain lodge",
    city: "Graskop",
    province: "Mpumalanga",
    category: "Accommodation",
    priceFrom: 900,
    rating: 5,
    reviewCount: 5,
    latitude: -24.9,
    longitude: 30.8,
    facilities: ["WiFi"],
    activityTypes: ["Nature"],
  },
  {
    id: "c",
    name: "Gold Reef City",
    city: "Johannesburg",
    province: "Gauteng",
    category: "Theme Park",
    rating: 0,
    reviewCount: 0,
    latitude: -26.2,
    longitude: 28,
    facilities: [],
    activityTypes: ["Theme Park"],
  },
];
test("search combines text, price, facilities, category and wildcard filters", () => {
  assert.equal(filterListings(listings, { q: "*" }).total, 3);
  assert.equal(
    filterListings(listings, {
      q: "Cape Town",
      maxPrice: "200",
      facility: "Parking",
    }).results[0].id,
    "a",
  );
  assert.equal(
    filterListings(listings, { category: "Accommodation", maxPrice: "200" })
      .total,
    0,
  );
  assert.equal(
    filterListings(listings, { sortBy: "price_high", limit: "1" }).results[0]
      .id,
    "b",
  );
  assert.equal(
    filterListings(listings, { q: "Gold Reef City" }).results[0].id,
    "c",
  );
  assert.equal(
    filterListings(listings, { maxPrice: "1000" }).total,
    2,
  );
  assert.equal(
    filterListings(listings, { sortBy: "price_low" }).results.at(-1).id,
    "c",
  );
});
test("map and distance filters retain only matching locations", () => {
  assert.equal(
    filterListings(listings, { lat: "-33.9", lng: "18.4", radiusKm: "20" })
      .total,
    1,
  );
  assert.equal(
    filterListings(listings, {
      north: "-33",
      south: "-34",
      east: "19",
      west: "18",
    }).total,
    1,
  );
});
test("invalid filters fail explicitly", () => {
  assert.throws(() => filterListings(listings, { maxPrice: "-1" }));
  assert.throws(() => filterListings(listings, { limit: "banana" }));
});
test("planner respects group budget and reports incomplete coverage", () => {
  const trip = planTrip(listings, {
    destination: "Cape Town",
    adults: 2,
    days: 2,
    budget: 250,
  });
  assert.equal(trip.estimatedTotal, 200);
  assert.equal(trip.stops.length, 1);
  assert.ok(trip.warnings.length);
  assert.throws(() => planTrip(listings, { days: 0, budget: -1 }));
});
test("planner excludes listings without a verified price from budget totals", () => {
  const trip = planTrip(listings, {
    destination: "Johannesburg",
    budget: 5000,
  });
  assert.equal(trip.stops.length, 0);
  assert.equal(trip.estimatedTotal, 0);
});
