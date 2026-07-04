import Link from "next/link";
import AdminTopbarNav from "@/components/AdminTopbarNav";
import Logo from "@/components/Logo";
import { logout } from "./actions";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="admin_topbar">
        <Link href="/admin" className="admin_wordmark">
          <Logo size={28} />
          ESUWORX ADMIN
        </Link>
        <AdminTopbarNav />
        <form action={logout} style={{ justifySelf: "end" }}>
          <button type="submit" className="admin_btn admin_btn_ghost admin_btn_sm">
            Log out
          </button>
        </form>
      </div>
      {children}
    </div>
  );
}
