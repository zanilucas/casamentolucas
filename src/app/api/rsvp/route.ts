import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import type { RsvpPayload } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<RsvpPayload>;

    if (!body.fullName?.trim()) {
      return NextResponse.json({ error: "Informe seu nome completo." }, { status: 400 });
    }

    if (body.attending !== "sim" && body.attending !== "nao") {
      return NextResponse.json({ error: "Informe se você comparecerá." }, { status: 400 });
    }

    const companionsCount = Number(body.companionsCount || 0);

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("rsvps").insert({
      full_name: body.fullName.trim(),
      whatsapp: body.whatsapp?.trim() || null,
      attending: body.attending === "sim",
      companions_count: body.attending === "sim" ? companionsCount : 0,
      companions_names: body.attending === "sim" ? body.companionsNames?.trim() || null : null,
      notes: body.notes?.trim() || null,
    });

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao salvar RSVP." }, { status: 500 });
  }
}
