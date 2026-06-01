import { randomUUID } from "crypto";
import { Preference } from "mercadopago";
import { NextResponse } from "next/server";
import { getMercadoPagoClient } from "@/lib/mercadopago";
import { fallbackGifts } from "@/lib/site-config";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import type { Gift } from "@/lib/types";

type Body = {
  giftId?: string;
  guestName?: string;
  customAmountCents?: number;
};

async function findGift(giftId: string): Promise<Gift | null> {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("gifts")
    .select("id,name,description,price_cents,emoji,allow_custom_amount,active")
    .eq("id", giftId)
    .eq("active", true)
    .single();

  if (data) return data as Gift;

  const fallback = fallbackGifts.find((gift) => gift.id === giftId);
  if (!fallback) return null;

  return {
    id: fallback.id,
    name: fallback.name,
    description: fallback.description,
    price_cents: fallback.priceCents,
    emoji: fallback.emoji,
    allow_custom_amount: fallback.allowCustomAmount,
    active: true,
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;

    if (!body.giftId || !body.guestName?.trim()) {
      return NextResponse.json({ error: "Informe seu nome e escolha um presente." }, { status: 400 });
    }

    const gift = await findGift(body.giftId);
    if (!gift) {
      return NextResponse.json({ error: "Presente não encontrado." }, { status: 404 });
    }

    const amountCents = gift.allow_custom_amount ? Number(body.customAmountCents || 0) : Number(gift.price_cents || 0);
    if (amountCents < 1000) {
      return NextResponse.json({ error: "O valor mínimo é R$ 10,00." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const externalReference = randomUUID();
    const guestName = body.guestName.trim();

    const { error: insertError } = await supabase.from("payments").insert({
      external_reference: externalReference,
      guest_name: guestName,
      gift_id: gift.id,
      gift_name: gift.name,
      amount_cents: amountCents,
      status: "pending",
    });

    if (insertError) throw insertError;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
    const shouldAutoReturn = appUrl.startsWith("https://");
    const preference = new Preference(getMercadoPagoClient());
    const result = await preference.create({
      body: {
        external_reference: externalReference,
        payer: {
          name: guestName,
        },
        items: [
          {
            id: gift.id,
            title: gift.name,
            description: gift.description,
            quantity: 1,
            unit_price: amountCents / 100,
            currency_id: "BRL",
          },
        ],
        back_urls: {
          success: `${appUrl}/presentes/sucesso`,
          failure: `${appUrl}/presentes/falha`,
          pending: `${appUrl}/presentes/pendente`,
        },
        payment_methods: {
          excluded_payment_methods: [],
          excluded_payment_types: [],
          installments: 12,
        },
        ...(shouldAutoReturn ? { auto_return: "approved" as const } : {}),
        notification_url: `${appUrl}/api/payments/webhook`,
      },
    });

    return NextResponse.json({
      initPoint: result.init_point || result.sandbox_init_point,
      preferenceId: result.id,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao criar pagamento no Mercado Pago." }, { status: 500 });
  }
}
