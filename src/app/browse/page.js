"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// --- 1. UTILITIES ---
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@%$";
const scrambleText = (el, original) => {
  let frame = 0;
  const total = 16;
  const iv = setInterval(() => {
    if (!el) { clearInterval(iv); return; }
    if (frame >= total) { el.textContent = original; clearInterval(iv); return; }
    el.textContent = original.split("").map((c, i) =>
      i < Math.floor((frame / total) * original.length) ? c : CHARS[Math.floor(Math.random() * CHARS.length)]
    ).join("");
    frame++;
  }, 35);
  return iv;
};

// --- 2. SUB-COMPONENTS ---

/** Animated Loading Text */
function TypeText({ text, speed = 40, onComplete }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i));
      i++;
      if (i > text.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text]);
  return <p className="font-mono text-sm tracking-[0.3em] text-gray-400">{displayed}</p>;
}

/** Individual Product Card */
function MaskCard({ product, index, onOpen }) {
  const nameRef = useRef(null);
  const ivRef = useRef(null);

  return (
    <div 
      className="mask-card cursor-pointer" 
      style={{ animationDelay: `${index * 0.1}s` }}
      onMouseEnter={() => { ivRef.current = scrambleText(nameRef.current, product.name.toUpperCase()); }}
      onMouseLeave={() => { clearInterval(ivRef.current); if (nameRef.current) nameRef.current.textContent = product.name.toUpperCase(); }}
      onClick={() => onOpen(product)}
    >
      <div className="mask-img-wrap">
        {product.image ? <img src={product.image} className="mask-img" /> : <div className="mask-placeholder">IMG_NULL</div>}
        <div className="mask-scan" /><div className="bracket tl" /><div className="bracket tr" /><div className="bracket bl" /><div className="bracket br" />
      </div>
      <div className="mask-body">
        <h3 className="mask-name font-mono" ref={nameRef}>{product.name.toUpperCase()}</h3>
        <span className="mask-price font-mono">{product.amount ? `${product.currency} ${(product.amount / 100).toFixed(2)}` : "—"}</span>
      </div>
    </div>
  );
}

/** Cart Drawer */
function CartDrawer({ cart, open, onClose, onCheckout, loading }) {
  const total = cart.reduce((s, i) => s + i.amount * i.qty, 0);
  const currency = cart[0]?.currency || "USD";

  return (
    <>
      {/* Backdrop */}
      {open && <div className="cart-backdrop" onClick={onClose} />}
      
      {/* Drawer */}
      <div className={`cart-drawer ${open ? "cart-drawer--open" : ""}`}>
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] tracking-[0.3em] text-white/30">SYSTEM_MANIFEST</span>
            <span className="font-mono text-xs text-white/70">{cart.length} IDENTITIES LOADED</span>
          </div>
          <button className="text-white/30 hover:text-white transition-colors p-2" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Scrollable Items Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex items-center justify-center opacity-20 font-mono text-[10px] tracking-widest">
              // NO_DATA_FOUND
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.priceId} className="group border-b border-white/5 pb-4 last:border-0">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-mono text-[11px] tracking-wider text-white/80 group-hover:text-white transition-colors">
                    {item.name.toUpperCase()}
                  </span>
                  <span className="font-mono text-[11px] text-white/40">
                    {((item.amount * item.qty) / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[9px] font-mono tracking-widest text-white/20 uppercase">
                  <span>QTY: {item.qty}</span>
                  <span>{item.currency}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout Section */}
        {cart.length > 0 && (
          <div className="p-6 bg-white/[0.02] border-t border-white/10">
            <div className="flex justify-between items-end mb-6">
              <span className="font-mono text-[9px] tracking-[0.4em] text-white/30">TOTAL_REQUISITION</span>
              <span className="text-xl font-mono tracking-tighter text-white">
                <span className="text-[10px] mr-1 opacity-40">{currency}</span>
                {(total / 100).toFixed(2)}
              </span>
            </div>
            
            <button 
              className={`w-full py-4 font-mono text-[11px] tracking-[0.3em] transition-all duration-500 relative overflow-hidden group
                ${loading ? 'bg-white/10 text-white/40 cursor-wait' : 'bg-white text-black hover:bg-transparent hover:text-white border border-white'}
              `}
              onClick={onCheckout}
              disabled={loading}
            >
              <span className="relative z-10">
                {loading ? "ESTABLISHING_LINK..." : "PROCEED_TO_CHECKOUT →"}
              </span>
              {/* Subtle hover animation background */}
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 -z-0" />
            </button>
            
            <p className="mt-4 text-[8px] font-mono text-center text-white/10 tracking-[0.2em]">
              SECURE_ENCRYPTION_ENABLED // STRIPE_V3
            </p>
          </div>
        )}
      </div>
    </>
  );
}

// --- 3. MAIN PAGE ---
export default function BrowsePage() {
  const [booted, setBooted] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [status, setStatus] = useState("loading");
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    if (!booted) return;
    fetch("/api/products").then(r => r.json()).then(d => { setProducts(d.products || []); setStatus("ready"); }).catch(() => setStatus("error"));
  }, [booted]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.priceId === product.priceId);
      if (existing) return prev.map(i => i.priceId === product.priceId ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    setSelectedProduct(null);
    setCartOpen(true);
  };

  async function handleCheckout() {
    setCheckingOut(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart.map(i => ({ priceId: i.priceId, quantity: i.qty })) }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setCheckingOut(false);
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <style>{`
        .mask-card { border: 1px solid #111; padding: 1px; transition: 0.3s; animation: fadeIn 0.5s forwards; opacity: 0; position: relative; }
        .mask-card:hover { border-color: #444; }
        .mask-img-wrap { position: relative; overflow: hidden; aspect-ratio: 1; background: #080808; }
        .mask-img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(1); transition: 0.5s; }
        .mask-card:hover .mask-img { filter: grayscale(0); transform: scale(1.05); }
        .mask-body { padding: 15px; }
        .bracket { position: absolute; width: 8px; height: 8px; border: 1px solid white; opacity: 0; transition: 0.3s; }
        .mask-card:hover .bracket { opacity: 0.4; }
        .bracket.tl { top:5px; left:5px; border-right:0; border-bottom:0; }
        .bracket.tr { top:5px; right:5px; border-left:0; border-bottom:0; }
        .bracket.bl { bottom:5px; left:5px; border-right:0; border-top:0; }
        .bracket.br { bottom:5px; right:5px; border-left:0; border-top:0; }
        .cart-drawer { position:fixed; top:0; right:0; height:100vh; width:300px; z-index:150; background:#070707; border-left:1px solid #222; transform:translateX(100%); transition:0.4s cubic-bezier(0.16,1,0.3,1); display:flex; flex-direction:column; }
        .cart-drawer--open { transform:translateX(0); }
        .cart-backdrop { position:fixed; inset:0; z-index:149; background:rgba(0,0,0,0.7); }
        .sci-acquire { border: 1px solid white; padding: 12px; font-family: monospace; transition: 0.3s; cursor:pointer; }
        .sci-acquire:hover { background: white; color: black; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {!booted ? (
        <div className="h-screen flex items-center justify-center">
          <TypeText text="INITIALIZING_CATALOGUE..." onComplete={() => setBooted(true)} />
        </div>
      ) : (
        <div className="p-10 pt-32">
          <header className="fixed top-0 left-0 w-full p-8 z-50 bg-black/80 backdrop-blur-md border-b border-white/5 flex justify-between items-center">
             <Link href="/shop" className="font-mono text-xs opacity-40 hover:opacity-100">← BACK</Link>
             <button onClick={() => setCartOpen(true)} className="font-mono text-xs border border-white/20 px-4 py-2 hover:border-white">CART ({cart.length})</button>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((p, i) => <MaskCard key={p.id} product={p} index={i} onOpen={setSelectedProduct} />)}
          </div>

          {selectedProduct && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
              <div className="max-w-xl w-full border border-white/10 bg-[#050505] p-8 relative">
                <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-6 text-white/30 font-mono text-xs">✕ CLOSE</button>
                <img src={selectedProduct.image} className="w-full aspect-square object-cover mb-6" />
                <h2 className="text-2xl font-mono mb-2">{selectedProduct.name.toUpperCase()}</h2>
                <p className="text-white/40 mb-8 text-sm">{selectedProduct.description}</p>
                <button className="sci-acquire w-full" onClick={() => addToCart(selectedProduct)}>ACQUIRE IDENTITY</button>
              </div>
            </div>
          )}

          <CartDrawer cart={cart} open={cartOpen} onClose={() => setCartOpen(false)} onCheckout={handleCheckout} loading={checkingOut} />
        </div>
      )}
    </div>
  );
}