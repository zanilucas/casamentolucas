import { Payment } from "mercadopago";
import { NextResponse } from "next/server";
import { getMercadoPagoClient } from "@/lib/mercadopago";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

async function updatePayment(paymentId: string) {
  const paymentClient = new Payment(getMercadoPagoClient());
  const payment = await paymentClient.get({ id: paymentId });

  const externalReference = payment.external_reference;
  if (!externalReference) return;

  const supabase = getSupabaseAdmin();
  await supabase
    .from("payments")
    .update({
      mercado_pago_payment_id: String(payment.id),
      status: payment.status || "unknown",
      payment_method: payment.payment_method_id || null,
      paid_at: payment.date_approved || null,
      raw_payload: payment,
    })
    .eq("external_reference", externalReference);
}

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const body = await request.json().catch(() => ({}));
    const type = body.type || body.action || url.searchParams.get("type");
    const paymentId = body.data?.id || url.searchParams.get("data.id") || url.searchParams.get("id");

    if ((type === "payment" || String(type).startsWith("payment")) && paymentId) {
      await updatePayment(String(paymentId));
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: true });
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const paymentId = url.searchParams.get("data.id") || url.searchParams.get("id");

  if (paymentId) {
    await updatePayment(paymentId);
  }

  return NextResponse.json({ ok: true });
}
