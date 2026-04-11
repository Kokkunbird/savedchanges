"use client";
import { useRouter } from "next/navigation";

export default function CheckoutSuccess() {
  const router = useRouter();
  return (
    <main style={{
      minHeight: "100vh",
      background: "#0a0608",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Barlow Condensed', sans-serif",
      padding: "0 24px",
      textAlign: "center",
      gap: 18,
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Barlow:wght@400&display=swap');`}</style>
      <div style={{ fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(200,30,10,0.7)" }}>ORDER CONFIRMED</div>
      <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: "0.04em", textTransform: "uppercase", color: "#fff", lineHeight: 1 }}>
        IDENTITY<br />ACQUIRED.
      </div>
      <div style={{ fontSize: 13, fontFamily: "'Barlow', sans-serif", color: "rgba(220,210,205,0.5)", lineHeight: 1.7, maxWidth: 280 }}>
        Your order is confirmed. A confirmation will be sent to your email. Your piece is being prepared.
      </div>
      <button
        onClick={() => router.push("/")}
        style={{
          marginTop: 8,
          background: "none",
          border: "1px solid rgba(200,30,10,0.6)",
          color: "#e63320",
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          padding: "12px 28px",
          cursor: "pointer",
        }}
      >
        RETURN HOME
      </button>
    </main>
  );
}
