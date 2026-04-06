"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CATEGORY_CONFIG,
  CATEGORY_ORDER,
  resolveProductCategory,
} from "../../../lib/category-config";

function formatPrice(product) {
  const amount = typeof product.amount === "number" ? product.amount / 100 : 0;
  return `${product.currency || "SGD"} ${amount.toFixed(2)}`;
}

function ProductCard({ product, onSelect }) {
  return (
    <button
      type="button"
      className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] text-left transition duration-300 hover:-translate-y-1 hover:border-[#ff5a36]/60 hover:bg-[#2a0904]"
      onClick={() => onSelect(product)}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-black">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:saturate-125"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.4em] text-white/35">
            No Image
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-white/60 backdrop-blur">
          {product.categoryLabel}
        </div>
      </div>
      <div className="space-y-3 p-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-white/35">
            Identity Unit
          </p>
          <h2 className="mt-2 text-2xl font-semibold uppercase tracking-[0.08em] text-white">
            {product.name}
          </h2>
        </div>
        <p className="line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-white/55">
          {product.description || "No description available for this piece yet."}
        </p>
        <div className="flex items-center justify-between border-t border-white/8 pt-4">
          <span className="text-lg uppercase tracking-[0.08em] text-[#ff8a62]">
            {formatPrice(product)}
          </span>
          <span className="text-[11px] uppercase tracking-[0.3em] text-white/35">
            Inspect
          </span>
        </div>
      </div>
    </button>
  );
}

function ProductModal({ product, onClose, onAddToCart }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-5 backdrop-blur-md">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-auto rounded-[32px] border border-white/10 bg-[#090909] shadow-2xl shadow-black/50">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-10 rounded-full border border-white/15 bg-black/50 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-white/70 transition hover:border-white/35 hover:text-white"
        >
          Close
        </button>

        <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
          <div className="min-h-[24rem] bg-black">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.4em] text-white/35">
                No Image
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between p-8">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-[#ff8a62]">
                {product.categoryLabel}
              </p>
              <h2 className="mt-4 text-4xl font-semibold uppercase tracking-[0.08em] text-white">
                {product.name}
              </h2>
              <p className="mt-6 text-sm leading-7 text-white/60">
                {product.description || "No description available for this piece yet."}
              </p>
            </div>

            <div className="mt-10 space-y-5">
              <div className="border-t border-white/10 pt-5 text-2xl uppercase tracking-[0.08em] text-white">
                {formatPrice(product)}
              </div>
              <button
                type="button"
                onClick={() => onAddToCart(product)}
                className="w-full rounded-full border border-[#ff5a36] bg-[#ff5a36] px-6 py-4 text-[12px] uppercase tracking-[0.35em] text-black transition hover:bg-transparent hover:text-[#ff8a62]"
              >
                Add To Manifest
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ cart, open, onClose }) {
  const total = cart.reduce((sum, item) => sum + (item.amount || 0) * item.qty, 0);
  const currency = cart[0]?.currency || "SGD";

  return (
    <>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-[79] bg-black/70"
          onClick={onClose}
          aria-label="Close cart"
        />
      ) : null}
      <aside
        className={`fixed right-0 top-0 z-[80] flex h-screen w-full max-w-sm flex-col border-l border-white/10 bg-[#050505] transition duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-white/35">Manifest</p>
            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-white/70">
              {cart.length} items loaded
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[11px] uppercase tracking-[0.3em] text-white/45 transition hover:text-white"
          >
            Close
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-auto px-6 py-6">
          {cart.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-white/10 px-5 py-8 text-center text-[11px] uppercase tracking-[0.3em] text-white/30">
              No items in manifest
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.priceId || item.id} className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg uppercase tracking-[0.06em] text-white">{item.name}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-white/35">
                      Qty {item.qty}
                    </p>
                  </div>
                  <p className="text-sm uppercase tracking-[0.08em] text-[#ff8a62]">
                    {formatPrice({ ...item, amount: (item.amount || 0) * item.qty })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-white/10 px-6 py-5">
          <div className="flex items-end justify-between">
            <p className="text-[10px] uppercase tracking-[0.35em] text-white/35">Total</p>
            <p className="text-xl uppercase tracking-[0.08em] text-white">
              {currency} {(total / 100).toFixed(2)}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default function CategoryPage() {
  const params = useParams();
  const slug = typeof params?.category === "string" ? params.category.toLowerCase() : "";
  const config = CATEGORY_CONFIG[slug];

  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    if (!config) return;

    let cancelled = false;

    fetch("/api/products")
      .then((response) => response.json())
      .then((data) => {
        if (cancelled) return;

        const categorizedProducts = (data.products || []).map((product) => {
          const resolvedCategory = resolveProductCategory(product);
          return {
            ...product,
            category: resolvedCategory,
            categoryLabel: resolvedCategory
              ? CATEGORY_CONFIG[resolvedCategory].title
              : "Unsorted",
          };
        });

        setProducts(categorizedProducts);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [config]);

  const visibleProducts = useMemo(
    () => products.filter((product) => product.category === slug),
    [products, slug]
  );

  const relatedCategories = CATEGORY_ORDER.filter((category) => category !== slug);

  function addToCart(product) {
    setCart((current) => {
      const existing = current.find((item) => item.priceId === product.priceId);
      if (existing) {
        return current.map((item) =>
          item.priceId === product.priceId ? { ...item, qty: item.qty + 1 } : item
        );
      }

      return [...current, { ...product, qty: 1 }];
    });

    setSelectedProduct(null);
    setCartOpen(true);
  }

  if (!config) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-5 text-center text-white">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] px-8 py-10">
          <p className="text-[11px] uppercase tracking-[0.35em] text-white/35">
            Unknown category
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Link
              href="/shop"
              className="rounded-full border border-white/12 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-white/70 transition hover:text-white"
            >
              Back to shop
            </Link>
            <Link
              href="/browse"
              className="rounded-full border border-[#ff5a36]/60 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-[#ff8a62] transition hover:bg-[#ff5a36] hover:text-black"
            >
              Browse all
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,90,54,0.18),_transparent_38%),linear-gradient(135deg,_rgba(255,255,255,0.03),_transparent_45%)]" />

      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8 lg:px-10">
        <header className="sticky top-0 z-50 mb-10 rounded-full border border-white/10 bg-black/55 px-5 py-4 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-white/45">
              <Link href="/" className="transition hover:text-white">
                Home
              </Link>
              <span>/</span>
              <Link href="/shop" className="transition hover:text-white">
                Shop
              </Link>
              <span>/</span>
              <span className="text-[#ff8a62]">{config.title}</span>
            </div>

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="rounded-full border border-white/15 px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-white/70 transition hover:border-[#ff5a36] hover:text-white"
            >
              Manifest {cart.length}
            </button>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-[#ff8a62]">
              {config.eyebrow}
            </p>
            <h1 className="mt-4 max-w-4xl text-6xl font-semibold uppercase tracking-[0.08em] text-white sm:text-7xl">
              {config.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/58">
              {config.description}
            </p>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
            <p className="text-[11px] uppercase tracking-[0.35em] text-white/35">
              Switch category
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {relatedCategories.map((category) => (
                <Link
                  key={category}
                  href={`/shop/${category}`}
                  className="rounded-full border border-white/12 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-white/70 transition hover:border-[#ff5a36] hover:bg-[#2a0904] hover:text-white"
                >
                  {CATEGORY_CONFIG[category].title}
                </Link>
              ))}
              <Link
                href="/browse"
                className="rounded-full border border-[#ff5a36]/60 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-[#ff8a62] transition hover:bg-[#ff5a36] hover:text-black"
              >
                Browse All
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-12">
          {status === "loading" ? (
            <div className="rounded-[32px] border border-white/10 bg-white/[0.03] px-6 py-16 text-center text-[11px] uppercase tracking-[0.35em] text-white/35">
              Loading catalogue
            </div>
          ) : null}

          {status === "error" ? (
            <div className="rounded-[32px] border border-[#ff5a36]/35 bg-[#1a0704] px-6 py-16 text-center text-[11px] uppercase tracking-[0.35em] text-[#ff8a62]">
              Product feed unavailable
            </div>
          ) : null}

          {status === "ready" && visibleProducts.length === 0 ? (
            <div className="rounded-[32px] border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
              <p className="text-[11px] uppercase tracking-[0.35em] text-white/35">
                No live products in {config.title}
              </p>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/50">
                Add Stripe product metadata like <code>category={slug}</code>, or include category keywords in the product title or description to have items appear here automatically.
              </p>
            </div>
          ) : null}

          {visibleProducts.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={setSelectedProduct}
                />
              ))}
            </div>
          ) : null}
        </section>
      </div>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
      />
      <CartDrawer cart={cart} open={cartOpen} onClose={() => setCartOpen(false)} />
    </main>
  );
}
