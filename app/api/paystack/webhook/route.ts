import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("x-paystack-signature") || "";
  const hash = crypto.createHmac("sha512", process.env.PAYSTACK_SECRET_KEY || "").update(body).digest("hex");
  if (hash !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
