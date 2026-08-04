export type TopicStatus = "available" | "planned";

export type Topic = {
  slug: string;
  number: string;
  group: "Layout" | "Composição" | "Responsividade";
  title: string;
  shortTitle: string;
  description: string;
  eyebrow: string;
  status: TopicStatus;
  statusLabel: string;
  kind: "position" | "grid" | "subgrid" | "isolation" | "container-queries";
};

export const topics: Topic[] = [
  {
    slug: "position",
    number: "01",
    group: "Layout",
    title: "Position sem decorar regras",
    shortTitle: "position",
    description:
      "Veja quem continua no fluxo, qual caixa vira referência e o que muda quando a página rola.",
    eyebrow: "Layout · fluxo e coordenadas",
    status: "available",
    statusLabel: "Interativo",
    kind: "position",
  },
  {
    slug: "grid",
    number: "02",
    group: "Layout",
    title: "Grid",
    shortTitle: "grid",
    description:
      "Trilhas, áreas, alinhamento e dimensionamento em duas dimensões.",
    eyebrow: "Layout · duas dimensões",
    status: "planned",
    statusLabel: "Em breve",
    kind: "grid",
  },
  {
    slug: "subgrid",
    number: "03",
    group: "Layout",
    title: "Subgrid",
    shortTitle: "subgrid",
    description:
      "Como elementos aninhados podem herdar as trilhas de um grid ancestral.",
    eyebrow: "Layout · trilhas herdadas",
    status: "planned",
    statusLabel: "Em breve",
    kind: "subgrid",
  },
  {
    slug: "isolation",
    number: "04",
    group: "Composição",
    title: "Isolation",
    shortTitle: "isolation",
    description:
      "Contextos de empilhamento, z-index e composição sem surpresas.",
    eyebrow: "Composição · stacking context",
    status: "planned",
    statusLabel: "Em breve",
    kind: "isolation",
  },
  {
    slug: "container-queries",
    number: "05",
    group: "Responsividade",
    title: "Container queries",
    shortTitle: "@container",
    description:
      "Componentes que respondem ao espaço disponível, não apenas à viewport.",
    eyebrow: "Responsividade · contexto local",
    status: "planned",
    statusLabel: "Em breve",
    kind: "container-queries",
  },
];

export const availableTopics = topics.filter(
  (topic) => topic.status === "available",
);

export const topicBySlug = new Map(topics.map((topic) => [topic.slug, topic]));

export const groups = ["Layout", "Composição", "Responsividade"] as const;
