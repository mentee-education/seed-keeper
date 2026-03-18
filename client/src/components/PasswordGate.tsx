import { useState } from "react";

const PASS_HASH = "NAU";
const STORAGE_KEY = "site_unlocked";

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(() => {
    return sessionStorage.getItem(STORAGE_KEY) === "true";
  });
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === PASS_HASH) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      setUnlocked(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  if (unlocked) return <>{children}</>;

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0a0a0a",
      fontFamily: "system-ui, sans-serif",
    }}>
      <form onSubmit={handleSubmit} style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
        padding: "48px",
        borderRadius: "12px",
        background: "#111",
        border: "1px solid #222",
        maxWidth: "360px",
        width: "100%",
      }}>
        <div style={{ fontSize: "14px", color: "#888", letterSpacing: "2px", textTransform: "uppercase" }}>
          Password Required
        </div>
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter password"
          autoFocus
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: "8px",
            border: error ? "1px solid #ef4444" : "1px solid #333",
            background: "#0a0a0a",
            color: "#fff",
            fontSize: "16px",
            outline: "none",
            transition: "border-color 0.2s",
          }}
        />
        <button type="submit" style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          border: "none",
          background: "#fff",
          color: "#000",
          fontSize: "14px",
          fontWeight: 600,
          cursor: "pointer",
        }}>
          Enter
        </button>
        {error && (
          <div style={{ color: "#ef4444", fontSize: "13px" }}>
            Incorrect password
          </div>
        )}
      </form>
    </div>
  );
}
