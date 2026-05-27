"use client";

import { FormEvent, useEffect, useState } from "react";
import { Topbar } from "@/components/Topbar";
import { formatMoney } from "@/lib/site-config";

type RsvpRow = {
  id: string;
  full_name: string;
  whatsapp: string | null;
  attending: boolean;
  companions_count: number;
  companions_names: string | null;
  notes: string | null;
  created_at: string;
};

type PaymentRow = {
  id: string;
  guest_name: string;
  gift_name: string;
  amount_cents: number;
  status: string;
  payment_method: string | null;
  created_at: string;
};

type Summary = {
  stats: {
    confirmed: number;
    absent: number;
    totalPeople: number;
    payments: number;
    receivedCents: number;
  };
  rsvps: RsvpRow[];
  payments: PaymentRow[];
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadSummary() {
    setLoading(true);
    const response = await fetch("/api/admin/summary");

    if (response.status === 401) {
      setSummary(null);
      setLoading(false);
      return;
    }

    const data = await response.json();
    setSummary(data);
    setLoading(false);
  }

  useEffect(() => {
    async function fetchInitialSummary() {
      await loadSummary();
    }

    void fetchInitialSummary();
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Nao foi possivel entrar.");
      return;
    }

    setPassword("");
    await loadSummary();
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setSummary(null);
  }

  if (loading) {
    return (
      <main className="app-shell">
        <div className="container-mobile">
          <Topbar backHref="/" />
          <section className="admin-login">
            <h1 className="admin-title">Painel dos Noivos</h1>
            <p className="admin-sub">Carregando...</p>
          </section>
        </div>
      </main>
    );
  }

  if (!summary) {
    return (
      <main className="app-shell">
        <div className="container-mobile">
          <Topbar backHref="/" title="Area Admin" />
          <section className="admin-login">
            <h1 className="admin-title">Painel dos Noivos</h1>
            <p className="admin-sub">Area protegida por senha</p>

            <form onSubmit={handleLogin}>
              <div className="field">
                <label htmlFor="password">Senha</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Senha de acesso"
                  required
                />
              </div>

              {error ? <p className="notice error">{error}</p> : null}

              <button className="btn-primary" type="submit">
                Entrar
              </button>
            </form>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <div className="container-mobile">
        <Topbar backHref="/" title="Painel Admin" />

        <section className="admin-wrap">
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-num">{summary.stats.confirmed}</div>
              <div className="stat-label">Confirmados</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{summary.stats.absent}</div>
              <div className="stat-label">Ausentes</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{summary.stats.totalPeople}</div>
              <div className="stat-label">Total pessoas</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{formatMoney(summary.stats.receivedCents)}</div>
              <div className="stat-label">Recebido</div>
            </div>
          </div>

          <a className="export-btn" href="/api/admin/export">
            Exportar RSVP em CSV
          </a>

          <h2 className="section-title">Confirmacoes de Presenca</h2>
          {summary.rsvps.length === 0 ? <p className="muted">Nenhuma confirmacao ainda.</p> : null}
          {summary.rsvps.map((rsvp) => (
            <article className="entry-card" key={rsvp.id}>
              <div className="entry-head">
                <div className="entry-name">{rsvp.full_name}</div>
                <span className={`badge ${rsvp.attending ? "badge-yes" : "badge-no"}`}>
                  {rsvp.attending ? "Confirmado" : "Nao vai"}
                </span>
              </div>
              <div className="entry-meta">
                {rsvp.whatsapp || "Sem WhatsApp"} · {rsvp.companions_count} acompanhante(s)
              </div>
              {rsvp.companions_names ? <div className="entry-meta">Acompanhantes: {rsvp.companions_names}</div> : null}
              {rsvp.notes ? <div className="entry-meta">Obs: {rsvp.notes}</div> : null}
            </article>
          ))}

          <h2 className="section-title">Presentes & Pagamentos</h2>
          {summary.payments.length === 0 ? <p className="muted">Nenhum pagamento registrado ainda.</p> : null}
          {summary.payments.map((payment) => (
            <article className="entry-card" key={payment.id}>
              <div className="entry-head">
                <div className="entry-name">{payment.guest_name}</div>
                <span className={`badge ${payment.status === "approved" ? "badge-ok" : "badge-no"}`}>
                  {payment.status}
                </span>
              </div>
              <div className="entry-meta">
                {payment.gift_name} · {formatMoney(payment.amount_cents)} · {payment.payment_method || "aguardando"}
              </div>
            </article>
          ))}

          <button className="export-btn" type="button" onClick={handleLogout}>
            Sair do painel
          </button>
        </section>
      </div>
    </main>
  );
}
