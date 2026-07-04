import type { Metadata } from "next";
import Logo from "@/components/Logo";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Admin Login | Esuworx",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div className="admin_card" style={{ width: "100%", maxWidth: 360, textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <Logo size={40} />
        </div>
        <h1 style={{ fontSize: 18, fontWeight: 800, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 24 }}>
          Admin Login
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}
