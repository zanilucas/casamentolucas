import Link from "next/link";
import { Topbar } from "@/components/Topbar";

export default function PaymentPendingPage() {
  return (
    <main className="app-shell">
      <div className="container-mobile">
        <Topbar backHref="/" />
        <section className="success-wrap">
          <div className="success-icon">○</div>
          <h1 className="success-title">Pagamento pendente</h1>
          <div className="success-divider" />
          <p className="success-msg">Assim que o Mercado Pago aprovar o pagamento, o presente será atualizado.</p>
          <Link className="btn-primary" href="/">
            Voltar ao início
          </Link>
        </section>
      </div>
    </main>
  );
}
