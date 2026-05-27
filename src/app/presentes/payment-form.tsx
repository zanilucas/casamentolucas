"use client";

import { FormEvent, useState } from "react";
import type { Gift } from "@/lib/types";

export default function GiftPaymentForm({ gift }: { gift: Gift }) {
  const [guestName, setGuestName] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/payments/create-preference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        giftId: gift.id,
        guestName,
        customAmountCents: gift.allow_custom_amount ? Number(customAmount) * 100 : undefined,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setLoading(false);
      setError(data.error || "Nao foi possivel iniciar o pagamento.");
      return;
    }

    window.location.href = data.initPoint;
  }

  if (!open) {
    return (
      <button className="gift-btn" type="button" onClick={() => setOpen(true)}>
        Presentear
      </button>
    );
  }

  return (
    <form className="gift-btn-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor={`guest-${gift.id}`}>Seu nome</label>
        <input id={`guest-${gift.id}`} value={guestName} onChange={(e) => setGuestName(e.target.value)} required />
      </div>

      {gift.allow_custom_amount ? (
        <div className="field">
          <label htmlFor={`amount-${gift.id}`}>Valor em reais</label>
          <input
            id={`amount-${gift.id}`}
            min="10"
            type="number"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            required
          />
        </div>
      ) : null}

      {error ? <p className="notice error">{error}</p> : null}

      <button className="btn-primary" type="submit" disabled={loading}>
        {loading ? "Abrindo Mercado Pago..." : "Pagar com Pix ou cartao"}
      </button>
    </form>
  );
}
