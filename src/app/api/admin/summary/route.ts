import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const [rsvpsResult, paymentsResult] = await Promise.all([
    supabase.from("rsvps").select("*").order("created_at", { ascending: false }),
    supabase.from("payments").select("*").order("created_at", { ascending: false }),
  ]);

  if (rsvpsResult.error) throw rsvpsResult.error;
  if (paymentsResult.error) throw paymentsResult.error;

  const rsvps = rsvpsResult.data || [];
  const payments = paymentsResult.data || [];
  const confirmed = rsvps.filter((rsvp) => rsvp.attending);
  const absent = rsvps.filter((rsvp) => !rsvp.attending);
  const totalPeople = confirmed.reduce((sum, rsvp) => sum + 1 + Number(rsvp.companions_count || 0), 0);
  const approvedPayments = payments.filter((payment) => payment.status === "approved");
  const receivedCents = approvedPayments.reduce((sum, payment) => sum + Number(payment.amount_cents || 0), 0);

  return NextResponse.json({
    stats: {
      confirmed: confirmed.length,
      absent: absent.length,
      totalPeople,
      payments: approvedPayments.length,
      receivedCents,
    },
    rsvps,
    payments,
  });
}
