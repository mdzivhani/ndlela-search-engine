import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useResource } from "../hooks/useResource";
import { Listing } from "../types/platform";
import ListingCard from "../components/ListingCard";
export default function Home() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { data, error, loading, reload } = useResource<{ results: Listing[] }>(
    "/listings?limit=6",
  );
  const collections = [
    [
      "01",
      "Weekend escapes",
      "A little distance. A whole new perspective.",
      "category=Accommodation",
    ],
    ["02", "Under R500", "Big memories, smaller budgets.", "maxPrice=500"],
    [
      "03",
      "Family days out",
      "Make room for a little adventure.",
      "category=Attractions",
    ],
    [
      "04",
      "Food & local culture",
      "Follow your curiosity. Find your people.",
      "category=Food+%26+Drink",
    ],
  ];
  return (
    <div className="nd-page">
      <section className="discovery-hero">
        <div className="hero-shade" />
        <div className="hero-copy">
          <span className="eyebrow light">YOUR NEXT CHAPTER STARTS HERE</span>
          <h1>
            Find your own
            <br />
            <em>South Africa.</em>
          </h1>
          <p>
            From the familiar to the unexpected. Discover places, save your
            favourites, and make a weekend of it.
          </p>
          <form
            className="destination-search"
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/search?q=${encodeURIComponent(q)}`);
            }}
          >
            <label htmlFor="destination">
              Where will your curiosity take you?
            </label>
            <div>
              <input
                id="destination"
                placeholder="Try Cape Town, safari or the Garden Route"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <button className="nd-button">Explore places ↗</button>
            </div>
          </form>
          <span className="hero-caption">
            Local places. Countless ways to explore.
          </span>
        </div>
      </section>
      <section className="nd-section">
        <div className="section-title">
          <div>
            <span className="eyebrow">GO WITH THE FEELING</span>
            <h2>What kind of weekend?</h2>
          </div>
          <Link to="/planner" className="text-link">
            Build my itinerary ↗
          </Link>
        </div>
        <div className="collection-grid">
          {collections.map(([n, title, copy, query]) => (
            <Link className="editorial-card" key={n} to={`/search?${query}`}>
              <span>{n} /</span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <b>Discover ↗</b>
            </Link>
          ))}
        </div>
      </section>
      <section className="nd-section">
        <div className="section-title">
          <div>
            <span className="eyebrow">A LITTLE INSPIRATION</span>
            <h2>Places worth the journey.</h2>
          </div>
          <Link to="/search" className="text-link">
            Explore all places ↗
          </Link>
        </div>
        {loading ? (
          <p role="status">Finding your next adventure…</p>
        ) : error ? (
          <div role="alert">
            {error} <button onClick={reload}>Try again</button>
          </div>
        ) : (
          <div className="place-grid">
            {data?.results.map((item) => (
              <ListingCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
      <section className="planner-banner">
        <div>
          <span className="eyebrow light">LESS PLANNING. MORE LIVING.</span>
          <h2>A weekend that feels like you.</h2>
          <p>
            Choose a destination, a budget and your people. We’ll help you put
            the pieces together.
          </p>
        </div>
        <Link className="nd-button cream" to="/planner">
          Plan my weekend ↗
        </Link>
      </section>
      <section className="nd-section operator-invite">
        <h2>Make your place part of the journey.</h2>
        <p>
          Run a local experience or a place to stay? Bring your business to
          Ndlela.
        </p>
        <Link className="nd-button outline" to="/operator">
          List your business
        </Link>
      </section>
    </div>
  );
}
