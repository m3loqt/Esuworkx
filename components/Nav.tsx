"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import { useCart } from "@/lib/cart-context";

const links = [
  { href: "/", label: "Works" },
  { href: "/shop", label: "Shop" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const [bump, setBump] = useState(false);
  const prevCount = useRef(itemCount);

  useEffect(() => {
    if (itemCount !== prevCount.current) {
      prevCount.current = itemCount;
      setBump(true);
      const timer = setTimeout(() => setBump(false), 350);
      return () => clearTimeout(timer);
    }
  }, [itemCount]);

  return (
    <nav>
      <Link href="/" className="logo_container">
        <Logo />
      </Link>
      <div className="nav_links">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={pathname === link.href ? "active" : ""}
          >
            {link.label}
          </Link>
        ))}
        <button type="button" className="cart_trigger" onClick={openCart} aria-label="Open cart">
          Cart
          {itemCount > 0 && (
            <span className={`cart_badge${bump ? " cart_badge_bump" : ""}`}>{itemCount}</span>
          )}
        </button>
      </div>
    </nav>
  );
}
