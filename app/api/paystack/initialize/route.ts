import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    if (!process.env.PAYSTACK_SECRET_KEY) {
      return NextResponse.json(
        { error: "Paystack is not configured. Add PAYSTACK_SECRET_KEY to your environment." },
        { status: 503 }
      );
    }

    const body = await req.json();
    const email = body.email || "test@guardianwork.co.za";
    const amount = body.amount_cents || 1000;

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount,
        callback_url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      }),
    });

    const data = await res.json();
    if (!data.status) {
      return NextResponse.json({ error: data.message }, { status: 400 });
    }

    return NextResponse.json({
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
