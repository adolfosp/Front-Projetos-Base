"use client";

import { useState } from "react";

export function CodeBlock({ code, title }: { code: string; title: string }) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <section className="code-card">
      <div className="code-titlebar">
        <div className="window-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <span>{title}</span>
        <button type="button" onClick={copyCode}>
          {copied ? "Copiado!" : "Copiar"}
        </button>
      </div>
      <pre>
        <code>
          {code.split("\n").map((line, index) => (
            <span className="code-line" key={`${index}-${line}`}>
              <i>{String(index + 1).padStart(2, "0")}</i>
              <b>{line || " "}</b>
            </span>
          ))}
        </code>
      </pre>
    </section>
  );
}

