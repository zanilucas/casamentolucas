import Link from "next/link";
import { Topbar } from "@/components/Topbar";

export default function PaymentSuccessPage() {
  return (
    <main className="app-shell">
      <div className="container-mobile">
        <Topbar backHref="/" />
        <section className="success-wrap">
          <div className="success-icon">♥</div>
          <h1 className="success-title">Muito obrigados!</h1>
          <div className="success-divider" />
          <p className="success-msg">
            Seu pagamento foi iniciado com sucesso. Assim que o Mercado Pago confirmar, o presente aparecerá no painel.
          </p>
          <Link className="btn-primary" href="/">
            Voltar ao início
          </Link>
        </section>
      </div>
    </main>
  );
}
