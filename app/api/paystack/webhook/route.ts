import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    if (!process.env.PAYSTACK_SECRET_KEY) {
      return NextResponse.json(
        { error: "Paystack is not configured. Add PAYSTACK_SECRET_KEY to your environment." },
        { status: 503 }
      );
    }

    const body = await req.text();
    const signature = req.headers.get("x-paystack-signature") || "";
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
