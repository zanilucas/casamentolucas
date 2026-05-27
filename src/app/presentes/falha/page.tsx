import Link from "next/link";
import { Topbar } from "@/components/Topbar";

export default function PaymentFailurePage() {
  return (
    <main className="app-shell">
      <div className="container-mobile">
        <Topbar backHref="/presentes" backLabel="Presentes" />
        <section className="success-wrap">
          <div className="success-icon">!</div>
          <h1 className="success-title">Pagamento nao concluido</h1>
          <div className="success-divider" />
          <p className="success-msg">Nao se preocupe. Voce pode voltar para a lista e tentar novamente.</p>
          <Link className="btn-primary" href="/presentes">
            Tentar novamente
          </Link>
        </section>
      </div>
    </main>
  );
}
