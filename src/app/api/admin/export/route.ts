import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

function csvCell(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Nao autorizado." }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("rsvps").select("*").order("created_at", { ascending: false });

  if (error) throw error;

  const rows = [
    ["Nome", "WhatsApp", "Comparecera", "Acompanhantes", "Nomes acompanhantes", "Observacoes", "Data"],
    ...(data || []).map((rsvp) => [
      rsvp.full_name,
      rsvp.whatsapp,
      rsvp.attending ? "sim" : "nao",
      rsvp.companions_count,
      rsvp.companions_names,
      rsvp.notes,
      rsvp.created_at,
    ]),
  ];

  const csv = rows.map((row) => row.map(csvCell).join(";")).join("\n");

  return new Response(`\uFEFF${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="confirmacoes-rsvp.csv"',
    },
  });
}
