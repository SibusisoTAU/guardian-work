import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { reference } = await req.json();
  const r = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
  });
  const d = await r.json();
  return NextResponse.json({ paid: d.data?.status === "success", data: d.data });
}
