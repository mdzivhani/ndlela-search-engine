import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useResource } from "../hooks/useResource";
import { Listing, SavedTrip } from "../types/platform";
import { apiClient } from "../utils/apiClient";
import { useAuth } from "../contexts/AuthContext";
import { useFavourites } from "../contexts/FavouritesContext";
import { money } from "../components/ListingCard";
export default function ListingDetail() {
  const { id } = useParams(),
    { user } = useAuth(),
    saved = useFavourites();
  const {
    data: item,
    error,
    loading,
  } = useResource<Listing>(`/listings/${id}`);
  const { data: trips, reload: reloadTrips } = useResource<SavedTrip[]>(
    user ? "/trips" : null,
  );
  const [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false),
    [selectedTrip, setSelectedTrip] = useState("");
  useEffect(() => {
    apiClient.post(`/listings/${id}/events`, { event: "view" }).catch(() => {});
  }, [id]);
  if (loading)
    return (
      <div className="nd-section" role="status">
        Opening this place…
      </div>
    );
  if (error || !item)
    return (
      <div className="nd-section" role="alert">
        {error || "Place not found"}{" "}
        <Link to="/search">Explore other places</Link>
      </div>
    );
  const addToTrip = async () => {
    if (item.priceFrom == null) {
      setNotice("Confirm the ticket price before adding this place to a trip budget.");
      return;
    }
    try {
      setBusy(true);
      const trip = trips?.find((t) => t.id === selectedTrip);
      if (!trip) return;
      await apiClient.put(`/trips/${trip.id}`, {
        ...trip.data,
        stops: [
          ...trip.data.stops,
          {
            listingId: item.id,
            name: item.name,
            day: 1,
            cost: (item.priceFrom || 0) * trip.data.adults,
            notes: "",
            estimatedTravelMinutes: 0,
          },
        ],
      });
      setNotice("Added to your trip");
      reloadTrips();
    } catch (e) {
      setNotice((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const enquire = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await apiClient.post("/enquiries", {
        listingId: item.id,
        date: form.get("date"),
        guests: Number(form.get("guests")),
        message: form.get("message"),
      });
      setNotice(
        "Your request has been sent. Follow its progress in My enquiries.",
      );
    } catch (err) {
      setNotice((err as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="nd-page nd-section">
      <Link className="text-link" to="/search">
        ← Back to discovery
      </Link>
      <div className="detail-title">
        <div>
          <span className="eyebrow">
            {item.city} · {item.province}
          </span>
          <h1>{item.name}</h1>
          <p>
            {item.reviewCount
              ? `★ ${item.rating.toFixed(1)} · ${item.reviewCount} reviews`
              : "Be part of the first chapter · no reviews yet"}
            {item.verified && " · Business ownership verified"}
          </p>
        </div>
        <button
          className="nd-button outline"
          aria-pressed={saved.has(item.id)}
          onClick={() =>
            saved.has(item.id) ? saved.remove(item.id) : saved.add(item.id)
          }
        >
          {saved.has(item.id) ? "♥ Saved" : "♡ Save place"}
        </button>
      </div>
      {item.sample && (
        <p className="notice">
          This is a sample listing for exploring Ndlela. Photos, prices and
          details are illustrative; it cannot accept enquiries or payments.
        </p>
      )}
      {localStorage.getItem("ndlela_low_data") !== "true" && (
        <div className="detail-gallery">
          {item.gallery?.slice(0, 3).map((url, i) => (
            <img
              key={url}
              src={url}
              alt={`${item.name}, view ${i + 1}`}
              loading={i ? "lazy" : "eager"}
            />
          ))}
        </div>
      )}
      {item.photoCredit && item.photoCreditUrl && (
        <p>
          Photo: <a href={item.photoCreditUrl} target="_blank" rel="noreferrer">{item.photoCredit}</a>
        </p>
      )}
      <div className="detail-layout">
        <div>
          <section className="detail-section">
            <span className="eyebrow">THE EXPERIENCE</span>
            <h2>A little more about this place.</h2>
            <p>{item.description}</p>
            <div className="facility-tags">
              {item.facilities?.map((f) => (
                <span key={f}>{f}</span>
              ))}
            </div>
          </section>
          <section className="detail-section">
            <h2>Experiences & prices</h2>
            {item.services?.length ? (
              item.services.map((s) => (
                <div className="service-row" key={s.id}>
                  <div>
                    <h3>{s.name}</h3>
                    <p>{s.description}</p>
                    <small>{s.duration}</small>
                  </div>
                  <strong>
                    {money(s.price)}
                    <small>per person</small>
                  </strong>
                </div>
              ))
            ) : (
              <p>
                {item.priceFrom != null ? (
                  <>From {money(item.priceFrom)} · {item.priceBasis}. Ask the operator for the full offer.</>
                ) : item.priceUrl ? (
                  <a href={item.priceUrl} target="_blank" rel="noreferrer">Check official ticket prices and availability ↗</a>
                ) : (
                  <>Price not provided. Ask the operator for the full offer.</>
                )}
              </p>
            )}
          </section>
          <section className="detail-section">
            <h2>Know before you go</h2>
            <dl className="practical-grid">
              <div>
                <dt>Opening hours</dt>
                <dd>
                  {typeof item.hours === "string"
                    ? item.hours || "Ask the operator"
                    : Object.entries(item.hours || {}).map(([day, hours]) => (
                        <div key={day}>
                          {day}: {hours}
                        </div>
                      ))}
                </dd>
              </div>
              <div>
                <dt>Accessibility</dt>
                <dd>
                  {item.accessibility ||
                    "Ask the operator for specific access details."}
                </dd>
              </div>
              <div>
                <dt>Getting there</dt>
                <dd>{item.transport || "Ask the operator for directions."}</dd>
              </div>
              <div>
                <dt>Cancellation policy</dt>
                <dd>
                  {item.cancellationPolicy ||
                    "Confirm terms before making a payment."}
                </dd>
              </div>
              <div>
                <dt>Languages</dt>
                <dd>
                  {(Array.isArray(item.languages)
                    ? item.languages.join(", ")
                    : item.languages) || "Ask the operator"}
                </dd>
              </div>
              <div>
                <dt>Information updated</dt>
                <dd>{new Date(item.updatedAt).toLocaleDateString("en-ZA")}</dd>
              </div>
            </dl>
          </section>
          <section className="detail-section">
            <h2>Traveller reviews</h2>
            {item.reviews?.length ? (
              item.reviews.map((r) => (
                <blockquote key={r.id}>
                  <strong>
                    {r.name} · {r.rating}/5
                  </strong>
                  <p>{r.text}</p>
                </blockquote>
              ))
            ) : (
              <p>
                No published reviews yet. Reviews are accepted after completed
                visits and checked before publication.
              </p>
            )}
          </section>
        </div>
        <aside className="booking-panel">
          <span className="eyebrow">MAKE A PLAN</span>
          <h2>{item.priceFrom != null ? `From ${money(item.priceFrom)}` : "Price information"}</h2>
          <p>{item.priceBasis}</p>
          {item.priceFrom == null && item.priceUrl && (
            <a href={item.priceUrl} target="_blank" rel="noreferrer">Check official prices ↗</a>
          )}
          {user ? (
            <>
              <form onSubmit={enquire}>
                <label>
                  Preferred date
                  <input
                    type="date"
                    name="date"
                    min={new Date().toISOString().slice(0, 10)}
                    required
                  />
                </label>
                <label>
                  Guests
                  <input
                    type="number"
                    name="guests"
                    defaultValue="2"
                    min="1"
                    max="100"
                    required
                  />
                </label>
                <label>
                  Anything the operator should know?
                  <textarea
                    name="message"
                    maxLength={3000}
                    placeholder="Tell them about your plans or access needs"
                  />
                </label>
                <button
                  className="nd-button"
                  disabled={busy || !item.enquiryEnabled}
                >
                  Request availability
                </button>
                <small>
                  {item.enquiryEnabled
                    ? "No payment now. The operator will reply with availability and a quote."
                    : "This listing is not accepting enquiries yet."}
                </small>
              </form>
              <hr />
              <label>
                Add to a collection
                <select
                  value={selectedTrip}
                  onChange={(e) => setSelectedTrip(e.target.value)}
                >
                  <option value="">Choose a trip</option>
                  {trips?.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.data.title}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className="nd-button outline"
                disabled={!selectedTrip || busy || item.priceFrom == null}
                onClick={addToTrip}
              >
                Add to trip
              </button>
              {item.priceFrom == null && (
                <small>Confirm a price before adding this place to a trip budget.</small>
              )}
              <Link to="/trips">Create a new collection</Link>
            </>
          ) : (
            <>
              <Link
                className="nd-button"
                to="/login"
                state={{ from: { pathname: `/business/${id}` } }}
              >
                Sign in to plan a visit
              </Link>
              <p>You can explore and save places as a guest.</p>
            </>
          )}
          {notice && (
            <p role="status" className="notice">
              {notice}
            </p>
          )}
          <Link className="text-link" to="/enquiries">
            My enquiries ↗
          </Link>
          <Link className="text-link" to={`/operator?claim=${item.id}`}>
            Own this business?
          </Link>
        </aside>
      </div>
    </div>
  );
}
