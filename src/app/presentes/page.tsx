import { PageHeader } from "@/components/PageHeader";
import { Topbar } from "@/components/Topbar";
import { fallbackGifts, formatMoney, giftImageById } from "@/lib/site-config";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import type { Gift } from "@/lib/types";
import GiftPaymentForm from "./payment-form";

export const dynamic = "force-dynamic";

async function getGifts(): Promise<Gift[]> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("gifts")
      .select("id,name,description,price_cents,emoji,allow_custom_amount,active")
      .eq("active", true)
      .order("sort_order");

    if (error) throw error;
    if (data?.length) return data as Gift[];
  } catch {
    return fallbackGifts.map((gift, index) => ({
      id: gift.id,
      name: gift.name,
      description: gift.description,
      price_cents: gift.priceCents,
      emoji: gift.emoji,
      allow_custom_amount: gift.allowCustomAmount,
      active: true,
      sort_order: index,
    })) as Gift[];
  }

  return [];
}

export default async function GiftsPage() {
  const gifts = await getGifts();

  return (
    <main className="app-shell">
      <div className="container-mobile">
        <Topbar backHref="/" />
        <div className="gifts-intro">
          <PageHeader
            title="Lista de Presentes"
            subtitle="Seu presente é uma forma de celebrar conosco esse momento tão especial."
          />
        </div>

        <section className="gift-grid">
          {gifts.map((gift) => (
            <article className={`gift-card gift-card-${gift.id}`} key={gift.id}>
              <div className="gift-visual">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="gift-photo"
                  src={giftImageById[gift.id] || "/brand/gift-header.jpg"}
                  alt=""
                  loading="eager"
                />
              </div>
              <div className="gift-content">
                <h2 className="gift-name">{gift.name}</h2>
                {gift.description ? <p className="gift-desc">{gift.description}</p> : null}
                <div className="gift-value">
                  {gift.allow_custom_amount || !gift.price_cents ? "Valor livre" : formatMoney(gift.price_cents)}
                </div>
              </div>
              <GiftPaymentForm gift={gift} />
            </article>
          ))}
        </section>

        <div className="section-bottom" />
      </div>
    </main>
  );
}
