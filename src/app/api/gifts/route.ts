import { NextResponse } from "next/server";
import { fallbackGifts } from "@/lib/site-config";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("gifts")
      .select("id,name,description,price_cents,emoji,allow_custom_amount,active")
      .eq("active", true)
      .order("sort_order");

    if (error) throw error;

    return NextResponse.json({ gifts: data });
  } catch {
    return NextResponse.json({
      gifts: fallbackGifts.map((gift) => ({
        id: gift.id,
        name: gift.name,
        description: gift.description,
        price_cents: gift.priceCents,
        emoji: gift.emoji,
        allow_custom_amount: gift.allowCustomAmount,
        active: true,
      })),
    });
  }
}
