"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { CATEGORY_META, STATIC_PRODUCTS } from "../../../lib/products";

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function resolveCategory(slug, product) {
  if (product.metadata?.category === slug) return true;
  const searchable = `${product.name} ${product.description}`.toLowerCase();
  const keywords = {
    identities:  ["mask", "identity", "oni", "samson", "mecha", "smiling"],
    armory:      ["armour", "armor", "chest", "pauldron", "gauntlet", "costume"],
    arsenal:     ["katana", "blade", "sword", "prop", "weapon", "sleeve"],
    accessories: ["pendant", "earring", "bracelet", "cuff", "necklace", "ring"],
    apparel:     ["hoodie", "jacket", "shirt", "tee", "clothing", "apparel"],
  };
  return (keywords[slug] || []).some((kw) => searchable.includes(kw));
}

function formatStripePrice(product) {
  const amount = typeof product.amount === "number" ? product.amount / 100 : 0;
  return `${product.currency || "USD"} ${amount.toFixed(0)}`;
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function ProductCard({ product, onSelect, isStripe }) {
  const [hovered, setHovered] = useState(false);
  const price = isStripe ? formatStripePrice(product) : product.price;

  return (
    <div
      onClick={() => onSelect(product)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `1px solid ${hovered ? "rgba(230,51,32,0.9)" : "rgba(200,30,10,0.45)"}`,
        background: hovered ? "#110608" : "#0d0608",
        cursor: "pointer",
        transition: "border-color 0.2s, background 0.2s",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image */}
      <div style={{ width: "100%", aspectRatio: "3/4", overflow: "hidden", background: "#0a0608", position: "relative" }}>
        <img
          src={product.image || "/story1.jpg"}
          alt={product.name}
          onError={(e) => { e.target.src = "/story1.jpg"; }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            filter: "brightness(0.92)",
            transform: hovered ? "scale(1.04)" : "scale(1)",
            transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1)",
            display: "block",
            WebkitMaskImage: "linear-gradient(to bottom, black 58%, transparent 68%)",
            maskImage: "linear-gradient(to bottom, black 58%, transparent 68%)",
          }}
        />
        {product.note && (
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "6px 8px",
            background: "linear-gradient(0deg, rgba(0,0,0,0.85), transparent)",
            fontSize: 7,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#e63320",
          }}>
            {product.note}
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "10px 10px 14px", flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 9,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(200,190,185,0.45)",
        }}>
          {product.sub || product.categoryLabel || ""}
        </div>
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: "#e63320",
          lineHeight: 1.2,
        }}>
          {product.name}
        </div>
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 20,
          fontWeight: 700,
          color: "#e8e0dc",
          lineHeight: 1,
          marginTop: 4,
        }}>
          {price}
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCT MODAL ────────────────────────────────────────────────────────────
function ProductModal({ product, isStripe, onClose, onAddToCart }) {
  const price = isStripe ? formatStripePrice(product) : product.price;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.88)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          background: "#0d0608",
          border: "1px solid rgba(200,30,10,0.4)",
          borderBottom: "none",
          maxHeight: "90vh",
          overflowY: "auto",
          animation: "modal-up 0.3s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Image */}
        <div style={{ width: "100%", aspectRatio: "4/3", overflow: "hidden", position: "relative" }}>
          <img
            src={product.image || "/story1.jpg"}
            alt={product.name}
            onError={(e) => { e.target.src = "/story1.jpg"; }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              display: "block",
            }}
          />
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              background: "rgba(0,0,0,0.7)",
              border: "1px solid rgba(200,30,10,0.5)",
              color: "#e8e0dc",
              width: 32,
              height: 32,
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              fontSize: 14,
              fontFamily: "'Barlow Condensed', sans-serif",
            }}
          >
            ✕
          </button>
        </div>

        {/* Details */}
        <div style={{ padding: "20px 18px 28px" }}>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 10,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(200,190,185,0.45)",
            marginBottom: 6,
          }}>
            {product.sub || product.categoryLabel || ""}
          </div>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "#fff",
            lineHeight: 1,
            marginBottom: 14,
          }}>
            {product.name}
          </div>

          {product.description && (
            <p style={{
              fontSize: 13,
              lineHeight: 1.75,
              color: "rgba(220,210,205,0.65)",
              marginBottom: 20,
            }}>
              {product.description}
            </p>
          )}

          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 26,
            fontWeight: 700,
            color: "#e8e0dc",
            marginBottom: 20,
            borderTop: "1px solid rgba(200,30,10,0.2)",
            paddingTop: 16,
          }}>
            {price}
          </div>

          <button
            onClick={() => onAddToCart(product)}
            style={{
              width: "100%",
              background: "#cc2200",
              border: "none",
              color: "#fff",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              padding: "14px 0",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#e63320"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#cc2200"; }}
          >
            ADD TO CART
          </button>

          {product.note && (
            <div style={{
              marginTop: 10,
              textAlign: "center",
              fontSize: 9,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#e63320",
            }}>
              {product.note}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes modal-up {
          from { transform: translateY(40px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── CART DRAWER ──────────────────────────────────────────────────────────────
function CartDrawer({ cart, open, onClose, onCheckout }) {
  const total = cart.reduce((sum, item) => sum + (item.amount || 0) * item.qty, 0);

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 149,
            background: "rgba(0,0,0,0.7)",
          }}
        />
      )}
      <aside
        style={{
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          zIndex: 150,
          width: "min(100%, 360px)",
          background: "#0d0608",
          borderLeft: "1px solid rgba(200,30,10,0.3)",
          display: "flex",
          flexDirection: "column",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "16px 16px",
          borderBottom: "1px solid rgba(200,30,10,0.2)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 9,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(200,190,185,0.45)",
              marginBottom: 2,
            }}>
              YOUR CART
            </div>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#e8e0dc",
            }}>
              {cart.length} ITEM{cart.length !== 1 ? "S" : ""}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "1px solid rgba(200,30,10,0.3)",
              color: "rgba(200,190,185,0.6)",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: "6px 12px",
              cursor: "pointer",
            }}
          >
            CLOSE
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
          {cart.length === 0 ? (
            <div style={{
              border: "1px dashed rgba(200,30,10,0.2)",
              padding: "32px 16px",
              textAlign: "center",
              marginTop: 16,
            }}>
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(200,190,185,0.3)",
              }}>
                CART IS EMPTY
              </div>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                style={{
                  borderBottom: "1px solid rgba(200,30,10,0.15)",
                  paddingBottom: 12,
                  marginBottom: 12,
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                }}
              >
                <img
                  src={item.image || "/story1.jpg"}
                  alt={item.name}
                  onError={(e) => { e.target.src = "/story1.jpg"; }}
                  style={{ width: 52, height: 52, objectFit: "cover", flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: "#e8e0dc",
                    lineHeight: 1.2,
                  }}>
                    {item.name}
                  </div>
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 11,
                    color: "rgba(200,190,185,0.5)",
                    marginTop: 2,
                    letterSpacing: "0.1em",
                  }}>
                    QTY {item.qty}
                  </div>
                </div>
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#e63320",
                  flexShrink: 0,
                }}>
                  {item.price || formatStripePrice(item)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding: "16px", borderTop: "1px solid rgba(200,30,10,0.2)" }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}>
              <span style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 10,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "rgba(200,190,185,0.45)",
              }}>
                TOTAL
              </span>
              <span style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 20,
                fontWeight: 700,
                color: "#e8e0dc",
              }}>
                USD {(total / 100).toFixed(0)}
              </span>
            </div>
            <button
              onClick={onCheckout}
              style={{
                width: "100%",
                background: "#cc2200",
                border: "none",
                color: "#fff",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                padding: "14px 0",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#e63320"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#cc2200"; }}
            >
              CHECKOUT
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

// ─── CATEGORY PAGE ────────────────────────────────────────────────────────────
export default function CategoryPage() {
  const router = useRouter();
  const params = useParams();
  const slug = (params?.category || "").toLowerCase();
  const meta = CATEGORY_META[slug];

  const [products, setProducts] = useState([]);
  const [isStripe, setIsStripe] = useState(false);
  const [status, setStatus] = useState("loading"); // loading | ready
  const [selected, setSelected] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [imgSrc, setImgSrc] = useState(meta?.img || "/story1.jpg");

  useEffect(() => {
    setMounted(true);
    // Try Stripe first
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        const matched = (data.products || []).filter((p) => resolveCategory(slug, p));
        if (matched.length > 0) {
          setProducts(matched);
          setIsStripe(true);
        } else {
          setProducts(STATIC_PRODUCTS[slug] || []);
          setIsStripe(false);
        }
        setStatus("ready");
      })
      .catch(() => {
        setProducts(STATIC_PRODUCTS[slug] || []);
        setIsStripe(false);
        setStatus("ready");
      });
  }, [slug]);

  const addToCart = useCallback((product) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    setSelected(null);
    setCartOpen(true);
  }, []);

  const handleCheckout = useCallback(async () => {
    const stripeItems = cart.filter((i) => i.priceId);
    if (stripeItems.length === 0) return;
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: stripeItems.map((i) => ({ priceId: i.priceId, qty: i.qty })) }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (e) {
      console.error("Checkout error:", e);
    }
  }, [cart]);

  // 404-style if unknown category
  if (!meta) {
    return (
      <main style={{ minHeight: "100vh", background: "#0a0608", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", fontFamily: "'Barlow Condensed', sans-serif" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.3em", color: "rgba(200,190,185,0.4)", textTransform: "uppercase", marginBottom: 12 }}>
            UNKNOWN CATEGORY
          </div>
          <button onClick={() => router.push("/")} style={{ background: "none", border: "1px solid rgba(200,30,10,0.5)", color: "#e63320", padding: "10px 24px", fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>
            RETURN HOME
          </button>
        </div>
      </main>
    );
  }

  return (
    <>
      <main style={{
        minHeight: "100vh",
        background: "#0a0608",
        color: "#e8e0dc",
        maxWidth: 480,
        margin: "0 auto",
        fontFamily: "'Barlow Condensed', sans-serif",
        paddingBottom: 100,
        opacity: mounted ? 1 : 0,
        transition: "opacity 0.4s ease-out",
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500&display=swap');
        `}</style>

        {/* ── STICKY NAV ── */}
        <nav style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: "rgba(8,4,5,0.96)",
          backdropFilter: "blur(6px)",
          borderBottom: "1px solid rgba(200,30,10,0.2)",
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <button
            onClick={() => router.back()}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(200,190,185,0.6)",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 11,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            ← BACK
          </button>

          <div style={{
            fontSize: 18,
            fontWeight: 900,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "#fff",
          }}>
            {meta.label}
          </div>

          <button
            onClick={() => setCartOpen(true)}
            style={{
              background: cart.length > 0 ? "#cc2200" : "none",
              border: "1px solid rgba(200,30,10,0.5)",
              color: "#fff",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: "6px 12px",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            CART {cart.length > 0 ? `(${cart.length})` : ""}
          </button>
        </nav>

        {/* ── CATEGORY HERO ── */}
        <div style={{
          position: "relative",
          height: 160,
          overflow: "hidden",
          borderBottom: "1px solid rgba(200,30,10,0.2)",
        }}>
          <img
            src={imgSrc}
            alt={meta.label}
            onError={() => setImgSrc(meta.fallback)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 30%",
              filter: "brightness(0.35) saturate(0.7)",
              display: "block",
            }}
          />
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, rgba(10,6,8,0.85) 0%, rgba(10,6,8,0.3) 100%)",
          }} />
          <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 20px",
          }}>
            <div style={{
              fontSize: 9,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#e63320",
              marginBottom: 6,
            }}>
              {meta.sub}
            </div>
            <div style={{
              fontSize: 42,
              fontWeight: 900,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "#fff",
              lineHeight: 0.9,
              marginBottom: 10,
            }}>
              {meta.label}
            </div>
            <div style={{
              fontSize: 12,
              fontFamily: "'Barlow', sans-serif",
              color: "rgba(220,210,205,0.55)",
              lineHeight: 1.5,
              maxWidth: 260,
            }}>
              {meta.description}
            </div>
          </div>
        </div>

        {/* ── PRODUCT COUNT ── */}
        <div style={{
          padding: "10px 14px 6px",
          fontSize: 9,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "rgba(200,190,185,0.35)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}>
          {status === "loading" ? "LOADING..." : `${products.length} PRODUCT${products.length !== 1 ? "S" : ""}`}
          {!isStripe && status === "ready" && (
            <span style={{ color: "rgba(200,30,10,0.5)", marginLeft: 10 }}>● PREVIEW CATALOGUE</span>
          )}
        </div>

        {/* ── GRID ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 2,
          padding: "2px",
        }}>
          {status === "loading" && [1, 2, 3, 4].map((i) => (
            <div key={i} style={{
              aspectRatio: "3/4",
              background: "#0d0608",
              border: "1px solid rgba(200,30,10,0.15)",
              animation: "pulse 1.5s ease-in-out infinite",
            }} />
          ))}

          {status === "ready" && products.length === 0 && (
            <div style={{
              gridColumn: "1 / -1",
              border: "1px dashed rgba(200,30,10,0.2)",
              padding: "40px 20px",
              textAlign: "center",
              margin: "16px",
            }}>
              <div style={{
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(200,190,185,0.3)",
                marginBottom: 8,
              }}>
                NO PRODUCTS YET
              </div>
              <div style={{
                fontSize: 12,
                fontFamily: "'Barlow', sans-serif",
                color: "rgba(200,190,185,0.2)",
              }}>
                Products for this category will appear here.
              </div>
            </div>
          )}

          {status === "ready" && products.map((product, i) => (
            <div
              key={product.id}
              style={{
                opacity: 0,
                animation: `card-in 0.4s cubic-bezier(0.22,1,0.36,1) ${i * 0.06}s forwards`,
              }}
            >
              <ProductCard
                product={product}
                isStripe={isStripe}
                onSelect={setSelected}
              />
            </div>
          ))}
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.4; }
            50%       { opacity: 0.15; }
          }
          @keyframes card-in {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </main>

      {/* ── FIXED EXIT ── */}
      <button
        onClick={() => router.push("/")}
        style={{
          position: "fixed",
          bottom: 24,
          right: 16,
          zIndex: 50,
          background: "#0a0608",
          border: "1px solid rgba(200,30,10,0.6)",
          color: "#e63320",
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          padding: "10px 16px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 8,
          boxShadow: "0 0 12px rgba(200,30,10,0.15)",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(200,30,10,0.15)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "#0a0608"; }}
      >
        <span style={{ fontSize: 14 }}>✕</span> EXIT
      </button>

      {/* ── MODAL ── */}
      {selected && (
        <ProductModal
          product={selected}
          isStripe={isStripe}
          onClose={() => setSelected(null)}
          onAddToCart={addToCart}
        />
      )}

      {/* ── CART ── */}
      <CartDrawer
        cart={cart}
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={handleCheckout}
      />
    </>
  );
}
