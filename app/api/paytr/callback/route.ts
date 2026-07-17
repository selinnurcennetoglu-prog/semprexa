import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyPaytrCallback } from "../../../lib/paytr";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const merchantOid = formData.get("merchant_oid") as string;
    const status = formData.get("status") as string;
    const totalAmount = formData.get("total_amount") as string;
    const hash = formData.get("hash") as string;

    if (!merchantOid || !status || !totalAmount || !hash) {
      return NextResponse.json({ error: "Eksik parametreler" }, { status: 400 });
    }

    const isValid = verifyPaytrCallback({
      merchant_oid: merchantOid,
      status,
      total_amount: totalAmount,
      hash,
    });

    if (!isValid) {
      return NextResponse.json({ error: "Gecersiz hash" }, { status: 403 });
    }

    if (status === "success") {
      await supabaseAdmin
        .from("orders")
        .update({ status: "processing" })
        .eq("order_code", merchantOid);
    } else {
      await supabaseAdmin
        .from("orders")
        .update({ status: "cancelled" })
        .eq("order_code", merchantOid);
    }

    return NextResponse.json({ status: "OK" });
  } catch (err) {
    console.error("PayTR callback error:", err);
    return NextResponse.json({ error: "Callback hatasi" }, { status: 500 });
  }
}
