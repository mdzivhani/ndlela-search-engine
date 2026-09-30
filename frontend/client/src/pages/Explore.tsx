import React, { useState, lazy, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import { useResource } from "../hooks/useResource";
import { Listing } from "../types/platform";
import ListingCard from "../components/ListingCard";
const ActivityMap = lazy(() => import("../components/ActivityMap"));
export default function Explore() {
  const [params, setParams] = useSearchParams(),
    [map, setMap] = useState(false),
    [filters, setFilters] = useState(false),
    [highlight, setHighlight] = useState<string | null>(null),
    [geoError, setGeoError] = useState("");
  const { data, error, loading, reload } = useResource<{
    results: Listing[];
    total: number;
  }>(`/listings?${params.toString()}&limit=100`);
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    value ? next.set(key, value) : next.delete(key);
    setParams(next);
  };
  const nearby = () => {
    if (!navigator.geolocation) {
      setGeoError("Location is unavailable on this device");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const next = new URLSearchParams(params);
        next.set("lat", String(p.coords.latitude));
        next.set("lng", String(p.coords.longitude));
        next.set("radiusKm", "50");
        setParams(next);
        setGeoError("");
      },
      () =>
        setGeoError("Location permission was denied. Search by city instead."),
    );
  };
  return (
    <div className="nd-page nd-section">
      <div className="section-title">
        <div>
          <span className="eyebrow">FOLLOW YOUR CURIOSITY</span>
          <h1>Find your next favourite place.</h1>
        </div>
      </div>
      <form
        className="explore-search"
        onSubmit={(e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          update("q", String(form.get("q") || ""));
        }}
      >
        <label className="sr-only" htmlFor="explore-query">
          Destination or experience
        </label>
        <input
          key={params.get("q")}
          id="explore-query"
          name="q"
          defaultValue={params.get("q") || ""}
          placeholder="Search a city, province or experience"
        />
        <button className="nd-button">Search</button>
        <button type="button" className="nd-button outline" onClick={nearby}>
          Near me
        </button>
      </form>
      {geoError && <p role="status">{geoError}</p>}
      <div className="filter-toolbar">
        <button
          className="nd-button outline"
          aria-expanded={filters}
          onClick={() => setFilters(!filters)}
        >
          Filters {params.size > 0 && `(${params.size})`}
        </button>
        <label>
          Sort{" "}
          <select
            value={params.get("sortBy") || "relevance"}
            onChange={(e) => update("sortBy", e.target.value)}
          >
            <option value="relevance">Recommended</option>
            <option value="price_low">Price: low to high</option>
            <option value="price_high">Price: high to low</option>
            <option value="rating">Highest rated</option>
            <option value="most_reviewed">Most reviewed</option>
            <option value="distance">Nearest</option>
          </select>
        </label>
        <button
          className="nd-button outline"
          aria-pressed={map}
          onClick={() => setMap(!map)}
        >
          {map ? "Hide map" : "Show map"}
        </button>
      </div>
      {filters && (
        <section className="filter-drawer" aria-label="Search filters">
          <label>
            Category
            <select
              value={params.get("category") || ""}
              onChange={(e) => update("category", e.target.value)}
            >
              <option value="">All experiences</option>
              {[
                "Accommodation",
                "Tours",
                "Wellness",
                "Food & Drink",
                "Activities",
                "Attractions",
              ].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Maximum price (R)
            <input
              type="number"
              min="0"
              value={params.get("maxPrice") || ""}
              onChange={(e) => update("maxPrice", e.target.value)}
            />
          </label>
          <label>
            Minimum rating
            <select
              value={params.get("minRating") || ""}
              onChange={(e) => update("minRating", e.target.value)}
            >
              <option value="">Any rating</option>
              <option value="4">4+ stars</option>
              <option value="3">3+ stars</option>
            </select>
          </label>
          <label>
            Facility
            <select
              value={params.get("facility") || ""}
              onChange={(e) => update("facility", e.target.value)}
            >
              <option value="">Any facility</option>
              {[
                "Parking",
                "WiFi",
                "Restaurant",
                "Swimming Pool",
                "Wheelchair Access",
              ].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <button className="text-link" onClick={() => setParams({})}>
            Clear all
          </button>
        </section>
      )}
      <div className="active-filters">
        {Array.from(params.entries())
          .filter(
            ([k]) =>
              ![
                "lat",
                "lng",
                "north",
                "south",
                "east",
                "west",
                "sortBy",
              ].includes(k),
          )
          .map(([k, v]) => (
            <button key={k} onClick={() => update(k, "")}>
              {k}: {v} ×
            </button>
          ))}
      </div>
      <p role="status">
        {loading
          ? "Looking for places…"
          : `${data?.total || 0} places to discover`}
      </p>
      {error && (
        <p role="alert">
          {error} <button onClick={reload}>Retry</button>
        </p>
      )}
      <div className={map ? "explore-layout" : ""}>
        <div className="place-grid">
          {data?.results.map((item) => (
            <ListingCard
              item={item}
              key={item.id}
              active={highlight === item.id}
              onHover={setHighlight}
            />
          ))}
          {!loading && !data?.total && (
            <div className="empty-panel">
              <h2>Let’s try a different path.</h2>
              <p>Widen your budget or remove a filter to find more places.</p>
              <button className="nd-button" onClick={() => setParams({})}>
                Explore everything
              </button>
            </div>
          )}
        </div>
        {map && (
          <aside className="explore-map">
            <Suspense fallback={<p>Loading map…</p>}>
              <ActivityMap
                activities={data?.results || []}
                highlightedId={highlight}
                onMarkerHover={setHighlight}
                onMarkerClick={setHighlight}
                zoom={5}
                onBoundsChange={(b) => {
                  const next = new URLSearchParams(params);
                  Object.entries(b).forEach(([k, v]) => next.set(k, String(v)));
                  next.delete("lat");
                  next.delete("lng");
                  setParams(next);
                }}
              />
            </Suspense>
          </aside>
        )}
      </div>
    </div>
  );
}
