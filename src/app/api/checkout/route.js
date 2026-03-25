import { NextResponse } from "next/server";
import Stripe from "stripe";

// 1. Lazy-load Stripe to prevent build-time environment variable errors
let stripe;

export async function POST(req) {
  try {
    // Initialize Stripe only when the function is called
    if (!stripe) {
      if (!process.env.STRIPE_SECRET_KEY) {
        console.error("CRITICAL: STRIPE_SECRET_KEY is missing in Netlify settings.");
        return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
      }
      stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }

    // Parse the incoming request body
    const body = await req.json();
    const { items } = body;

    // Log the data to Netlify Functions Console for debugging
    console.log("Incoming Cart Items:", JSON.stringify(items));

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 2. Map items with strict "NaN" protection
    const lineItems = items.map((item, index) => {
      // Clean the price: handle strings like "$120", nulls, or undefined
      let rawPrice = item.price;
      
      if (typeof rawPrice === 'string') {
        // Remove everything except numbers and decimals
        rawPrice = parseFloat(rawPrice.replace(/[^0-9.]/g, ""));
      }

      // Final Validation: If price is still NaN or missing, default to a safe value 
      // or throw a clear error to stop the process.
      if (isNaN(rawPrice) || rawPrice <= 0) {
        console.error(`Item at index ${index} (${item.name}) has an invalid price:`, item.price);
        // Defaulting to 1.00 as a safety net, change this to throw error if preferred
        rawPrice = 1.00; 
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name || "Unnamed Product",
            // Only include images if the URL exists and is valid
            ...(item.image && { images: [item.image.startsWith('http') ? item.image : `${req.headers.get("origin")}${item.image}`] }),
          },
          // Stripe requires amounts in CENTS (must be an integer)
          unit_amount: Math.round(rawPrice * 100),
        },
        quantity: item.quantity || 1,
      };
    });

    // 3. Create the Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      // Use the 'origin' header to redirect back to your site correctly
      success_url: `${req.headers.get("origin")}/checkout/success`,
      cancel_url: `${req.headers.get("origin")}/shop`,
    });

    return NextResponse.json({ id: session.id });

  } catch (err) {
    console.error("STRIPE_CHECKOUT_ERROR:", err.message);
    return NextResponse.json(
      { 
        error: "Internal Server Error", 
        details: err.message,
        path: "api/checkout" 
      },
      { status: 500 }
    );
  }
}