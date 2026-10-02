import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    if (!process.env.PAYSTACK_SECRET_KEY) {
      return NextResponse.json(
        { error: "Paystack is not configured. Add PAYSTACK_SECRET_KEY to your environment." },
        { status: 503 }
      );
    }

    const { reference } = await req.json();
    const r = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    });

    const d = await r.json();
    return NextResponse.json({ paid: d.data?.status === "success", data: d.data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
