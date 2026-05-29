import Image from "next/image";
import Link from "next/link";
import { Topbar } from "@/components/Topbar";
import { couple } from "@/lib/site-config";

export default function HomePage() {
  return (
    <main className="app-shell">
      <div className="container-mobile">
        <Topbar showAdmin />

        <section className="hero">
          <div className="hero-kicker">Nosso casamento</div>
          <div className="hero-ornament">✦ ✦ ✦</div>
          <h1 className="hero-names">
            {couple.brideFirstName}
            <span className="hero-amp"> e </span>
            {couple.groomFirstName}
          </h1>
          <div className="hero-script-note">Save the Date</div>
          <div className="hero-date">
            {couple.weekDay}, {couple.date}
          </div>
          <div className="hero-divider" />
          <p className="hero-welcome">{couple.welcome}</p>

          <div className="button-stack">
            <Link className="btn-primary" href="/rsvp">
              Confirmar Presenca
            </Link>
            <Link className="btn-secondary" href="/presentes">
              Lista de Presentes
            </Link>
          </div>
        </section>

        <section className="info-stack" aria-label="Informacoes do casamento">
          <div className="info-card">
            <Image className="info-icon-img" src="/brand/info-time.jpg" alt="" width={58} height={58} />
            <div>
              <div className="info-label">Horario</div>
              <div className="info-value">{couple.time}</div>
            </div>
          </div>

          <div className="info-card">
            <Image className="info-icon-img" src="/brand/info-ceremony.jpg" alt="" width={58} height={58} />
            <div>
              <div className="info-label">Cerimonia</div>
              <div className="info-value">{couple.ceremony}</div>
              <div className="info-sub">{couple.ceremonyAddress}</div>
            </div>
          </div>

          <div className="info-card">
            <Image className="info-icon-img" src="/brand/info-reception.jpg" alt="" width={58} height={58} />
            <div>
              <div className="info-label">Recepcao</div>
              <div className="info-value">{couple.party}</div>
              <div className="info-sub">{couple.partyAddress}</div>
            </div>
          </div>

          <div className="map-actions">
            <a className="btn-map" href={couple.ceremonyMapsUrl} target="_blank" rel="noreferrer">
              Abrir mapa da cerimonia
            </a>
            <a className="btn-map" href={couple.partyMapsUrl} target="_blank" rel="noreferrer">
              Abrir mapa da recepcao
            </a>
          </div>
        </section>

        <div className="section-bottom" />
      </div>
    </main>
  );
}
