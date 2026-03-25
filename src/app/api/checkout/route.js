import { NextResponse } from "next/server";
import Stripe from "stripe";

let stripe;

export async function POST(req) {
  try {
    if (!stripe) {
      if (!process.env.STRIPE_SECRET_KEY) {
        console.error("CRITICAL: STRIPE_SECRET_KEY is missing in Netlify settings.");
        return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
      }
      stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }

    const body = await req.json();
    const { items } = body;

    console.log("Incoming Cart Items:", JSON.stringify(items));

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const lineItems = items.map((item) => {
      if (item.priceId) {
        return {
          price: item.priceId,
          quantity: item.quantity || 1,
        };
      }

      const rawPrice = typeof item.price === "string"
        ? parseFloat(item.price.replace(/[^0-9.]/g, ""))
        : item.price;

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name || "Archive Item",
          },
          unit_amount: Math.round((rawPrice || 1.0) * 100),
        },
        quantity: item.quantity || 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.get("origin")}/checkout/success`,
      cancel_url: `${req.headers.get("origin")}/shop`,
    });

    // ✅ Return session.url so the frontend can redirect directly
    return NextResponse.json({ url: session.url });

  } catch (err) {
    console.error("STRIPE_SERVER_ERROR:", err.message);
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}