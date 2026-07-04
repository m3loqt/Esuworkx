"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductDrawer({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function close() {
    setVisible(false);
    setTimeout(() => router.back(), 280);
  }

  return (
    <div
      className={`admin_drawer_backdrop${visible ? " admin_drawer_visible" : ""}`}
      onClick={close}
    >
      <div className="admin_drawer_panel" onClick={(e) => e.stopPropagation()}>
        <div className="admin_drawer_header">
          <h2 style={{ fontSize: 20, fontWeight: 800 }}>{title}</h2>
          <button
            type="button"
            onClick={close}
            className="admin_btn admin_btn_ghost admin_btn_sm"
            aria-label="Close"
          >
            Close ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
