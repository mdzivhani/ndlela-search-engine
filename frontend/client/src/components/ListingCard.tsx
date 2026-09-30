import React from "react";
import { Link } from "react-router-dom";
import { Listing } from "../types/platform";
import { useFavourites } from "../contexts/FavouritesContext";
export const money = (n: number) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(n);
export default function ListingCard({
  item,
  active = false,
  onHover,
}: {
  item: Listing;
  active?: boolean;
  onHover?: (id: string | null) => void;
}) {
  const saved = useFavourites();
  const lowData = localStorage.getItem("ndlela_low_data") === "true";
  return (
    <article
      className={`place-card ${active ? "is-highlighted" : ""}`}
      onMouseEnter={() => onHover?.(item.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      <div className="place-photo">
        {!lowData && item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.style.visibility = "hidden";
            }}
          />
        ) : (
          <span className="photo-placeholder">
            {item.province || "South Africa"}
          </span>
        )}
        <span className="photo-tag">{item.category}</span>
        <button
          className="save-place"
          aria-label={`${saved.has(item.id) ? "Unsave" : "Save"} ${item.name}`}
          aria-pressed={saved.has(item.id)}
          onClick={() =>
            saved.has(item.id) ? saved.remove(item.id) : saved.add(item.id)
          }
        >
          {saved.has(item.id) ? "♥" : "♡"}
        </button>
      </div>
      <div className="place-body">
        <div className="eyebrow">
          {item.city} · {item.province}
        </div>
        {item.photoCredit && item.photoCreditUrl && (
          <small>
            Photo: <a href={item.photoCreditUrl} target="_blank" rel="noreferrer">{item.photoCredit}</a>
          </small>
        )}
        <h3>
          <Link to={`/business/${item.id}`}>{item.name}</Link>
        </h3>
        <p>{item.description}</p>
        <div className="place-meta">
          {item.reviewCount
            ? `★ ${item.rating.toFixed(1)} (${item.reviewCount} reviews)`
            : "No reviews yet"}
          {item.distanceKm !== undefined && (
            <span>{item.distanceKm} km away</span>
          )}
        </div>
        <div className="place-bottom">
          <span>
            {item.priceFrom != null ? (
              <>
                <strong>{money(item.priceFrom)}</strong>
                <small>from · {item.priceBasis || "per person"}</small>
              </>
            ) : item.priceUrl ? (
              <a href={item.priceUrl} target="_blank" rel="noreferrer">Check official prices ↗</a>
            ) : (
              <small>Price not provided</small>
            )}
          </span>
          <Link className="text-link" to={`/business/${item.id}`}>
            Explore ↗
          </Link>
        </div>
        {item.sample && (
          <small className="sample-label">
            Sample listing · prices to be confirmed
          </small>
        )}
      </div>
    </article>
  );
}
