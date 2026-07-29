import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { CacheSimulator } from "@/components/cache-simulator";
import { RouteUseCases } from "@/components/route-use-cases";
import { labs, type Lab } from "@/lib/labs";

export function LabPage({ lab }: { lab: Lab }) {
  const index = labs.findIndex((item) => item.slug === lab.slug);
  const previous = labs[index - 1];
  const next = labs[index + 1];

  return (
    <div className="page-wrap">
      <header className="topbar">
        <div className="breadcrumb">
          <Link href="/">Cache Lab</Link>
          <span>/</span>
          <span>{lab.group}</span>
          <span>/</span>
          <strong>{lab.shortTitle}</strong>
        </div>
        <a
          className="docs-link"
          href="https://nextjs.org/docs/app/getting-started/cache-components"
          target="_blank"
          rel="noreferrer"
        >
          Documentação oficial <span>↗</span>
        </a>
      </header>

      <article className="lab-article">
        <section className="lab-hero">
          <div>
            <span className="eyebrow">{lab.eyebrow}</span>
            <h1>{lab.title}</h1>
            <p>{lab.summary}</p>
          </div>
          <div className="hero-index">
            <span>{lab.number}</span>
            <small>{lab.status}</small>
          </div>
        </section>

        <div className="sim-label-row">
          <div>
            <span className="pulse-dot" />
            Simulação visual
          </div>
          <p>Tempos acelerados para fins didáticos</p>
        </div>

        <CacheSimulator kind={lab.kind} />

        {lab.kind === "cache-life" && (
          <section className="stale-explainer">
            <div className="stale-title">
              <span>Conceito-chave</span>
              <h2>O que significa stale?</h2>
              <p>
                <strong>Stale</strong> é um dado cacheado que ultrapassou a
                janela de frescor, mas ainda pode ser entregue rapidamente
                enquanto o servidor busca uma versão mais nova em segundo
                plano. Stale não significa inválido — significa{" "}
                <em>possivelmente desatualizado, porém ainda utilizável</em>.
              </p>
            </div>
            <div className="freshness-states">
              <div className="fresh-state">
                <span>01</span>
                <strong>Fresh</strong>
                <p>Está dentro da janela. O cache responde sem consultar a origem.</p>
              </div>
              <i>→</i>
              <div className="stale-state">
                <span>02</span>
                <strong>Stale</strong>
                <p>Entrega a versão atual e dispara a atualização ao fundo.</p>
              </div>
              <i>→</i>
              <div className="expired-state">
                <span>03</span>
                <strong>Expired</strong>
                <p>Não pode mais ser usado. A próxima leitura aguarda a origem.</p>
              </div>
            </div>
          </section>
        )}

        {lab.kind === "route-config" && <RouteUseCases />}

        <section className="explain-grid">
          <div className="steps-panel">
            <span className="section-kicker">O que acontece</span>
            <h2>Passo a passo da requisição</h2>
            <ol className="steps-list">
              {lab.steps.map((step, stepIndex) => (
                <li key={step}>
                  <span>{String(stepIndex + 1).padStart(2, "0")}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="decision-panel">
            <div className="verdict">
              <span>Em uma frase</span>
              <strong>{lab.verdict}</strong>
            </div>
            <div className="decision-columns">
              <div>
                <span className="yes-icon">✓</span>
                <h3>Use quando</h3>
                <ul>
                  {lab.useWhen.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="no-icon">×</span>
                <h3>Evite quando</h3>
                <ul>
                  {lab.avoidWhen.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="code-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Código de referência</span>
              <h2>A política como aparece no projeto</h2>
            </div>
            <p>
              O painel mostra o comportamento; este trecho mostra a configuração
              que produz a política.
            </p>
          </div>
          <CodeBlock code={lab.code} title={lab.codeTitle} />
          {lab.note && <p className="code-note">Atenção: {lab.note}</p>}
        </section>

        <nav className="lab-pagination" aria-label="Navegação entre laboratórios">
          {previous ? (
            <Link href={`/laboratorios/${previous.slug}`}>
              <small>← Anterior</small>
              <strong>{previous.shortTitle}</strong>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/laboratorios/${next.slug}`} className="next-link">
              <small>Próximo →</small>
              <strong>{next.shortTitle}</strong>
            </Link>
          ) : (
            <Link href="/" className="next-link">
              <small>Concluir →</small>
              <strong>Visão geral</strong>
            </Link>
          )}
        </nav>
      </article>
    </div>
  );
}
