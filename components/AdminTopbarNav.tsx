"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/works", label: "Works" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/newsletter", label: "Newsletter" },
];

export default function AdminTopbarNav() {
  const pathname = usePathname();

  return (
    <div className="admin_topbar_nav">
      {links.map((link) => {
        const active =
          link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
        return (
          <Link key={link.href} href={link.href} className={active ? "active" : ""}>
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
