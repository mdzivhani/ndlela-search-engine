import React, { useState } from "react";
import { Listing } from "../types/platform";
export default function ServiceEditor({
  initial,
}: {
  initial: Listing["services"];
}) {
  const [services, setServices] = useState(initial);
  const change = (i: number, key: string, value: string | number) =>
    setServices((previous) =>
      previous.map((s, j) => (i === j ? { ...s, [key]: value } : s)),
    );
  return (
    <section>
      <h3>Services & experiences</h3>
      <p>Add individual offers so travellers can see what is included.</p>
      <input type="hidden" name="services" value={JSON.stringify(services)} />
      {services.map((service, i) => (
        <fieldset key={service.id} className="service-editor">
          <legend>Experience {i + 1}</legend>
          <label>
            Name
            <input
              value={service.name}
              required
              onChange={(e) => change(i, "name", e.target.value)}
            />
          </label>
          <div className="form-grid">
            <label>
              Price per person (R)
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={service.price}
                onChange={(e) => change(i, "price", Number(e.target.value))}
              />
            </label>
            <label>
              Duration
              <input
                value={service.duration}
                placeholder="e.g. 2 hours"
                onChange={(e) => change(i, "duration", e.target.value)}
              />
            </label>
          </div>
          <label>
            What is included?
            <textarea
              value={service.description}
              onChange={(e) => change(i, "description", e.target.value)}
            />
          </label>
          <button
            type="button"
            className="text-link"
            onClick={() => setServices(services.filter((_, j) => i !== j))}
          >
            Remove experience
          </button>
        </fieldset>
      ))}
      <button
        type="button"
        className="nd-button outline"
        onClick={() =>
          setServices([
            ...services,
            {
              id: crypto.randomUUID(),
              name: "",
              description: "",
              duration: "",
              price: 0,
            },
          ])
        }
      >
        Add an experience
      </button>
    </section>
  );
}
