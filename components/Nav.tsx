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

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 1.95-1.56L23 6H6" />
    </svg>
  );
}

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
        <Logo size={40} />
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
          <CartIcon />
          Cart
          {itemCount > 0 && (
            <span className={`cart_badge${bump ? " cart_badge_bump" : ""}`}>{itemCount}</span>
          )}
        </button>
      </div>
    </nav>
  );
}
