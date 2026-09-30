import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useResource } from "../hooks/useResource";
import { apiClient } from "../utils/apiClient";
import { SavedTrip, Trip } from "../types/platform";
import { money } from "../components/ListingCard";
import { useAuth } from "../contexts/AuthContext";
function download(trip: Trip) {
  const text = [
    trip.title,
    `${trip.days} days / ${trip.adults} travellers / budget ${money(trip.budget)}`,
    trip.notes || "",
    ...trip.stops.map(
      (s) =>
        `Day ${s.day}: ${s.name}\nEstimated group cost: ${money(s.cost)}\n${s.notes}\nApproximate onward travel from previous stop: ${s.estimatedTravelMinutes} minutes`,
    ),
    ...trip.warnings,
  ].join("\n\n");
  const url = URL.createObjectURL(
    new Blob([text], { type: "text/plain;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "ndlela-itinerary.txt";
  a.click();
  URL.revokeObjectURL(url);
}
function TripEditor({
  item,
  refresh,
}: {
  item: SavedTrip;
  refresh: () => void;
}) {
  const [trip, setTrip] = useState(item.data),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false);
  const action = async (fn: () => Promise<unknown>, message: string) => {
    setBusy(true);
    try {
      await fn();
      setNotice(message);
      refresh();
    } catch (e) {
      setNotice((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <article className="nd-panel trip-editor">
      <label>
        Trip name
        <input
          value={trip.title}
          maxLength={200}
          onChange={(e) => setTrip({ ...trip, title: e.target.value })}
        />
      </label>
      <div className="trip-summary">
        {trip.stops.length} stops ·{" "}
        {money(trip.stops.reduce((n, s) => n + s.cost, 0))} estimated{" "}
        <span>{money(trip.budget)} budget</span>
      </div>
      <label>
        Trip notes
        <textarea
          value={trip.notes || ""}
          maxLength={3000}
          placeholder="The little details worth remembering"
          onChange={(e) => setTrip({ ...trip, notes: e.target.value })}
        />
      </label>
      {trip.stops.map((s, i) => (
        <div className="editable-stop" key={`${s.listingId}-${i}`}>
          <Link to={`/business/${s.listingId}`}>
            <strong>{s.name}</strong>
          </Link>
          <label>
            Day
            <input
              type="number"
              value={s.day}
              min="1"
              max={30}
              onChange={(e) =>
                setTrip({
                  ...trip,
                  stops: trip.stops.map((v, j) =>
                    j === i ? { ...v, day: Number(e.target.value) } : v,
                  ),
                })
              }
            />
          </label>
          <label>
            Notes
            <input
              value={s.notes}
              maxLength={1500}
              onChange={(e) =>
                setTrip({
                  ...trip,
                  stops: trip.stops.map((v, j) =>
                    j === i ? { ...v, notes: e.target.value } : v,
                  ),
                })
              }
            />
          </label>
          <button
            className="text-link"
            onClick={() =>
              setTrip({ ...trip, stops: trip.stops.filter((_, j) => j !== i) })
            }
          >
            Remove stop
          </button>
          <button
            className="text-link"
            disabled={i === 0}
            onClick={() => {
              const stops = [...trip.stops];
              [stops[i - 1], stops[i]] = [stops[i], stops[i - 1]];
              setTrip({ ...trip, stops });
            }}
          >
            Move up ↑
          </button>
        </div>
      ))}
      {!trip.stops.length && (
        <p>
          Add places from their detail pages or start with the{" "}
          <Link to="/planner">weekend planner</Link>.
        </p>
      )}
      <div className="button-row">
        <button
          className="nd-button"
          disabled={busy}
          onClick={() =>
            action(() => apiClient.put(`/trips/${item.id}`, trip), "Trip saved")
          }
        >
          Save changes
        </button>
        <button className="nd-button outline" onClick={() => download(trip)}>
          Download offline
        </button>
        <button
          className="nd-button outline"
          disabled={busy}
          onClick={() =>
            action(
              () => apiClient.post(`/trips/${item.id}/share`, {}),
              "Share link is ready below. Anyone with the link can view your trip and notes.",
            )
          }
        >
          Share trip
        </button>
        <button
          className="text-link"
          disabled={busy}
          onClick={() => {
            if (window.confirm("Delete this trip?"))
              action(
                () => apiClient.delete(`/trips/${item.id}`),
                "Trip deleted",
              );
          }}
        >
          Delete
        </button>
      </div>
      {item.share_token && (
        <div className="notice">
          <label>
            Share link
            <input
              readOnly
              value={`${window.location.origin}/shared/${item.share_token}`}
              onFocus={(e) => e.target.select()}
            />
          </label>
          <button
            className="text-link"
            disabled={busy}
            onClick={() =>
              action(
                () => apiClient.delete(`/trips/${item.id}/share`),
                "Sharing disabled",
              )
            }
          >
            Stop sharing
          </button>
        </div>
      )}
      {notice && <p role="status">{notice}</p>}
    </article>
  );
}
export default function Trips() {
  const { data, error, loading, reload } = useResource<SavedTrip[]>("/trips"),
    [notice, setNotice] = useState("");
  const create = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    try {
      await apiClient.post("/trips", {
        title: form.get("title"),
        destination: "",
        days: 2,
        adults: 2,
        budget: 4000,
        stops: [],
        warnings: [],
      });
      reload();
    } catch (err) {
      setNotice((err as Error).message);
    }
  };
  return (
    <div className="nd-page nd-section">
      <span className="eyebrow">PLANS TO LOOK FORWARD TO</span>
      <div className="section-title">
        <h1>Your next chapters.</h1>
        <Link to="/planner" className="nd-button">
          Plan a weekend ↗
        </Link>
      </div>
      <form className="explore-search" onSubmit={create}>
        <label className="sr-only" htmlFor="trip-title">
          New collection name
        </label>
        <input
          id="trip-title"
          name="title"
          required
          maxLength={200}
          placeholder="Name a collection, e.g. December holiday"
        />
        <button className="nd-button outline">Create collection</button>
      </form>
      {notice && <p role="status">{notice}</p>}
      {loading ? (
        <p role="status">Loading your trips…</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : data?.length ? (
        <div className="trips-grid">
          {data.map((t) => (
            <TripEditor key={t.id} item={t} refresh={reload} />
          ))}
        </div>
      ) : (
        <div className="empty-panel">
          <h2>A blank page, full of possibility.</h2>
          <p>
            Create a collection above or let the planner give you a starting
            point.
          </p>
        </div>
      )}
    </div>
  );
}
export function SharedTrip() {
  const { token } = useParams(),
    { user } = useAuth(),
    { data, error, loading, reload } = useResource<SavedTrip>(
      `/shared/${token}`,
    ),
    [notice, setNotice] = useState("");
  const vote = async (id: string) => {
    try {
      await apiClient.post(`/shared/${token}/vote`, { listingId: id });
      setNotice("Your vote is counted");
      reload();
    } catch (e) {
      setNotice((e as Error).message);
    }
  };
  return (
    <div className="nd-page nd-section">
      {loading ? (
        <p role="status">Opening shared trip…</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : (
        data && (
          <>
            <span className="eyebrow">BETTER TOGETHER</span>
            <h1>{data.data.title}</h1>
            <p>{data.data.notes}</p>
            <p>
              {data.data.adults} travellers · {data.data.days} days
            </p>
            <button
              className="nd-button outline"
              onClick={() => download(data.data)}
            >
              Download itinerary
            </button>
            {data.data.stops.map((s, i) => (
              <article className="nd-panel" key={i}>
                <span className="eyebrow">DAY {s.day}</span>
                <h2>
                  <Link to={`/business/${s.listingId}`}>{s.name}</Link>
                </h2>
                <p>{s.notes}</p>
                <p>
                  {money(s.cost)} estimated group cost ·{" "}
                  {data.votes?.find((v) => v.listing_id === s.listingId)
                    ?.count || 0}{" "}
                  votes
                </p>
                {user ? (
                  <button
                    className="nd-button outline"
                    onClick={() => vote(s.listingId)}
                  >
                    I’d love to go
                  </button>
                ) : (
                  <Link to="/login">Sign in to vote</Link>
                )}
              </article>
            ))}
            <div className="notice">
              {data.data.warnings.map((w) => (
                <p key={w}>{w}</p>
              ))}
            </div>
          </>
        )
      )}
      {notice && <p role="status">{notice}</p>}
    </div>
  );
}
