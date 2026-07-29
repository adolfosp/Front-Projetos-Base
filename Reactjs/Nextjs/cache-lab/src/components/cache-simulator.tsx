"use client";

import { useEffect, useMemo, useState } from "react";
import type { LabKind } from "@/lib/labs";

type Tone = "neutral" | "hit" | "miss" | "stale" | "origin";
type EventItem = {
  id: number;
  at: number;
  label: string;
  detail: string;
  tone: Tone;
};

const wait = (duration = 420) =>
  new Promise((resolve) => window.setTimeout(resolve, duration));

function versionLabel(version: number | null) {
  return version ? `v${version}` : "vazio";
}

const profiles = [
  {
    name: "seconds",
    stale: 30,
    revalidate: 1,
    expire: 60,
    use: "placar ao vivo",
    color: "#f56f46",
  },
  {
    name: "minutes",
    stale: 300,
    revalidate: 60,
    expire: 3600,
    use: "feed de notícias",
    color: "#eab64d",
  },
  {
    name: "hours",
    stale: 300,
    revalidate: 3600,
    expire: 86400,
    use: "catálogo",
    color: "#91cf9c",
  },
  {
    name: "days",
    stale: 300,
    revalidate: 86400,
    expire: 604800,
    use: "artigos",
    color: "#84b9f5",
  },
  {
    name: "weeks",
    stale: 300,
    revalidate: 604800,
    expire: 2592000,
    use: "newsletter",
    color: "#a9a0f8",
  },
  {
    name: "max",
    stale: 300,
    revalidate: 2592000,
    expire: 31536000,
    use: "termos legais",
    color: "#d99ee9",
  },
];

function formatSeconds(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${seconds / 60}min`;
  if (seconds < 86400) return `${seconds / 3600}h`;
  if (seconds < 604800) return `${seconds / 86400}d`;
  if (seconds < 2592000) return `${seconds / 604800}sem`;
  if (seconds < 31536000) return `${seconds / 2592000}mês`;
  return `${seconds / 31536000}ano`;
}

function ProfileExplorer() {
  const [selected, setSelected] = useState(2);
  const profile = profiles[selected];
  const maxLog = Math.log10(31536000);
  const widthFor = (value: number) =>
    `${Math.max(7, (Math.log10(value + 1) / maxLog) * 100)}%`;

  return (
    <section className="simulator profile-explorer">
      <div className="profile-picker">
        {profiles.map((item, index) => (
          <button
            key={item.name}
            className={selected === index ? "selected" : ""}
            style={{ "--profile-color": item.color } as React.CSSProperties}
            type="button"
            onClick={() => setSelected(index)}
          >
            <span />
            <strong>{item.name}</strong>
            <small>{item.use}</small>
          </button>
        ))}
      </div>

      <div className="profile-stage">
        <div className="profile-stage-header">
          <div>
            <span>cacheLife</span>
            <strong>(&quot;{profile.name}&quot;)</strong>
          </div>
          <p>Escala logarítmica para comparar intervalos muito diferentes.</p>
        </div>
        <div className="profile-bars">
          {(
            [
              ["stale", profile.stale, "Router Cache reutiliza sem consultar"],
              [
                "revalidate",
                profile.revalidate,
                "Servidor pode atualizar em segundo plano",
              ],
              [
                "expire",
                profile.expire,
                "Próxima leitura precisa aguardar dados novos",
              ],
            ] as const
          ).map(([label, value, description]) => (
            <div className="profile-bar-row" key={label}>
              <div>
                <strong>{label}</strong>
                <small>{description}</small>
              </div>
              <div className="profile-track">
                <span
                  style={{
                    width: widthFor(value),
                    backgroundColor: profile.color,
                  }}
                >
                  <i>{formatSeconds(value)}</i>
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="profile-callout">
          <span style={{ backgroundColor: profile.color }}>Escolha atual</span>
          <p>
            <strong>{profile.name}</strong> é um bom ponto de partida para{" "}
            {profile.use}. Ajuste se o limite de desatualização do negócio for
            menor.
          </p>
        </div>
      </div>
    </section>
  );
}

function RouteConfigSimulator() {
  const [mode, setMode] = useState<"auto" | "dynamic" | "static">("auto");
  const configs = {
    auto: {
      code: 'dynamic = "auto"',
      badge: "Next.js decide",
      detail:
        "Cada fetch mantém sua própria política. Conteúdo dinâmico ainda pode tornar a rota dinâmica.",
      nodes: ["Análise do segmento", "Política de cada fetch", "Render híbrido"],
    },
    dynamic: {
      code: 'dynamic = "force-dynamic"',
      badge: "Toda requisição",
      detail:
        "A rota renderiza por usuário e por requisição; equivale, em geral, a no-store e revalidate 0.",
      nodes: ["Requisição", "Render no servidor", "Resposta nova"],
    },
    static: {
      code: 'dynamic = "force-static"',
      badge: "Pré-render",
      detail:
        "A rota precisa ser pré-renderizável. APIs de request não podem fornecer valores dinâmicos.",
      nodes: ["Build", "HTML + RSC estáticos", "Resposta reutilizada"],
    },
  };
  const selected = configs[mode];

  return (
    <section className="simulator route-simulator">
      <div className="route-tabs" role="tablist" aria-label="Configuração dynamic">
        {(["auto", "dynamic", "static"] as const).map((option) => (
          <button
            key={option}
            type="button"
            className={mode === option ? "active" : ""}
            onClick={() => setMode(option)}
          >
            {option === "auto"
              ? "auto"
              : option === "dynamic"
                ? "force-dynamic"
                : "force-static"}
          </button>
        ))}
      </div>
      <div className="route-stage">
        <div className="route-code">
          <span>export const</span> {selected.code}
        </div>
        <div className="route-badge">{selected.badge}</div>
        <p>{selected.detail}</p>
        <div className="route-flow">
          {selected.nodes.map((node, index) => (
            <div key={node}>
              <span>{index + 1}</span>
              <strong>{node}</strong>
              {index < selected.nodes.length - 1 && <i>→</i>}
            </div>
          ))}
        </div>
        <div className="lowest-rule">
          <span>Regra de composição</span>
          <div>
            <small>layout</small>
            <strong>3600s</strong>
          </div>
          <b>+</b>
          <div>
            <small>página</small>
            <strong>300s</strong>
          </div>
          <b>=</b>
          <div className="result">
            <small>rota</small>
            <strong>300s</strong>
          </div>
          <p>O menor revalidate da árvore pode prevalecer.</p>
        </div>
      </div>
    </section>
  );
}

function CacheLayersExplorer() {
  const [active, setActive] = useState(0);
  const layers = [
    {
      name: "Router Cache",
      place: "Navegador",
      lifetime: "Entre navegações",
      description:
        "Reutiliza payloads RSC no cliente. O stale de cacheLife informa por quanto tempo ele pode responder sem rede.",
      example: "Voltar para uma rota já visitada",
      tone: "blue",
    },
    {
      name: "React.cache",
      place: "Render do servidor",
      lifetime: "Uma renderização",
      description:
        "Deduplica chamadas iguais durante o mesmo ciclo de renderização. Não mantém o resultado para a próxima requisição.",
      example: "Layout e página pedem o mesmo usuário",
      tone: "purple",
    },
    {
      name: "Data Cache",
      place: "Servidor",
      lifetime: "Entre requisições",
      description:
        "Guarda resultados de fetch ou funções cacheadas. É aqui que tags e revalidação atualizam o dado compartilhado.",
      example: "Mil visitantes consultam o mesmo catálogo",
      tone: "green",
    },
  ];

  return (
    <section className="simulator layers-simulator">
      <div className="layers-map">
        <div className="visitor-node">
          <span>YOU</span>
          <strong>Visitante</strong>
        </div>
        {layers.map((layer, index) => (
          <button
            key={layer.name}
            type="button"
            onClick={() => setActive(index)}
            className={`${layer.tone} ${active === index ? "active" : ""}`}
          >
            <small>0{index + 1}</small>
            <strong>{layer.name}</strong>
            <span>{layer.place}</span>
          </button>
        ))}
      </div>
      <div className={`layer-detail ${layers[active].tone}`}>
        <div>
          <span>Escopo</span>
          <strong>{layers[active].lifetime}</strong>
        </div>
        <p>{layers[active].description}</p>
        <div className="layer-example">
          <small>Exemplo</small>
          {layers[active].example}
        </div>
      </div>
    </section>
  );
}

export function CacheSimulator({ kind }: { kind: LabKind }) {
  if (kind === "profiles") return <ProfileExplorer />;
  if (kind === "route-config") return <RouteConfigSimulator />;
  if (kind === "cache-layers") return <CacheLayersExplorer />;
  return <RequestSimulator kind={kind} />;
}

function RequestSimulator({ kind }: { kind: LabKind }) {
  const [clock, setClock] = useState(0);
  const [clockRunning, setClockRunning] = useState(false);
  const [originVersion, setOriginVersion] = useState(1);
  const [cacheVersion, setCacheVersion] = useState<number | null>(null);
  const [cachedAt, setCachedAt] = useState(0);
  const [routerVersion, setRouterVersion] = useState<number | null>(null);
  const [routerAt, setRouterAt] = useState(0);
  const [invalidated, setInvalidated] = useState(false);
  const [busy, setBusy] = useState(false);
  const [activeNode, setActiveNode] = useState<"client" | "cache" | "origin" | null>(
    null,
  );
  const [result, setResult] = useState<{
    status: string;
    tone: Tone;
    version: number | null;
  }>({ status: "PRONTO", tone: "neutral", version: null });
  const [events, setEvents] = useState<EventItem[]>([
    {
      id: 1,
      at: 0,
      label: "Laboratório pronto",
      detail: "Faça a primeira requisição para preencher o fluxo.",
      tone: "neutral",
    },
  ]);

  const isTagMode =
    kind === "update-tag" ||
    kind === "revalidate-tag" ||
    kind === "revalidate-path";
  const isTimed = kind === "cache-life" || kind === "fetch-revalidate";
  const isNoStore = kind === "no-store";

  useEffect(() => {
    if (!clockRunning || busy) return;

    const interval = window.setInterval(() => {
      setClock((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [busy, clockRunning]);

  const labels = useMemo(() => {
    if (kind === "unstable-cache") {
      return {
        cache: "Function Cache",
        origin: "Banco de dados",
        cacheSub: "chave: produto + id",
      };
    }
    if (kind === "cache-components" || kind === "cache-life") {
      return {
        cache: "Cache do Next.js",
        origin: "Função / banco",
        cacheSub: kind === "cache-life" ? "perfil personalizado" : 'tag "produtos"',
      };
    }
    return {
      cache: "Data Cache",
      origin: "API de origem",
      cacheSub: isNoStore ? "ignorado" : 'chave: GET "/dados"',
    };
  }, [isNoStore, kind]);

  function addEvent(label: string, detail: string, tone: Tone) {
    setEvents((current) =>
      [
        {
          id: Date.now() + Math.random(),
          at: clock,
          label,
          detail,
          tone,
        },
        ...current,
      ].slice(0, 7),
    );
  }

  function reset() {
    setClock(0);
    setClockRunning(false);
    setOriginVersion(1);
    setCacheVersion(null);
    setCachedAt(0);
    setRouterVersion(null);
    setRouterAt(0);
    setInvalidated(false);
    setActiveNode(null);
    setResult({ status: "PRONTO", tone: "neutral", version: null });
    setEvents([
      {
        id: Date.now(),
        at: 0,
        label: "Laboratório reiniciado",
        detail: "Cache vazio e origem na versão 1.",
        tone: "neutral",
      },
    ]);
  }

  function advance(seconds: number) {
    const nextClock = clock + seconds;
    setClock(nextClock);
    setEvents((current) =>
      [
        {
          id: Date.now() + Math.random(),
          at: nextClock,
          label: `Relógio avançou ${seconds}s`,
          detail:
            "Nenhuma atualização acontece sozinha: é preciso uma nova visita.",
          tone: "neutral" as const,
        },
        ...current,
      ].slice(0, 7),
    );
  }

  function mutate() {
    const nextVersion = originVersion + 1;
    setOriginVersion(nextVersion);

    if (kind === "update-tag" || kind === "revalidate-path") {
      setCacheVersion(null);
      setRouterVersion(null);
      setInvalidated(true);
      setResult({
        status: kind === "update-tag" ? "TAG EXPIRADA" : "ROTA INVALIDADA",
        tone: "miss",
        version: cacheVersion,
      });
      addEvent(
        kind === "update-tag" ? "updateTag executado" : "revalidatePath executado",
        `A origem já está em v${nextVersion}; a próxima leitura precisa aguardar.`,
        "miss",
      );
    } else if (kind === "revalidate-tag") {
      setInvalidated(true);
      setRouterVersion(null);
      setResult({ status: "MARCADO STALE", tone: "stale", version: cacheVersion });
      addEvent(
        "revalidateTag(tag, “max”)",
        `A origem foi para v${nextVersion}; ${versionLabel(cacheVersion)} ainda pode ser servido uma vez.`,
        "stale",
      );
    } else {
      addEvent(
        `Origem alterada para v${nextVersion}`,
        "O cache não foi informado sobre a mudança.",
        "origin",
      );
    }
  }

  async function request() {
    if (busy) return;
    setClockRunning(true);
    setBusy(true);
    setActiveNode("client");
    setResult({ status: "REQUISIÇÃO", tone: "neutral", version: result.version });
    addEvent("Nova requisição", `t = ${clock}s`, "neutral");
    await wait();

    if (
      kind === "cache-life" &&
      routerVersion !== null &&
      clock - routerAt < 30
    ) {
      setResult({ status: "ROUTER HIT", tone: "hit", version: routerVersion });
      addEvent(
        "HIT no Router Cache",
        `O navegador devolveu ${versionLabel(routerVersion)} sem consultar o servidor.`,
        "hit",
      );
      setActiveNode(null);
      setBusy(false);
      return;
    }

    setActiveNode("cache");
    await wait();

    if (isNoStore) {
      setResult({ status: "CACHE IGNORADO", tone: "miss", version: null });
      addEvent(
        "no-store",
        "O Data Cache não foi consultado nem será preenchido.",
        "miss",
      );
      setActiveNode("origin");
      await wait(520);
      setResult({ status: "ORIGEM", tone: "origin", version: originVersion });
      addEvent(
        "API consultada",
        `${versionLabel(originVersion)} voltou sem ser armazenada.`,
        "origin",
      );
      setActiveNode(null);
      setBusy(false);
      return;
    }

    if (cacheVersion === null) {
      setResult({ status: "MISS", tone: "miss", version: null });
      addEvent(
        invalidated ? "MISS após invalidação" : "MISS no cache",
        "Nenhum resultado reutilizável foi encontrado.",
        "miss",
      );
      setActiveNode("origin");
      await wait(620);
      setCacheVersion(originVersion);
      setCachedAt(clock);
      setRouterVersion(originVersion);
      setRouterAt(clock);
      setInvalidated(false);
      setResult({ status: "ATUALIZADO", tone: "origin", version: originVersion });
      addEvent(
        "Origem consultada",
        `${versionLabel(originVersion)} foi armazenada antes de responder.`,
        "origin",
      );
      setActiveNode(null);
      setBusy(false);
      return;
    }

    if (kind === "revalidate-tag" && invalidated) {
      const servedVersion = cacheVersion;
      setResult({ status: "STALE · SWR", tone: "stale", version: servedVersion });
      addEvent(
        "Stale servido imediatamente",
        `${versionLabel(servedVersion)} foi entregue; a atualização começou ao fundo.`,
        "stale",
      );
      setActiveNode("origin");
      await wait(800);
      setCacheVersion(originVersion);
      setCachedAt(clock);
      setInvalidated(false);
      setActiveNode("cache");
      addEvent(
        "Revalidação concluída",
        `${versionLabel(originVersion)} abasteceu o cache para a próxima visita.`,
        "origin",
      );
      await wait(240);
      setActiveNode(null);
      setBusy(false);
      return;
    }

    const cacheAge = clock - cachedAt;
    const revalidateAt = kind === "cache-life" ? 60 : 45;
    const expireAt = kind === "cache-life" ? 120 : Number.POSITIVE_INFINITY;

    if (isTimed && cacheAge >= expireAt) {
      setResult({ status: "EXPIRADO", tone: "miss", version: cacheVersion });
      addEvent(
        "Cache expirado",
        `${versionLabel(cacheVersion)} passou do limite; a resposta precisa aguardar.`,
        "miss",
      );
      setActiveNode("origin");
      await wait(680);
      setCacheVersion(originVersion);
      setCachedAt(clock);
      setRouterVersion(originVersion);
      setRouterAt(clock);
      setResult({ status: "ATUALIZADO", tone: "origin", version: originVersion });
      addEvent(
        "Atualização bloqueante",
        `${versionLabel(originVersion)} foi carregada e entregue.`,
        "origin",
      );
      setActiveNode(null);
      setBusy(false);
      return;
    }

    if (isTimed && cacheAge >= revalidateAt) {
      const staleVersion = cacheVersion;
      setResult({ status: "STALE · SWR", tone: "stale", version: staleVersion });
      addEvent(
        "Janela de revalidação",
        `${versionLabel(staleVersion)} foi servida; a visita disparou o refresh.`,
        "stale",
      );
      setActiveNode("origin");
      await wait(800);
      setCacheVersion(originVersion);
      setCachedAt(clock);
      setRouterVersion(staleVersion);
      setRouterAt(clock);
      addEvent(
        "Background refresh",
        `${versionLabel(originVersion)} está pronta para a próxima requisição.`,
        "origin",
      );
      setActiveNode(null);
      setBusy(false);
      return;
    }

    setResult({ status: "HIT", tone: "hit", version: cacheVersion });
    setRouterVersion(cacheVersion);
    setRouterAt(clock);
    addEvent(
      "HIT no cache",
      `${versionLabel(cacheVersion)} voltou sem consultar a origem.`,
      "hit",
    );
    setActiveNode(null);
    setBusy(false);
  }

  const cacheAge = cacheVersion === null ? 0 : clock - cachedAt;

  return (
    <section className="simulator request-simulator">
      <div className="sim-toolbar">
        <div className="clock">
          <span>
            Tempo virtual
            <i className={clockRunning ? "running" : ""}>
              {clockRunning ? (busy ? "processando" : "rodando") : "pausado"}
            </i>
          </span>
          <strong>
            00:{String(Math.floor(clock / 60)).padStart(2, "0")}:
            {String(clock % 60).padStart(2, "0")}
          </strong>
          <small>
            {clockRunning
              ? "1 segundo virtual = 1 segundo real"
              : "inicia após a primeira requisição"}
          </small>
        </div>
        <div className="sim-actions">
          {isTimed && (
            <>
              <button
                type="button"
                className="ghost-btn"
                onClick={() => advance(30)}
                aria-label="Avançar 30 segundos"
                data-tooltip="Avança 30 segundos no cenário. Apenas mover o relógio não atualiza o cache."
              >
                + 30s
              </button>
              <button
                type="button"
                className="ghost-btn"
                onClick={() => advance(60)}
                aria-label="Avançar 60 segundos"
                data-tooltip="Avança 60 segundos e aproxima o cache das janelas de revalidate e expire."
              >
                + 60s
              </button>
            </>
          )}
          <button
            type="button"
            className="ghost-btn"
            onClick={reset}
            disabled={busy}
            aria-label="Reiniciar simulação"
            data-tooltip="Zera o relógio, limpa os caches, restaura a origem para v1 e pausa a contagem."
          >
            Reiniciar
          </button>
          <button
            type="button"
            className="primary-btn"
            onClick={request}
            disabled={busy}
            aria-label="Fazer requisição"
            data-tooltip="Percorre o fluxo usando o estado atual do relógio: pode resultar em MISS, HIT, stale ou expirado."
          >
            {busy ? "Processando…" : "Fazer requisição"}
          </button>
          {(isTagMode || isNoStore || isTimed || kind === "force-cache") && (
            <button
              type="button"
              className="mutation-btn"
              onClick={mutate}
              disabled={busy}
              aria-label={isTagMode ? "Alterar origem e invalidar" : "Alterar origem"}
              data-tooltip={
                isTagMode
                  ? "Simula uma mudança na fonte e executa a invalidação correspondente deste laboratório."
                  : "Cria uma nova versão na fonte da verdade. O cache atual continua antigo até ser atualizado."
              }
            >
              {isTagMode ? "Alterar + invalidar" : "Alterar origem"}
            </button>
          )}
        </div>
      </div>

      <div className="sim-body">
        <div className="flow-stage">
          {kind === "cache-life" && (
            <div className="router-strip">
              <span>Router Cache</span>
              <strong>{versionLabel(routerVersion)}</strong>
              <small>
                {routerVersion === null
                  ? "nenhum payload no navegador"
                  : `${Math.max(0, 30 - (clock - routerAt))}s de stale restantes`}
              </small>
            </div>
          )}

          <div className="flow-nodes">
            <div className={`flow-node client ${activeNode === "client" ? "active" : ""}`}>
              <div className="node-visual browser-visual">
                <span />
                <span />
                <span />
              </div>
              <strong>Navegador</strong>
              <small>solicita os dados</small>
            </div>

            <div
              className={`flow-connector ${activeNode === "cache" ? "moving" : ""}`}
            >
              <span>request</span>
              <i />
            </div>

            <div className={`flow-node cache ${activeNode === "cache" ? "active" : ""}`}>
              <div className="node-visual cache-visual">
                <span />
                <span />
                <span />
              </div>
              <strong>{labels.cache}</strong>
              <small>{labels.cacheSub}</small>
              <em>{versionLabel(cacheVersion)}</em>
            </div>

            <div className={`flow-connector ${activeNode === "origin" ? "moving" : ""}`}>
              <span>se MISS / stale</span>
              <i />
            </div>

            <div className={`flow-node origin ${activeNode === "origin" ? "active" : ""}`}>
              <div className="node-visual origin-visual">
                <span />
                <span />
                <span />
              </div>
              <strong>{labels.origin}</strong>
              <small>fonte da verdade</small>
              <em>{versionLabel(originVersion)}</em>
            </div>
          </div>

          <div className="result-console">
            <span>RESPOSTA</span>
            <strong className={result.tone}>{result.status}</strong>
            <p>
              versão <b>{versionLabel(result.version)}</b>
            </p>
            {cacheVersion !== null && (
              <small>idade do cache: {cacheAge}s</small>
            )}
          </div>

          {kind === "cache-life" && (
            <div className="time-ruler">
              <div className="ruler-track">
                <span className="fresh" style={{ width: "25%" }}>
                  stale 30s
                </span>
                <span className="server-fresh" style={{ width: "25%" }}>
                  revalidate 60s
                </span>
                <span className="swr" style={{ width: "50%" }}>
                  expire 120s
                </span>
                <i style={{ left: `${Math.min(100, (cacheAge / 120) * 100)}%` }} />
              </div>
            </div>
          )}
          {kind === "fetch-revalidate" && (
            <div className="time-ruler simple">
              <div className="ruler-track">
                <span className="fresh" style={{ width: "50%" }}>
                  HIT até 45s
                </span>
                <span className="swr" style={{ width: "50%" }}>
                  próxima visita revalida
                </span>
                <i style={{ left: `${Math.min(100, (cacheAge / 90) * 100)}%` }} />
              </div>
            </div>
          )}
        </div>

        <aside className="event-log">
          <div className="event-log-title">
            <div>
              <span className="pulse-dot" />
              Linha do tempo
            </div>
            <small>mais recente primeiro</small>
          </div>
          <div className="event-items" aria-live="polite">
            {events.map((event) => (
              <div className={`event-item ${event.tone}`} key={event.id}>
                <span>{String(event.at).padStart(3, "0")}s</span>
                <div>
                  <strong>{event.label}</strong>
                  <p>{event.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
