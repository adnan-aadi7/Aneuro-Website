// src/components/ui/AneuroToaster.jsx
import { Toaster } from "react-hot-toast";

export default function AneuroToaster() {
  return (
    <Toaster
      position="top-right"
      gutter={10}
      toastOptions={{
        // global styles – dark card + cyan glow
        style: {
          background: "#111423",   // deep navy like your app
          color: "#e8f6ff",
          border: "1px solid rgba(19,181,234,0.35)", // rgb(19,181,234)
          boxShadow:
            "0 10px 25px rgba(0,0,0,.35), 0 0 24px rgba(19,181,234,.18)",
          borderRadius: "14px",
          padding: "12px 14px",
        },
        success: {
          iconTheme: {
            primary: "rgb(19,181,234)",
            secondary: "#0b0f1b",
          },
        },
        error: {
          iconTheme: {
            primary: "#ff6b6b",
            secondary: "#0b0f1b",
          },
          style: { border: "1px solid rgba(255,107,107,.35)" },
        },
        loading: {
          style: { opacity: 0.85 },
        },
      }}
    />
  );
}
