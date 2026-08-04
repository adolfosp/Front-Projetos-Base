"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { groups, topics } from "@/lib/topics";

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
          <span className="brand-mark" aria-hidden="true">
            <i>{"{"}</i>
            <b>:</b>
            <i>{"}"}</i>
          </span>
          <span>
            <strong>CSS Lab</strong>
            <small>layout, sem mistério</small>
          </span>
        </Link>

        <nav className="side-nav" aria-label="Laboratórios de CSS">
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
              {topics
                .filter((topic) => topic.group === group)
                .map((topic) => {
                  const href = `/laboratorios/${topic.slug}`;
                  if (topic.status === "planned") {
                    return (
                      <span className="nav-item nav-disabled" key={topic.slug}>
                        <span className="nav-number">{topic.number}</span>
                        <span>{topic.shortTitle}</span>
                        <small>logo</small>
                      </span>
                    );
                  }

                  return (
                    <Link
                      className={`nav-item ${pathname === href ? "active" : ""}`}
                      href={href}
                      key={topic.slug}
                      onClick={() => setOpen(false)}
                    >
                      <span className="nav-number">{topic.number}</span>
                      <span>{topic.shortTitle}</span>
                    </Link>
                  );
                })}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span className="online-dot" />
          <div>
            <strong>1 experimento ativo</strong>
            <small>arquitetura pronta para crescer</small>
          </div>
        </div>
      </aside>

      <main className="main-frame">{children}</main>
    </div>
  );
}
