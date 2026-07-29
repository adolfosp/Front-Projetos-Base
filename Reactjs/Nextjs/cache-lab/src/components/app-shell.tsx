"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { groups, labs } from "@/lib/labs";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="app-shell">
      <button
        className="mobile-menu"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
      >
        <span />
        <span />
      </button>

      {open && (
        <button
          className="sidebar-scrim"
          type="button"
          aria-label="Fechar menu"
          onClick={() => setOpen(false)}
        />
      )}

      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <Link className="brand" href="/" onClick={() => setOpen(false)}>
          <span className="brand-mark">
            <i />
            <i />
            <i />
          </span>
          <span>
            <strong>Cache Lab</strong>
            <small>Next.js 16</small>
          </span>
        </Link>

        <nav className="side-nav" aria-label="Laboratórios">
          <Link
            href="/"
            className={`nav-item nav-overview ${pathname === "/" ? "active" : ""}`}
            onClick={() => setOpen(false)}
          >
            <span className="nav-icon">⌂</span>
            Visão geral
          </Link>

          {groups.map((group) => (
            <div className="nav-group" key={group}>
              <p>{group}</p>
              {labs
                .filter((lab) => lab.group === group)
                .map((lab) => {
                  const href = `/laboratorios/${lab.slug}`;
                  return (
                    <Link
                      className={`nav-item ${pathname === href ? "active" : ""}`}
                      href={href}
                      key={lab.slug}
                      onClick={() => setOpen(false)}
                    >
                      <span className="nav-number">{lab.number}</span>
                      <span>{lab.shortTitle}</span>
                    </Link>
                  );
                })}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span className="online-dot" />
          <div>
            <strong>Modo laboratório</strong>
            <small>tempo acelerado</small>
          </div>
        </div>
      </aside>

      <main className="main-frame">{children}</main>
    </div>
  );
}

