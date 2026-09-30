import React, { useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../utils/apiClient";
import { Trip } from "../types/platform";
import { useAuth } from "../contexts/AuthContext";
import { money } from "../components/ListingCard";
export default function TripPlanner() {
  const { user } = useAuth(),
    [trip, setTrip] = useState<Trip | null>(null),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState("");
  const generate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setNotice("");
    try {
      setTrip(
        await apiClient.post<Trip>(
          "/planner",
          Object.fromEntries(new FormData(e.currentTarget)),
        ),
      );
    } catch (err) {
      setNotice((err as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const save = async () => {
    if (!trip) return;
    setBusy(true);
    try {
      await apiClient.post("/trips", trip);
      setNotice(
        "Your itinerary is saved. Open My trips to edit days, add notes and share it.",
      );
    } catch (e) {
      setNotice((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="nd-page nd-section">
      <span className="eyebrow">YOUR TIME, WELL SPENT</span>
      <h1>Let’s make a weekend of it.</h1>
      <p className="lead">
        A few good places. Your kind of pace. Start with an estimate, then make
        the plan your own.
      </p>
      <div className="planner-layout">
        <form className="nd-panel" onSubmit={generate}>
          <label>
            Destination
            <input
              name="destination"
              required
              placeholder="Cape Town or Western Cape"
            />
          </label>
          <label>
            Days
            <input
              type="number"
              name="days"
              min="1"
              max="14"
              defaultValue="2"
              required
            />
          </label>
          <label>
            Travellers
            <input
              type="number"
              name="adults"
              min="1"
              max="20"
              defaultValue="2"
              required
            />
          </label>
          <label>
            Total experience budget (R)
            <input
              type="number"
              name="budget"
              min="1"
              max="1000000"
              defaultValue="4000"
              required
            />
          </label>
          <label>
            What are you in the mood for?
            <select name="interest">
              <option value="">A bit of everything</option>
              <option value="Tours">Tours</option>
              <option value="Food">Food</option>
              <option value="Activities">Adventure</option>
              <option value="Wellness">Relaxation</option>
            </select>
          </label>
          <button className="nd-button" disabled={busy}>
            {busy ? "Putting it together…" : "Build my itinerary ↗"}
          </button>
        </form>
        <section className="nd-panel">
          {trip ? (
            <>
              <span className="eyebrow">YOUR STARTING POINT</span>
              <h2>{trip.title}</h2>
              <p>
                {trip.adults} travellers · {trip.days} days ·{" "}
                {money(trip.stops.reduce((n, s) => n + s.cost, 0))} estimated
                experiences
              </p>
              {trip.stops.map((s, i) => (
                <article className="itinerary-stop" key={s.listingId}>
                  <span className="day-number">{i + 1}</span>
                  <div>
                    <small>DAY {s.day}</small>
                    <h3>
                      <Link to={`/business/${s.listingId}`}>{s.name}</Link>
                    </h3>
                    <p>
                      {money(s.cost)} for your group
                      {s.estimatedTravelMinutes > 0 &&
                        ` · approximately ${s.estimatedTravelMinutes} minutes from the previous stop`}
                    </p>
                    <button
                      className="text-link"
                      onClick={() =>
                        setTrip({
                          ...trip,
                          stops: trip.stops.filter((_, j) => j !== i),
                        })
                      }
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
              {!trip.stops.length && (
                <p>
                  No matching stops fit this plan. Try a larger budget or
                  another destination.
                </p>
              )}
              <div className="notice">
                {trip.warnings.map((w) => (
                  <p key={w}>{w}</p>
                ))}
              </div>
              {user ? (
                <button
                  className="nd-button"
                  disabled={busy || !trip.stops.length}
                  onClick={save}
                >
                  Save this itinerary
                </button>
              ) : (
                <Link to="/login" className="nd-button">
                  Sign in to save a trip
                </Link>
              )}{" "}
              <Link to="/trips" className="text-link">
                My trips ↗
              </Link>
            </>
          ) : (
            <div className="empty-panel">
              <span className="compass">↗</span>
              <h2>Your next story starts here.</h2>
              <p>
                Tell us where you’re headed. We’ll suggest nearby experiences
                that fit your group’s budget.
              </p>
            </div>
          )}
        </section>
      </div>
      {notice && (
        <p className="notice" role="status">
          {notice}
        </p>
      )}
    </div>
  );
}
