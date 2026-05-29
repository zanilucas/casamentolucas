import Link from "next/link";
import { couple } from "@/lib/site-config";

type TopbarProps = {
  showAdmin?: boolean;
  backHref?: string;
  backLabel?: string;
  title?: string;
};

export function Topbar({ showAdmin, backHref, backLabel = "Início", title = couple.names }: TopbarProps) {
  return (
    <header className="topbar">
      {backHref ? (
        <Link className="back-btn" href={backHref}>
          ← {backLabel}
        </Link>
      ) : (
        <span className="topbar-title">{couple.names} - 2026</span>
      )}

      {backHref ? <span className="topbar-title">{title}</span> : null}

      {showAdmin ? (
        <Link className="back-btn" href="/admin">
          Admin
        </Link>
      ) : null}
    </header>
  );
}
