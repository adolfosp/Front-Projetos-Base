import Link from "next/link";
import { LabRenderer } from "@/components/lab-renderer";
import type { Topic } from "@/lib/topics";

export function LabPage({ topic }: { topic: Topic }) {
  return (
    <div className="page-wrap">
      <header className="topbar">
        <div className="breadcrumb">
          <Link href="/">CSS Lab</Link>
          <span>/</span>
          <span>{topic.group}</span>
          <span>/</span>
          <strong>{topic.shortTitle}</strong>
        </div>
        <a
          className="docs-link"
          href="https://developer.mozilla.org/pt-BR/docs/Web/CSS/position"
          target="_blank"
          rel="noreferrer"
        >
          Referência MDN <span>↗</span>
        </a>
      </header>

      <article className="lab-article">
        <section className="lab-hero">
          <div>
            <span className="eyebrow">{topic.eyebrow}</span>
            <h1>{topic.title}</h1>
            <p>{topic.description}</p>
          </div>
          <div className="hero-index">
            <span>{topic.number}</span>
            <small>{topic.statusLabel}</small>
          </div>
        </section>

        <LabRenderer topic={topic} />
      </article>
    </div>
  );
}
