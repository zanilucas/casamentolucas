"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Topbar } from "@/components/Topbar";
import { couple } from "@/lib/site-config";

type Attending = "sim" | "nao" | "";

export default function RsvpPage() {
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [attending, setAttending] = useState<Attending>("");
  const [companionsCount, setCompanionsCount] = useState(0);
  const [companionsNames, setCompanionsNames] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");

    const response = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        whatsapp,
        attending,
        companionsCount: attending === "sim" ? companionsCount : 0,
        companionsNames: attending === "sim" ? companionsNames : "",
        notes,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setStatus("error");
      setMessage(data.error || "Nao foi possivel salvar sua resposta. Tente novamente.");
      return;
    }

    setStatus("success");
    setMessage(
      attending === "sim"
        ? `Que alegria, ${fullName.split(" ")[0]}! Sua presenca foi confirmada.`
        : `Obrigado por avisar, ${fullName.split(" ")[0]}. Sentiremos sua falta.`
    );
  }

  if (status === "success") {
    return (
      <main className="app-shell">
        <div className="container-mobile">
          <Topbar backHref="/" />
          <section className="success-wrap">
            <div className="success-icon">♡</div>
            <h1 className="success-title">Resposta recebida</h1>
            <div className="success-divider" />
            <p className="success-msg">{message}</p>
            <div className="button-stack">
              <Link className="btn-primary" href="/">
                Voltar ao inicio
              </Link>
              {attending === "sim" ? (
                <Link className="btn-secondary" href="/presentes">
                  Ver lista de presentes
                </Link>
              ) : null}
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <div className="container-mobile">
        <Topbar backHref="/" />
        <PageHeader title="Confirme sua Presenca" subtitle={`Responda ate ${couple.rsvpDeadline}.`} />

        <section className="form-wrap">
          {status === "error" ? <p className="notice error">{message}</p> : null}

          <form className="form-card" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="fullName">Nome completo *</label>
              <input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>

            <div className="field">
              <label htmlFor="whatsapp">WhatsApp</label>
              <input
                id="whatsapp"
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="(00) 99999-9999"
              />
            </div>

            <div className="field">
              <label>Voce comparecera? *</label>
              <div className="radio-group">
                <button
                  type="button"
                  className={`radio-opt ${attending === "sim" ? "active" : ""}`}
                  onClick={() => setAttending("sim")}
                >
                  Sim, estarei la
                </button>
                <button
                  type="button"
                  className={`radio-opt ${attending === "nao" ? "active" : ""}`}
                  onClick={() => setAttending("nao")}
                >
                  Nao poderei ir
                </button>
              </div>
            </div>

            {attending === "sim" ? (
              <>
                <div className="field">
                  <label htmlFor="companionsCount">Quantidade de acompanhantes</label>
                  <select
                    id="companionsCount"
                    value={companionsCount}
                    onChange={(e) => setCompanionsCount(Number(e.target.value))}
                  >
                    {[0, 1, 2, 3, 4].map((number) => (
                      <option key={number} value={number}>
                        {number === 0 ? "Sem acompanhantes" : `${number} acompanhante${number > 1 ? "s" : ""}`}
                      </option>
                    ))}
                  </select>
                </div>

                {companionsCount > 0 ? (
                  <div className="field">
                    <label htmlFor="companionsNames">Nome dos acompanhantes</label>
                    <input
                      id="companionsNames"
                      value={companionsNames}
                      onChange={(e) => setCompanionsNames(e.target.value)}
                      placeholder="Ex: Maria Silva, Carlos Lima"
                    />
                  </div>
                ) : null}
              </>
            ) : null}

            <div className="field">
              <label htmlFor="notes">Observacoes</label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Restricoes alimentares, recados ou informacoes importantes."
              />
            </div>

            <button className="btn-primary" disabled={status === "saving" || !attending} type="submit">
              {status === "saving" ? "Salvando..." : "Confirmar Presenca"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
