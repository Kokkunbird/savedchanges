import { NextResponse } from "next/server";
import Stripe from "stripe";

// 1. Move the instance variable outside the handler
let stripe;

export async function POST(req) {
  try {
    // 2. Initialize Stripe ONLY when this function is called (Lazy Init)
    if (!stripe) {
      if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error("STRIPE_SECRET_KEY is not defined in environment variables.");
      }
      stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }

    const { items } = await req.json();

    // Your existing line items logic...
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.get("origin")}/checkout/success`,
      cancel_url: `${req.headers.get("origin")}/shop`,
    });

    return NextResponse.json({ id: session.id });
  } catch (err) {
    console.error("Checkout Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}