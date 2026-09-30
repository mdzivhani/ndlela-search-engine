import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useResource } from "../hooks/useResource";
import { apiClient } from "../utils/apiClient";
import { Listing, Enquiry } from "../types/platform";
import ServiceEditor from "../components/ServiceEditor";
type Dashboard = {
  listings: {
    id: string;
    data: Listing;
    views: number;
    saves: number;
    enquiries: number;
  }[];
  enquiries: Enquiry[];
  claims: { id: string; listing_name: string; status: string }[];
};
export default function OperatorHub() {
  const { data, error, loading, reload } = useResource<Dashboard>("/operator"),
    [params] = useSearchParams(),
    [editing, setEditing] = useState<Listing | null>(null),
    [showForm, setShowForm] = useState(false),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const form = Object.fromEntries(new FormData(e.currentTarget));
    const payload = {
      ...form,
      gallery: String(form.gallery).split("\n").filter(Boolean),
      facilities: String(form.facilities)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      services: JSON.parse(String(form.services || "[]")),
    };
    try {
      editing
        ? await apiClient.put(`/operator/listings/${editing.id}`, payload)
        : await apiClient.post("/operator/listings", payload);
      setShowForm(false);
      setEditing(null);
      setNotice(
        "Your listing is published. Ownership verification is a separate review.",
      );
      reload();
    } catch (err) {
      setNotice((err as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const respond = async (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    const payload = Object.fromEntries(new FormData(e.currentTarget));
    try {
      await apiClient.patch(`/operator/enquiries/${id}`, payload);
      setNotice("Response saved");
      reload();
    } catch (err) {
      setNotice((err as Error).message);
    }
  };
  const claim = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await apiClient.post(
        "/operator/claims",
        Object.fromEntries(new FormData(e.currentTarget)),
      );
      setNotice(
        "Claim submitted for administrator review. Ownership has not changed.",
      );
      reload();
    } catch (err) {
      setNotice((err as Error).message);
    }
  };
  const fields = [
    ["name", "Business name"],
    ["city", "City / town"],
    ["province", "Province"],
    ["latitude", "Latitude (-35 to -22)"],
    ["longitude", "Longitude (16 to 33)"],
    ["priceFrom", "Starting price (R)"],
    ["priceBasis", "Price basis"],
    ["phone", "Contact phone"],
    ["email", "Contact email"],
    ["languages", "Languages offered"],
  ];
  return (
    <div className="nd-page nd-section">
      <span className="eyebrow">LOCAL PLACES. BIG POSSIBILITIES.</span>
      <div className="section-title">
        <h1>Your business, discovered.</h1>
        <button
          className="nd-button"
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
        >
          Create a listing
        </button>
      </div>
      {notice && (
        <p className="notice" role="status">
          {notice}
        </p>
      )}
      {error && <p role="alert">{error}</p>}
      {loading && <p role="status">Loading your dashboard…</p>}
      {showForm && (
        <form className="nd-panel operator-form" onSubmit={submit}>
          <h2>{editing ? "Edit your listing" : "Tell your story"}</h2>
          <div className="form-grid">
            {fields.map(([name, label]) => (
              <label key={name}>
                {label}
                <input
                  name={name}
                  required={[
                    "name",
                    "city",
                    "province",
                    "latitude",
                    "longitude",
                    "priceFrom",
                  ].includes(name)}
                  defaultValue={String(
                    (editing as unknown as Record<string, unknown>)?.[name] ||
                      editing?.contact?.[name as "phone" | "email"] ||
                      "",
                  )}
                  type={
                    name === "email"
                      ? "email"
                      : ["latitude", "longitude", "priceFrom"].includes(name)
                        ? "number"
                        : "text"
                  }
                  step="any"
                />
              </label>
            ))}
            <label>
              Category
              <select
                name="category"
                defaultValue={editing?.category || "Activities"}
              >
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
          </div>
          <label>
            Description
            <textarea
              name="description"
              required
              defaultValue={editing?.description}
            />
          </label>
          <label>
            Photo URLs (HTTPS, one per line)
            <textarea
              name="gallery"
              defaultValue={editing?.gallery?.join("\n")}
            />
          </label>
          <label>
            Facilities (comma separated)
            <input
              name="facilities"
              defaultValue={editing?.facilities?.join(", ")}
            />
          </label>
          <label>
            Opening hours
            <textarea
              name="hours"
              defaultValue={
                typeof editing?.hours === "string" ? editing.hours : ""
              }
            />
          </label>
          <label>
            Accessibility details
            <textarea
              name="accessibility"
              defaultValue={editing?.accessibility}
            />
          </label>
          <label>
            Directions, parking and transport
            <textarea name="transport" defaultValue={editing?.transport} />
          </label>
          <label>
            Cancellation terms
            <textarea
              name="cancellationPolicy"
              defaultValue={editing?.cancellationPolicy}
            />
          </label>
          <ServiceEditor
            key={editing?.id || "new"}
            initial={editing?.services || []}
          />
          <p>
            Published listings are not automatically verified. Provide accurate
            details and confirm prices when replying to enquiries.
          </p>
          <div className="button-row">
            <button className="nd-button" disabled={busy}>
              Publish listing
            </button>
            <button
              type="button"
              className="nd-button outline"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <div className="operator-listings">
        {data?.listings.map((l) => (
          <article className="nd-panel" key={l.id}>
            <h2>
              <Link to={`/business/${l.id}`}>{l.data.name}</Link>
            </h2>
            <div className="metric-row">
              <span>
                <b>{l.views}</b> views
              </span>
              <span>
                <b>{l.saves}</b> saves
              </span>
              <span>
                <b>{l.enquiries}</b> enquiries
              </span>
            </div>
            <button
              className="nd-button outline"
              onClick={() => {
                setEditing(l.data);
                setShowForm(true);
              }}
            >
              Edit listing
            </button>
          </article>
        ))}
      </div>
      <section className="nd-section">
        <h2>Traveller enquiries</h2>
        {!data?.enquiries.length && (
          <p>New availability requests will appear here.</p>
        )}
        {data?.enquiries.map((e) => (
          <article className="nd-panel" key={e.id}>
            <div className="section-title">
              <h3>{e.listing_name}</h3>
              <span className="status-pill">{e.status}</span>
            </div>
            <p>
              {e.name} · {e.email}
            </p>
            <p>
              {e.data.date} · {e.data.guests} guests
            </p>
            <p>{e.data.message}</p>
            <p>{e.response}</p>
            {["requested", "available", "confirmed"].includes(e.status) && (
              <form
                className="form-grid"
                onSubmit={(event) => respond(event, e.id)}
              >
                <label>
                  Response
                  <textarea
                    name="response"
                    required
                    defaultValue={e.response}
                  />
                </label>
                <label>
                  Status
                  <select name="status">
                    {(e.status === "requested"
                      ? ["available", "unavailable"]
                      : e.status === "confirmed"
                        ? ["completed"]
                        : ["completed", "cancelled"]
                    ).map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </label>
                {e.status === "requested" && (
                  <label>
                    Total quote for this group (R)
                    <input name="quote" type="number" min="1" step="0.01" />
                  </label>
                )}
                <button className="nd-button">Send response</button>
              </form>
            )}
          </article>
        ))}
      </section>
      <form className="nd-panel" onSubmit={claim}>
        <h2>Already listed? Claim your business.</h2>
        <label>
          Listing ID
          <input
            name="listingId"
            defaultValue={params.get("claim") || ""}
            required
          />
        </label>
        <label>
          Evidence of ownership
          <textarea
            name="evidence"
            minLength={20}
            maxLength={3000}
            required
            placeholder="Provide a business website and describe your connection to the business. An administrator will review your claim."
          />
        </label>
        <button className="nd-button outline">Submit claim</button>
        {data?.claims.map((c) => (
          <p key={c.id}>
            {c.listing_name}: {c.status}
          </p>
        ))}
      </form>
    </div>
  );
}
