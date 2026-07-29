"use client";

import { useState } from "react";

const routeCases = [
  {
    id: "account",
    number: "01",
    title: "Painel autenticado",
    question: "A resposta depende do usuário atual?",
    answer: 'dynamic = "force-dynamic"',
    badge: "Por requisição",
    tone: "personal",
    summary:
      "Use quando cookies, sessão, permissões ou dados privados podem mudar a resposta para cada visitante.",
    behavior:
      "A página é renderizada novamente em cada requisição. O conteúdo completo da rota não é compartilhado entre usuários.",
    caution:
      "Isso não impede que uma consulta pública específica use seu próprio cache, mas o HTML da rota continua dinâmico.",
    code: `export const dynamic = "force-dynamic"

export default async function MinhaContaPage() {
  const usuario = await buscarUsuarioAtual()
  const permissoes = await buscarPermissoes(usuario.id)

  return (
    <Painel usuario={usuario} permissoes={permissoes} />
  )
}`,
  },
  {
    id: "catalog",
    number: "02",
    title: "Catálogo público",
    question: "Todos veem o mesmo dado e 5 minutos são aceitáveis?",
    answer: "revalidate = 300",
    badge: "ISR · 5 minutos",
    tone: "catalog",
    summary:
      "Use para páginas públicas que mudam periodicamente e aceitam uma pequena janela de desatualização.",
    behavior:
      "A primeira visita gera a rota. Durante 300 segundos o resultado é reutilizado; uma visita posterior permite a atualização.",
    caution:
      "O segundo 300 não executa uma tarefa sozinho. É necessária uma nova requisição ou uma invalidação por tag/path.",
    code: `export const revalidate = 300

export default async function CatalogoPage() {
  const produtos = await fetch(
    "https://api.exemplo.com/produtos",
    {
      next: {
        revalidate: 300,
        tags: ["produtos"],
      },
    },
  ).then((resposta) => resposta.json())

  return <Catalogo produtos={produtos} />
}`,
  },
  {
    id: "institutional",
    number: "03",
    title: "Página institucional",
    question: "O conteúdo só muda em deploys ou publicações?",
    answer: 'dynamic = "force-static"',
    badge: "Pré-render",
    tone: "static",
    summary:
      "Use para termos, páginas institucionais ou conteúdo muito estável que pode ser gerado antecipadamente.",
    behavior:
      "O Next.js pré-renderiza a página e reutiliza o resultado. Você ainda pode invalidá-la sob demanda após uma publicação.",
    caution:
      "Cookies, headers e outros dados específicos da requisição não podem definir o conteúdo dessa página.",
    code: `export const dynamic = "force-static"
export const revalidate = false

export default async function TermosPage() {
  const termos = await buscarTermosPublicos()

  return <Documento conteudo={termos} />
}

// Após publicar uma nova versão:
// revalidatePath("/termos")`,
  },
  {
    id: "hybrid",
    number: "04",
    title: "Rota híbrida",
    question: "A página combina dados com políticas diferentes?",
    answer: 'dynamic = "auto"',
    badge: "Política por fetch",
    tone: "hybrid",
    summary:
      "Mantenha auto quando cada fonte deve declarar sua própria política e a rota mistura dados públicos e atuais.",
    behavior:
      "O fetch do catálogo continua reutilizável, enquanto a cotação usa no-store. A presença do dado dinâmico torna a renderização da rota dinâmica.",
    caution:
      "É mais legível configurar cada fetch diretamente do que aplicar fetchCache global sem necessidade.",
    code: `export const dynamic = "auto"

export default async function OfertaPage() {
  const [catalogo, cotacao] = await Promise.all([
    fetch("/api/catalogo", {
      next: { revalidate: 3600 },
    }).then((res) => res.json()),

    fetch("/api/cotacao", {
      cache: "no-store",
    }).then((res) => res.json()),
  ])

  return <Oferta catalogo={catalogo} cotacao={cotacao} />
}`,
  },
] as const;

export function RouteUseCases() {
  const [selectedId, setSelectedId] = useState<(typeof routeCases)[number]["id"]>(
    "catalog",
  );
  const selected =
    routeCases.find((routeCase) => routeCase.id === selectedId) ?? routeCases[1];

  return (
    <section className="route-cases-section">
      <div className="section-heading">
        <div>
          <span className="section-kicker">Casos de uso</span>
          <h2>Qual configuração usar em cada situação?</h2>
        </div>
        <p>
          Escolha um cenário para comparar intenção, código e efeito na
          renderização.
        </p>
      </div>

      <div className="route-case-lab">
        <div className="case-selector" role="tablist" aria-label="Casos de configuração">
          {routeCases.map((routeCase) => (
            <button
              type="button"
              role="tab"
              aria-selected={selected.id === routeCase.id}
              className={selected.id === routeCase.id ? "active" : ""}
              onClick={() => setSelectedId(routeCase.id)}
              key={routeCase.id}
            >
              <span>{routeCase.number}</span>
              <div>
                <strong>{routeCase.title}</strong>
                <small>{routeCase.badge}</small>
              </div>
            </button>
          ))}
        </div>

        <div className={`case-detail ${selected.tone}`}>
          <div className="case-copy">
            <span className="case-question">{selected.question}</span>
            <strong className="case-answer">{selected.answer}</strong>
            <p>{selected.summary}</p>

            <div className="case-outcomes">
              <div>
                <span>O que acontece</span>
                <p>{selected.behavior}</p>
              </div>
              <div>
                <span>Cuidado</span>
                <p>{selected.caution}</p>
              </div>
            </div>
          </div>

          <div className="case-code">
            <div className="case-code-head">
              <span />
              <span />
              <span />
              <small>app/exemplo/page.tsx</small>
            </div>
            <pre>
              <code>{selected.code}</code>
            </pre>
          </div>
        </div>
      </div>

      <div className="route-decision-rule">
        <div>
          <span>01</span>
          <strong>É individual ou crítico?</strong>
          <p>
            Use <code>force-dynamic</code> ou <code>no-store</code>.
          </p>
        </div>
        <i>→</i>
        <div>
          <span>02</span>
          <strong>É público e muda com frequência conhecida?</strong>
          <p>
            Use <code>revalidate = N</code> e uma tag/path para antecipar.
          </p>
        </div>
        <i>→</i>
        <div>
          <span>03</span>
          <strong>É público e praticamente estático?</strong>
          <p>
            Use <code>force-static</code> ou mantenha a pré-renderização padrão.
          </p>
        </div>
      </div>

      <aside className="fetch-cache-note">
        <span>Onde entra fetchCache?</span>
        <p>
          <code>fetchCache</code> é uma configuração avançada para impor o
          comportamento padrão de todos os fetches da rota. Na maioria dos
          casos, prefira configurar cada <code>fetch</code>; use{" "}
          <code>force-no-store</code> ou <code>force-cache</code> globalmente
          apenas quando toda a árvore realmente precisa da mesma regra.
        </p>
      </aside>
    </section>
  );
}

