import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFavourites } from "../contexts/FavouritesContext";
import { useAuth } from "../contexts/AuthContext";
import { useResource } from "../hooks/useResource";
import { Listing } from "../types/platform";
import ListingCard, { money } from "../components/ListingCard";
export default function Collections() {
  const { ids } = useFavourites(),
    { user } = useAuth(),
    [compare, setCompare] = useState<string[]>([]);
  const { data, error, loading } = useResource<{ results: Listing[] }>(
    "/listings?limit=100",
  );
  const selected =
    data?.results.filter((l) => compare.includes(l.id) && ids.includes(l.id)) ||
    [];
  return (
    <div className="nd-page nd-section">
      <span className="eyebrow">KEEP THE GOOD FINDS</span>
      <div className="section-title">
        <h1>Your saved places.</h1>
        <Link className="nd-button" to="/trips">
          Organize into trips ↗
        </Link>
      </div>
      {!user && (
        <p className="notice">
          Saved on this device. <Link to="/login">Sign in</Link> to keep your
          favourites across devices.
        </p>
      )}
      {loading ? (
        <p role="status">Loading your collection…</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : ids.length ? (
        <>
          <p>Compare up to three places to find your fit.</p>
          <div className="place-grid">
            {data?.results
              .filter((l) => ids.includes(l.id))
              .map((l) => (
                <div key={l.id}>
                  <ListingCard item={l} />
                  <label className="compare-choice">
                    <input
                      type="checkbox"
                      checked={compare.includes(l.id)}
                      disabled={!compare.includes(l.id) && compare.length >= 3}
                      onChange={(e) =>
                        setCompare(
                          e.target.checked
                            ? [...compare, l.id]
                            : compare.filter((id) => id !== l.id),
                        )
                      }
                    />
                    Compare {l.name}
                  </label>
                </div>
              ))}
          </div>
          {selected.length > 0 && (
            <section className="comparison-panel">
              <h2>Your shortlist, side by side.</h2>
              <div className="table-scroll">
                <table>
                  <caption>Compare saved experiences</caption>
                  <thead>
                    <tr>
                      <th>Detail</th>
                      {selected.map((l) => (
                        <th key={l.id}>
                          <Link to={`/business/${l.id}`}>{l.name}</Link>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      [
                        "From",
                        ...selected.map(
                          (l) => l.priceFrom != null
                            ? `${money(l.priceFrom)} · ${l.priceBasis}`
                            : l.priceUrl
                              ? `See official prices · ${l.priceBasis}`
                              : `Price not provided · ${l.priceBasis}`,
                        ),
                      ],
                      [
                        "Location",
                        ...selected.map((l) => `${l.city}, ${l.province}`),
                      ],
                      [
                        "Facilities",
                        ...selected.map(
                          (l) => l.facilities?.join(", ") || "Not provided",
                        ),
                      ],
                      [
                        "Accessibility",
                        ...selected.map(
                          (l) => l.accessibility || "Ask operator",
                        ),
                      ],
                      [
                        "Cancellation",
                        ...selected.map(
                          (l) => l.cancellationPolicy || "Ask operator",
                        ),
                      ],
                      [
                        "Reviews",
                        ...selected.map((l) =>
                          l.reviewCount
                            ? `${l.rating.toFixed(1)} / 5 (${l.reviewCount})`
                            : "No reviews yet",
                        ),
                      ],
                    ].map(([name, ...cells]) => (
                      <tr key={name}>
                        <th scope="row">{name}</th>
                        {cells.map((value, i) => (
                          <td key={selected[i].id}>{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      ) : (
        <div className="empty-panel">
          <h2>Make room for your next adventure.</h2>
          <p>Tap the heart on any place to keep it here.</p>
          <Link className="nd-button" to="/search">
            Find a favourite
          </Link>
        </div>
      )}
    </div>
  );
}
