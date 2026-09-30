import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useResource } from "../hooks/useResource";
import { Enquiry } from "../types/platform";
import { apiClient } from "../utils/apiClient";
import { money } from "../components/ListingCard";
type Payment = {
  id: string;
  enquiry_id: string;
  amount: string;
  status: string;
};
export default function Enquiries() {
  const { data, error, loading, reload } = useResource<Enquiry[]>("/enquiries"),
    { data: config } = useResource<{ enabled: boolean; mode: string }>(
      "/payments/config",
    ),
    { data: payments } = useResource<Payment[]>("/payments"),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false);
  const pay = async (id: string) => {
    setBusy(true);
    try {
      const checkout = await apiClient.post<{
        url: string;
        fields: Record<string, string>;
      }>("/payments/checkout", { enquiryId: id });
      const form = document.createElement("form");
      form.method = "POST";
      form.action = checkout.url;
      Object.entries(checkout.fields).forEach(([name, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.append(input);
      });
      document.body.append(form);
      form.submit();
    } catch (e) {
      setNotice((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const cancel = async (id: string) => {
    if (!window.confirm("Cancel this availability request?")) return;
    try {
      await apiClient.post(`/enquiries/${id}/cancel`, {});
      reload();
      setNotice("Request cancelled");
    } catch (e) {
      setNotice((e as Error).message);
    }
  };
  return (
    <div className="nd-page nd-section">
      <span className="eyebrow">FROM MAYBE TO MEMORIES</span>
      <h1>My enquiries & bookings.</h1>
      <p>
        Availability is confirmed by the operator. Payment status changes only
        after confirmation from PayFast.
      </p>
      <button className="nd-button outline" onClick={reload}>
        Refresh status
      </button>
      {new URLSearchParams(window.location.search).has("payment") && (
        <p className="notice">
          Returned from checkout. Refresh to see the latest verified payment
          status; returning here does not confirm payment.
        </p>
      )}
      {notice && (
        <p role="status" className="notice">
          {notice}
        </p>
      )}
      {loading ? (
        <p role="status">Loading enquiries…</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : !data?.length ? (
        <div className="empty-panel">
          <h2>Your next visit is waiting.</h2>
          <Link to="/search" className="nd-button">
            Explore places
          </Link>
        </div>
      ) : (
        data.map((e) => {
          const payment = payments?.find(
            (p) => p.enquiry_id === e.id && p.status === "paid",
          );
          return (
            <article className="nd-panel" key={e.id}>
              <div className="section-title">
                <h2>
                  <Link to={`/business/${e.listing_id}`}>{e.listing_name}</Link>
                </h2>
                <span className="status-pill">
                  {e.status.replaceAll("_", " ")}
                </span>
              </div>
              <p>
                {e.data.date} · {e.data.guests} guests
              </p>
              <p>{e.data.message}</p>
              {e.quoted_amount && (
                <p>
                  <strong>
                    Total group quote: {money(Number(e.quoted_amount))}
                  </strong>
                </p>
              )}
              <blockquote>
                {e.response || "Waiting for the operator to reply."}
              </blockquote>
              {e.status === "available" && (
                <>
                  <button
                    className="nd-button"
                    disabled={busy || !config?.enabled}
                    onClick={() => pay(e.id)}
                  >
                    {config?.mode === "sandbox" && config.enabled
                      ? "Test checkout with PayFast"
                      : "Continue to secure payment"}
                  </button>
                  {!config?.enabled && (
                    <p>
                      Online payments are not available yet. Your quote is
                      saved.
                    </p>
                  )}
                </>
              )}
              {["requested", "available"].includes(e.status) && (
                <button className="text-link" onClick={() => cancel(e.id)}>
                  Cancel request
                </button>
              )}
              {payment && (
                <form
                  onSubmit={async (event) => {
                    event.preventDefault();
                    try {
                      const r = await apiClient.post<{ message: string }>(
                        `/payments/${payment.id}/refund-request`,
                        Object.fromEntries(new FormData(event.currentTarget)),
                      );
                      setNotice(r.message);
                    } catch (err) {
                      setNotice((err as Error).message);
                    }
                  }}
                >
                  <p>Payment confirmed: {money(Number(payment.amount))}</p>
                  <label>
                    Need to cancel? Tell us why
                    <textarea
                      name="reason"
                      minLength={10}
                      maxLength={3000}
                      required
                    />
                  </label>
                  <button className="nd-button outline">
                    Request cancellation / refund review
                  </button>
                </form>
              )}
              {e.status === "completed" && (
                <form
                  onSubmit={async (event) => {
                    event.preventDefault();
                    try {
                      await apiClient.post(
                        `/listings/${e.listing_id}/reviews`,
                        Object.fromEntries(new FormData(event.currentTarget)),
                      );
                      setNotice("Your review was submitted for moderation.");
                    } catch (err) {
                      setNotice((err as Error).message);
                    }
                  }}
                >
                  <label>
                    Your rating
                    <select name="rating">
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n}>{n}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Tell other travellers about your visit
                    <textarea
                      name="text"
                      minLength={10}
                      maxLength={2000}
                      required
                    />
                  </label>
                  <button className="nd-button outline">Submit review</button>
                </form>
              )}
            </article>
          );
        })
      )}
    </div>
  );
}
