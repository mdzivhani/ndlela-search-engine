import React, { useState } from "react";
import { useResource } from "../hooks/useResource";
import { apiClient } from "../utils/apiClient";
type Queue = {
  reviews: {
    id: string;
    name: string;
    listing_name: string;
    text: string;
    rating: number;
  }[];
  claims: {
    id: string;
    name: string;
    email: string;
    listing_name: string;
    evidence: string;
  }[];
  refunds: {
    id: string;
    email: string;
    amount: string;
    provider_id: string;
    reason: string;
  }[];
};
export default function Moderation() {
  const { data, error, loading, reload } = useResource<Queue>("/admin"),
    [notice, setNotice] = useState("");
  const decide = async (kind: string, id: string, status: string) => {
    try {
      await apiClient.patch(`/admin/${kind}/${id}`, { status });
      reload();
      setNotice("Decision saved");
    } catch (e) {
      setNotice((e as Error).message);
    }
  };
  return (
    <div className="nd-page nd-section">
      <h1>Community moderation</h1>
      {notice && <p role="status">{notice}</p>}
      {loading ? (
        <p>Loading review queue…</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : (
        data && (
          <>
            <h2>Ownership claims</h2>
            <p>
              Verify evidence independently before assigning ownership. Approval
              allows the applicant to edit the listing and receive enquiries.
            </p>
            {data.claims.map((c) => (
              <article className="nd-panel" key={c.id}>
                <h3>{c.listing_name}</h3>
                <p>
                  {c.name} · {c.email}
                </p>
                <p>{c.evidence}</p>
                <div className="button-row">
                  <button
                    className="nd-button"
                    onClick={() => {
                      if (confirm("Have you verified ownership independently?"))
                        decide("claims", c.id, "approved");
                    }}
                  >
                    Approve verified ownership
                  </button>
                  <button
                    className="nd-button outline"
                    onClick={() => decide("claims", c.id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              </article>
            ))}
            <h2>Pending reviews</h2>
            {data.reviews.map((r) => (
              <article className="nd-panel" key={r.id}>
                <h3>
                  {r.listing_name} · {r.rating}/5
                </h3>
                <p>{r.name}</p>
                <blockquote>{r.text}</blockquote>
                <div className="button-row">
                  <button
                    className="nd-button"
                    onClick={() => decide("reviews", r.id, "approved")}
                  >
                    Publish
                  </button>
                  <button
                    className="nd-button outline"
                    onClick={() => decide("reviews", r.id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              </article>
            ))}
            <h2>Cancellation and refund requests</h2>
            <p>
              Review cancellation terms and issue eligible refunds through the
              PayFast merchant dashboard. These requests do not automatically
              refund money.
            </p>
            {data.refunds.map((r) => (
              <article className="nd-panel" key={r.id}>
                <p>
                  {r.email} · R{r.amount} · PayFast reference {r.provider_id}
                </p>
                <p>{r.reason}</p>
              </article>
            ))}
          </>
        )
      )}
    </div>
  );
}
