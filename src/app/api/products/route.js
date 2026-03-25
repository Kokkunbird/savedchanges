import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET() {
  try {
    const products = await stripe.products.list({
      active: true,
      expand: ["data.default_price"],
    });

    const formatted = products.data.map((product) => {
      const price = product.default_price;
      return {
        id:          product.id,
        name:        product.name,
        description: product.description || "",
        image:       product.images?.[0] || null,
        priceId:     price?.id || null,
        amount:      price?.unit_amount || 0,
        currency:    price?.currency?.toUpperCase() || "SGD",
      };
    });

    return Response.json({ products: formatted });
  } catch (err) {
    console.error("Stripe products error:", err);
    return Response.json({ error: "Failed to load products" }, { status: 500 });
  }
}