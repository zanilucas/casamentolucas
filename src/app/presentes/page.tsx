import { PageHeader } from "@/components/PageHeader";
import { Topbar } from "@/components/Topbar";
import { fallbackGifts, formatMoney } from "@/lib/site-config";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import type { Gift } from "@/lib/types";
import GiftPaymentForm from "./payment-form";

export const dynamic = "force-dynamic";

const giftImageById: Record<string, string> = {
  "contribuicao-livre": "/brand/gifts/contribuicao-livre.jpg",
  "lua-de-mel": "/brand/gifts/lua-de-mel.jpg",
  geladeira: "/brand/gifts/geladeira.jpg",
  "filtro-de-agua": "/brand/gifts/filtro-de-agua.jpg",
  "aspirador-de-po": "/brand/gifts/aspirador-de-po.jpg",
  "jogo-de-cama": "/brand/gifts/jogo-de-cama.jpg",
  "jogo-de-toalhas": "/brand/gifts/jogo-de-toalhas.jpg",
  batedeira: "/brand/gifts/batedeira.jpg",
  "panela-eletrica": "/brand/gifts/panela-eletrica.jpg",
  grill: "/brand/gifts/grill.jpg",
  "chaleira-eletrica": "/brand/gifts/chaleira-eletrica.jpg",
  "casinha-pra-mel": "/brand/gifts/casinha-pra-mel.jpg",
  "ferro-de-passar": "/brand/gifts/ferro-de-passar.jpg",
  "aparelho-de-jantar": "/brand/gifts/aparelho-de-jantar.jpg",
};

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
            subtitle="Seu presente e uma forma de celebrar conosco esse momento tao especial."
          />
        </div>

        <section className="gift-grid">
          {gifts.map((gift) => (
            <article className={`gift-card gift-card-${gift.id}`} key={gift.id}>
              <div
                className="gift-visual"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(255, 255, 252, 0.04), rgba(39, 91, 76, 0.2)), url("${giftImageById[gift.id] || "/brand/gift-header.jpg"}")`,
                }}
              >
                <span className="gift-emoji">{gift.emoji || "+"}</span>
              </div>
              <div className="gift-content">
                <h2 className="gift-name">{gift.name}</h2>
                <p className="gift-desc">{gift.description}</p>
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
