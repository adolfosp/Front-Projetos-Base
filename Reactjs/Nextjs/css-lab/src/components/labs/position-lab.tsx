"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";

type PositionValue = "static" | "relative" | "absolute" | "fixed" | "sticky";

const VALUES: PositionValue[] = [
  "static",
  "relative",
  "absolute",
  "fixed",
  "sticky",
];

const EXPLANATIONS: Record<
  PositionValue,
  {
    phrase: string;
    plainMeaning: string;
    analogy: string;
    caution: string;
    flow: string;
    reference: string;
    offset: string;
    scroll: string;
    color: string;
  }
> = {
  static: {
    phrase: "É o comportamento padrão: o elemento fica exatamente onde o fluxo normal o colocou.",
    plainMeaning:
      "O navegador organiza a caixa junto com seus irmãos. Ela não usa coordenadas e não cria uma nova referência de posicionamento.",
    analogy:
      "Pense em uma pessoa numa fila: ela ocupa seu lugar e todos atrás respeitam esse espaço.",
    caution:
      "top, right, bottom, left e z-index não reposicionam um elemento static.",
    flow: "Permanece no fluxo",
    reference: "Fluxo normal",
    offset: "top e left são ignorados",
    scroll: "Rola junto com a página",
    color: "Neutro",
  },
  relative: {
    phrase: "O elemento continua ocupando seu lugar original, embora apareça deslocado na tela.",
    plainMeaning:
      "Os irmãos agem como se a caixa ainda estivesse na posição inicial. top e left movem apenas a representação visual do elemento.",
    analogy:
      "É como sair um passo para o lado na fila e deixar uma mochila guardando o seu lugar.",
    caution:
      "O espaço original não desaparece. Por isso relative não serve para fechar lacunas no layout.",
    flow: "Permanece no fluxo",
    reference: "Sua posição original",
    offset: "Desloca a pintura da caixa",
    scroll: "Rola junto com a página",
    color: "Azul",
  },
  absolute: {
    phrase: "O elemento sai do fluxo e passa a usar coordenadas dentro de uma caixa de referência.",
    plainMeaning:
      "Os irmãos ocupam o espaço que ele deixou. Sua origem é o ancestral mais próximo cujo position não seja static.",
    analogy:
      "É como prender um adesivo em um quadro: ele não ocupa espaço entre os outros objetos e suas medidas começam nas bordas do quadro.",
    caution:
      "Sem um ancestral posicionado, a referência sobe pela árvore e pode chegar ao bloco inicial da página.",
    flow: "Sai do fluxo",
    reference: "Containing block",
    offset: "Define coordenadas",
    scroll: "Rola com o documento",
    color: "Laranja",
  },
  fixed: {
    phrase: "O elemento sai do fluxo e fica preso à área visível do navegador.",
    plainMeaning:
      "Sua posição é calculada pela viewport. Ao rolar o conteúdo, a caixa permanece nas mesmas coordenadas da tela.",
    analogy:
      "É como um post-it colado no vidro do monitor: o conteúdo passa por trás, mas ele continua parado.",
    caution:
      "Também não reserva espaço. O conteúdo pode ficar escondido atrás do elemento fixed.",
    flow: "Sai do fluxo",
    reference: "Viewport do navegador",
    offset: "Define coordenadas",
    scroll: "Não acompanha o conteúdo",
    color: "Roxo",
  },
  sticky: {
    phrase: "O elemento começa no fluxo e só fica preso quando alcança o limite de rolagem.",
    plainMeaning:
      "Ele se comporta como relative até chegar ao valor de top, então acompanha a área de rolagem sem abandonar seu espaço original.",
    analogy:
      "É como uma etiqueta numa esteira: ela anda com a esteira até encostar no topo e então fica ali.",
    caution:
      "Precisa de um offset, como top, e pode ser limitado pelo overflow ou pela altura de um ancestral.",
    flow: "Permanece no fluxo",
    reference: "Área de rolagem mais próxima",
    offset: "Define o limite de aderência",
    scroll: "Alterna entre relativo e preso",
    color: "Verde",
  },
};

export function PositionLab() {
  const [position, setPosition] = useState<PositionValue>("static");
  const [top, setTop] = useState(24);
  const [left, setLeft] = useState(32);
  const [parentPositioned, setParentPositioned] = useState(true);
  const [guides, setGuides] = useState(true);
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const current = EXPLANATIONS[position];

  const cssCode = `.scene {
  position: ${parentPositioned ? "relative" : "static"};
}

.target {
  position: ${position};
  top: ${top}px;
  left: ${left}px;
}`;

  const preview = useMemo(
    () => makePreview({ position, top, left, parentPositioned, guides }),
    [position, top, left, parentPositioned, guides],
  );

  function reset() {
    setPosition("static");
    setTop(24);
    setLeft(32);
    setParentPositioned(true);
    setGuides(true);
    iframeRef.current?.contentWindow?.scrollTo({ top: 0 });
  }

  function testScroll() {
    const frame = iframeRef.current;
    if (!frame?.contentWindow) return;
    const currentScroll = frame.contentWindow.scrollY;
    frame.contentWindow.scrollTo({
      top: currentScroll > 200 ? 0 : 460,
      behavior: "smooth",
    });
  }

  async function copyCode() {
    await navigator.clipboard.writeText(cssCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <>
      <section className="position-workbench" aria-labelledby="workbench-title">
        <div className="workbench-head">
          <div>
            <span className="live-dot" />
            <span>Experimento 01</span>
            <h2 id="workbench-title">Troque um valor. Observe três efeitos.</h2>
          </div>
          <button className="reset-button" type="button" onClick={reset}>
            ↺ Restaurar
          </button>
        </div>

        <div className="value-tabs" role="group" aria-label="Valor de position">
          {VALUES.map((value) => (
            <button
              className={position === value ? "active" : ""}
              type="button"
              key={value}
              onClick={() => setPosition(value)}
              aria-pressed={position === value}
            >
              <span>{VALUES.indexOf(value) + 1}</span>
              {value}
            </button>
          ))}
        </div>

        <div className={`position-meaning meaning-${position}`} aria-live="polite">
          <div className="meaning-main">
            <span>EM PORTUGUÊS CLARO</span>
            <h3>
              <code>position: {position}</code>
            </h3>
            <p>{current.plainMeaning}</p>
          </div>
          <div className="meaning-note">
            <span aria-hidden="true">◎</span>
            <div>
              <small>IMAGEM MENTAL</small>
              <p>{current.analogy}</p>
            </div>
          </div>
          <div className="meaning-caution">
            <span aria-hidden="true">!</span>
            <div>
              <small>ATENÇÃO</small>
              <p>{current.caution}</p>
            </div>
          </div>
        </div>

        <div className="workbench-grid">
          <aside className="control-panel">
            <div className="panel-label">
              <span>CONTROLES</span>
              <small>valores reais</small>
            </div>

            <div className="range-control">
              <label htmlFor="top-offset">
                <span>top</span>
                <output>{top}px</output>
              </label>
              <input
                id="top-offset"
                type="range"
                min="0"
                max="120"
                value={top}
                onChange={(event) => setTop(Number(event.target.value))}
              />
              <div className="range-limits">
                <span>0</span>
                <span>120</span>
              </div>
            </div>

            <div className="range-control">
              <label htmlFor="left-offset">
                <span>left</span>
                <output>{left}px</output>
              </label>
              <input
                id="left-offset"
                type="range"
                min="0"
                max="180"
                value={left}
                onChange={(event) => setLeft(Number(event.target.value))}
              />
              <div className="range-limits">
                <span>0</span>
                <span>180</span>
              </div>
            </div>

            <div className="toggle-stack">
              <label>
                <span>
                  <strong>Pai posicionado</strong>
                  <small>.scene {"{ position: relative; }"}</small>
                </span>
                <input
                  type="checkbox"
                  checked={parentPositioned}
                  onChange={(event) => setParentPositioned(event.target.checked)}
                />
                <i />
              </label>
              <label>
                <span>
                  <strong>Guias visuais</strong>
                  <small>origem e containing block</small>
                </span>
                <input
                  type="checkbox"
                  checked={guides}
                  onChange={(event) => setGuides(event.target.checked)}
                />
                <i />
              </label>
            </div>

            <button className="scroll-button" type="button" onClick={testScroll}>
              <span>↕</span>
              Rolar viewport de teste
            </button>

            <div className="control-hint">
              <span>Teste sugerido</span>
              <p>
                Use <strong>absolute</strong> e desligue “Pai posicionado”.
                Depois compare <strong>fixed</strong> e <strong>sticky</strong>{" "}
                durante a rolagem.
              </p>
            </div>
          </aside>

          <div className="preview-panel">
            <div className="browser-chrome">
              <div className="browser-dots">
                <i />
                <i />
                <i />
              </div>
              <div className="address-bar">css-lab.local / viewport</div>
              <span>480 × 420</span>
            </div>
            <iframe
              ref={iframeRef}
              title={`Demonstração de position ${position}`}
              srcDoc={preview}
            />
            <div className="preview-footer">
              <span>
                <i className={`legend-color legend-${position}`} />
                elemento .target
              </span>
              <span>
                <i className="legend-flow" />
                posição original no fluxo
              </span>
            </div>
          </div>

          <aside className="inspector-panel">
            <div className="panel-label">
              <span>LEITURA DO LAYOUT</span>
              <small>ao vivo</small>
            </div>

            <div className="current-value">
              <small>position</small>
              <strong>{position}</strong>
              <span className={`value-swatch swatch-${position}`}>
                {current.color}
              </span>
            </div>

            <div className="current-phrase">
              <small>EFEITO PRINCIPAL</small>
              <p>{current.phrase}</p>
            </div>

            <dl className="behavior-list">
              <div>
                <dt>No fluxo?</dt>
                <dd>{current.flow}</dd>
              </div>
              <div>
                <dt>Referência</dt>
                <dd>{current.reference}</dd>
              </div>
              <div>
                <dt>Offsets</dt>
                <dd>{current.offset}</dd>
              </div>
              <div>
                <dt>Na rolagem</dt>
                <dd>{current.scroll}</dd>
              </div>
            </dl>

            <div className={`layout-verdict verdict-${position}`}>
              <span aria-hidden="true">
                {position === "static" ? "○" : position === "relative" ? "↗" : "✦"}
              </span>
              <p>
                {position === "static" &&
                  "Mude top e left: nada acontece. Elementos static não aceitam offsets."}
                {position === "relative" &&
                  "O contorno pontilhado marca o espaço que continua reservado."}
                {position === "absolute" &&
                  (parentPositioned
                    ? "A borda tracejada do pai é a origem das coordenadas."
                    : "Sem ancestral posicionado, a referência sobe para o bloco inicial.")}
                {position === "fixed" &&
                  "A viewport isolada é a referência, mesmo que o pai seja posicionado."}
                {position === "sticky" &&
                  "Role o painel: o elemento para quando alcança o valor de top."}
              </p>
            </div>

            <div className="quick-code-box">
              <div className="quick-code-head">
                <span>CSS ATUAL</span>
                <button type="button" onClick={copyCode}>
                  {copied ? "Copiado ✓" : "Copiar CSS"}
                </button>
              </div>
              <pre>
                <code>{cssCode}</code>
              </pre>
            </div>
          </aside>
        </div>
      </section>

      <section className="live-code-section">
        <div className="code-copy">
          <span className="section-kicker">CSS produzido</span>
          <h2>O código acompanha o experimento.</h2>
          <p>
            A viewport usa exatamente estas declarações. Para `static`, os
            offsets continuam no código de propósito: o navegador os ignora.
          </p>
        </div>
        <div className="code-window">
          <div className="code-window-head">
            <span>styles.css</span>
            <button type="button" onClick={copyCode}>
              {copied ? "Copiado ✓" : "Copiar"}
            </button>
          </div>
          <pre>
            <code>
              <SyntaxCode
                position={position}
                top={top}
                left={left}
                parentPositioned={parentPositioned}
              />
            </code>
          </pre>
        </div>
      </section>

      <section className="position-reference">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Mapa mental</span>
            <h2>Escolha pelo comportamento.</h2>
          </div>
          <p>
            Clique em qualquer valor para voltar ao experimento com aquela regra
            ativa.
          </p>
        </div>

        <div className="reference-table">
          <div className="reference-head">
            <span>VALOR</span>
            <span>FLUXO</span>
            <span>REFERÊNCIA</span>
            <span>USO COMUM</span>
          </div>
          {VALUES.map((value) => (
            <button
              type="button"
              key={value}
              className={position === value ? "active" : ""}
              onClick={() => {
                setPosition(value);
                document
                  .querySelector(".position-workbench")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              <strong>
                <i className={`legend-color legend-${value}`} />
                {value}
              </strong>
              <span>{EXPLANATIONS[value].flow}</span>
              <span>{EXPLANATIONS[value].reference}</span>
              <span>{commonUse(value)}</span>
              <b>↗</b>
            </button>
          ))}
        </div>
      </section>

      <section className="position-principle">
        <span>REGRA DE OURO</span>
        <blockquote>
          Primeiro pergunte se o elemento deve <em>ocupar espaço no fluxo</em>.
          Só depois escolha a referência das coordenadas.
        </blockquote>
        <div className="principle-flow">
          <div>
            <small>fica no fluxo</small>
            <strong>static · relative · sticky</strong>
          </div>
          <i>ou</i>
          <div>
            <small>sai do fluxo</small>
            <strong>absolute · fixed</strong>
          </div>
        </div>
      </section>

      <nav className="lab-pagination" aria-label="Navegação entre laboratórios">
        <Link href="/">
          <small>← Visão geral</small>
          <strong>Catálogo CSS</strong>
        </Link>
        <span className="next-disabled">
          <small>Próximo laboratório</small>
          <strong>Grid · em breve</strong>
        </span>
      </nav>
    </>
  );
}

function SyntaxCode({
  position,
  top,
  left,
  parentPositioned,
}: {
  position: PositionValue;
  top: number;
  left: number;
  parentPositioned: boolean;
}) {
  return (
    <>
      <span className="token-selector">.scene</span> {"{"}
      {"\n  "}
      <span className="token-property">position</span>:{" "}
      <span className="token-value">
        {parentPositioned ? "relative" : "static"}
      </span>
      ;{"\n"}
      {"}"}
      {"\n\n"}
      <span className="token-selector">.target</span> {"{"}
      {"\n  "}
      <span className="token-property">position</span>:{" "}
      <span className="token-value">{position}</span>;{"\n  "}
      <span className="token-property">top</span>:{" "}
      <span className="token-number">{top}px</span>;{"\n  "}
      <span className="token-property">left</span>:{" "}
      <span className="token-number">{left}px</span>;{"\n"}
      {"}"}
    </>
  );
}

function commonUse(value: PositionValue) {
  const uses: Record<PositionValue, string> = {
    static: "Conteúdo comum",
    relative: "Ajuste visual / pai do absolute",
    absolute: "Badge, tooltip, sobreposição",
    fixed: "FAB, banner, modal",
    sticky: "Cabeçalho e índice",
  };
  return uses[value];
}

function makePreview({
  position,
  top,
  left,
  parentPositioned,
  guides,
}: {
  position: PositionValue;
  top: number;
  left: number;
  parentPositioned: boolean;
  guides: boolean;
}) {
  const ghost =
    position === "relative"
      ? `.target::after {
          content: "espaço original";
          position: absolute;
          inset: 0;
          transform: translate(${-left}px, ${-top}px);
          border: 2px dashed #86908a;
          border-radius: 8px;
          color: #657069;
          display: grid;
          place-items: end center;
          padding-bottom: 5px;
          font: 600 10px/1 monospace;
          pointer-events: none;
        }`
      : "";

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <style>
      * { box-sizing: border-box; }
      html { scroll-behavior: smooth; background: #ecefe9; }
      body {
        margin: 0;
        min-height: 1280px;
        color: #172019;
        font-family: Arial, sans-serif;
        background:
          linear-gradient(rgba(23,32,25,.045) 1px, transparent 1px),
          linear-gradient(90deg, rgba(23,32,25,.045) 1px, transparent 1px),
          #ecefe9;
        background-size: 24px 24px;
      }
      .viewport-label {
        height: 66px;
        padding: 18px 22px;
        border-bottom: 1px solid rgba(23,32,25,.15);
        background: rgba(255,255,255,.66);
        font: 700 12px/1 monospace;
        letter-spacing: .12em;
      }
      .viewport-label span {
        display: block;
        margin-top: 7px;
        color: #747d76;
        font-weight: 400;
        letter-spacing: 0;
      }
      .spacer {
        height: 118px;
        display: grid;
        place-items: center;
        color: #919993;
        font: 11px/1 monospace;
      }
      .scene {
        ${parentPositioned ? "position: relative;" : "position: static;"}
        width: calc(100% - 52px);
        min-height: 410px;
        margin: 0 26px;
        padding: 42px 28px;
        border: ${guides ? "2px dashed #737f76" : "2px solid transparent"};
        border-radius: 12px;
        background: rgba(255,255,255,.74);
      }
      .scene-label {
        display: block;
        margin: -25px 0 18px;
        color: #68716a;
        font: 700 10px/1 monospace;
        letter-spacing: .08em;
      }
      .scene-label b { color: #172019; }
      .origin {
        display: ${guides ? "flex" : "none"};
        position: absolute;
        top: -5px;
        left: -5px;
        align-items: center;
        gap: 6px;
        color: #69736c;
        font: 700 10px/1 monospace;
      }
      .origin::before {
        content: "";
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: #ff5c35;
        box-shadow: 0 0 0 4px rgba(255,92,53,.17);
      }
      .flow-list {
        display: grid;
        gap: 10px;
        padding-top: 8px;
      }
      .card {
        min-height: 72px;
        padding: 14px 16px;
        border: 1px solid #c7cdc8;
        border-radius: 8px;
        background: #f6f7f3;
      }
      .card small {
        color: #7a837c;
        font: 700 10px/1 monospace;
      }
      .card strong {
        display: block;
        margin-top: 9px;
        font-size: 16px;
      }
      .target {
        position: ${position};
        top: ${top}px;
        left: ${left}px;
        z-index: 5;
        width: min(230px, calc(100% - 20px));
        min-height: 78px;
        padding: 14px 16px;
        border: 2px solid #172019;
        border-radius: 8px;
        color: #172019;
        background: ${
          position === "static"
            ? "#d9dfd8"
            : position === "relative"
              ? "#8dc5ff"
              : position === "absolute"
                ? "#ff714e"
                : position === "fixed"
                  ? "#b49cff"
                  : "#b9e555"
        };
        box-shadow: 5px 5px 0 rgba(23,32,25,.18);
      }
      .target small {
        color: rgba(23,32,25,.68);
        font: 800 10px/1 monospace;
        text-transform: uppercase;
      }
      .target strong {
        display: block;
        margin-top: 9px;
        font: 700 16px/1 Arial, sans-serif;
      }
      .target code {
        float: right;
        padding: 4px 6px;
        border-radius: 4px;
        background: rgba(255,255,255,.5);
        font: 700 10px/1 monospace;
      }
      ${ghost}
      .after-scene {
        height: 480px;
        padding-top: 220px;
        text-align: center;
        color: #7e8780;
        font: 11px/1.5 monospace;
      }
      .after-scene::before {
        content: "";
        display: block;
        width: 1px;
        height: 80px;
        margin: 0 auto 16px;
        background: #abb2ac;
      }
    </style>
  </head>
  <body>
    <div class="viewport-label">
      VIEWPORT DE TESTE
      <span>role para observar fixed e sticky</span>
    </div>
    <div class="spacer">↓ início da cena</div>
    <section class="scene">
      <span class="scene-label">.scene · <b>position: ${
        parentPositioned ? "relative" : "static"
      }</b></span>
      <span class="origin">0,0</span>
      <div class="flow-list">
        <article class="card">
          <small>ITEM A · FLUXO NORMAL</small>
          <strong>Elemento anterior</strong>
        </article>
        <article class="target">
          <code>${position}</code>
          <small>.target</small>
          <strong>Observe meu espaço</strong>
        </article>
        <article class="card">
          <small>ITEM C · FLUXO NORMAL</small>
          <strong>Elemento seguinte</strong>
        </article>
        <article class="card">
          <small>ITEM D · FLUXO NORMAL</small>
          <strong>Mais conteúdo para rolar</strong>
        </article>
      </div>
    </section>
    <div class="after-scene">fim da cena<br />continue rolando</div>
  </body>
</html>`;
}
