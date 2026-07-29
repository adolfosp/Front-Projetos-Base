export type LabKind =
  | "cache-components"
  | "cache-life"
  | "profiles"
  | "update-tag"
  | "revalidate-tag"
  | "revalidate-path"
  | "no-store"
  | "force-cache"
  | "fetch-revalidate"
  | "unstable-cache"
  | "route-config"
  | "cache-layers";

export type Lab = {
  slug: string;
  number: string;
  group: "Cache Components" | "Modelo anterior" | "Fundamentos";
  title: string;
  shortTitle: string;
  eyebrow: string;
  summary: string;
  kind: LabKind;
  status: string;
  verdict: string;
  useWhen: string[];
  avoidWhen: string[];
  steps: string[];
  codeTitle: string;
  code: string;
  note?: string;
};

export const labs: Lab[] = [
  {
    slug: "cache-components",
    number: "01",
    group: "Cache Components",
    title: "Cache explícito com use cache",
    shortTitle: "use cache",
    eyebrow: "Next.js 16 · modelo atual",
    summary:
      "A função só entra no cache quando a diretiva é declarada. A política fica perto do dado, não espalhada pela rota.",
    kind: "cache-components",
    status: "Opt-in",
    verdict: "Bom padrão para projetos novos em Next.js 16.",
    useWhen: [
      "Funções, páginas ou componentes assíncronos públicos",
      "Você quer tornar a intenção de cache explícita",
      "O projeto pode usar o runtime Node.js",
    ],
    avoidWhen: [
      "Dados por usuário, sessão ou permissões",
      "A resposta precisa refletir cada alteração imediatamente",
    ],
    steps: [
      "A requisição entra na função cacheada.",
      "O Next.js calcula a chave pelos argumentos e valores fechados.",
      "Em MISS, a fonte é consultada e o resultado é armazenado.",
      "Em HIT, o resultado serializado volta sem repetir a consulta.",
    ],
    codeTitle: "lib/produtos.ts",
    code: `import { cacheLife, cacheTag } from "next/cache"

export async function buscarProdutos() {
  "use cache"

  cacheLife("hours")
  cacheTag("produtos")

  return await db.produto.findMany()
}`,
  },
  {
    slug: "cache-life",
    number: "02",
    group: "Cache Components",
    title: "A janela de vida do cache",
    shortTitle: "stale / revalidate / expire",
    eyebrow: "Cache Components · tempo",
    summary:
      "Três relógios cuidam de lugares diferentes: o roteador no navegador, a atualização no servidor e a expiração definitiva.",
    kind: "cache-life",
    status: "3 relógios",
    verdict: "Expire deve ser maior que revalidate.",
    useWhen: [
      "O negócio aceita uma janela controlada de desatualização",
      "Você quer resposta rápida com atualização em segundo plano",
      "O custo da origem justifica reutilizar resultados",
    ],
    avoidWhen: [
      "Informação financeira, estoque reservado ou autenticação",
      "Não existe tolerância a conteúdo antigo",
    ],
    steps: [
      "Durante stale, o Router Cache nem consulta o servidor.",
      "Antes de revalidate, o servidor entrega um HIT fresco.",
      "Após revalidate, entrega o antigo e atualiza em segundo plano.",
      "Após expire sem uso, a próxima leitura aguarda a origem.",
    ],
    codeTitle: "lib/indicadores.ts",
    code: `import { cacheLife } from "next/cache"

export async function buscarIndicadores() {
  "use cache"

  cacheLife({
    stale: 60,
    revalidate: 300,
    expire: 3600,
  })

  return await consultarIndicadores()
}`,
  },
  {
    slug: "perfis",
    number: "03",
    group: "Cache Components",
    title: "Perfis prontos e personalizados",
    shortTitle: "Perfis de cache",
    eyebrow: "Cache Components · decisão",
    summary:
      "Perfis transformam números soltos em uma decisão de produto legível: seconds, minutes, hours, days, weeks ou max.",
    kind: "profiles",
    status: "6 presets",
    verdict: "Nomeie a política quando ela for reutilizada.",
    useWhen: [
      "Vários dados compartilham a mesma política",
      "A equipe precisa revisar frescor sem caçar números",
      "Você quer padronizar decisões de cache",
    ],
    avoidWhen: [
      "A regra é única e não será reutilizada",
      "O perfil esconde uma exceção importante do negócio",
    ],
    steps: [
      "Classifique o dado pela frequência de mudança.",
      "Defina quanto tempo desatualizado ainda é aceitável.",
      "Escolha o preset mais próximo ou crie um perfil nomeado.",
      "Associe uma tag quando houver mutação conhecida.",
    ],
    codeTitle: "next.config.ts + lib/produtos.ts",
    code: `// next.config.ts
const nextConfig = {
  cacheComponents: true,
  cacheLife: {
    catalogo: {
      stale: 60,
      revalidate: 300,
      expire: 3600,
    },
  },
}

// lib/produtos.ts
export async function buscarProdutos() {
  "use cache"
  cacheLife("catalogo")
  return db.produto.findMany()
}`,
  },
  {
    slug: "update-tag",
    number: "04",
    group: "Cache Components",
    title: "Invalidação imediata com updateTag",
    shortTitle: "updateTag",
    eyebrow: "On-demand · read-your-writes",
    summary:
      "Depois da mutação, a entrada expira de imediato. A próxima leitura espera a fonte e nunca recebe a versão antiga.",
    kind: "update-tag",
    status: "Bloqueante",
    verdict: "Use quando o autor precisa ver sua alteração agora.",
    useWhen: [
      "Painéis administrativos e ações do próprio usuário",
      "A aplicação conhece exatamente o momento da mutação",
      "Conteúdo antigo após salvar causaria confusão",
    ],
    avoidWhen: [
      "Uma resposta stale ainda é aceitável",
      "A mutação acontece fora do controle da aplicação",
    ],
    steps: [
      "A mutação grava a nova versão na origem.",
      "updateTag expira todas as entradas com a tag.",
      "A próxima leitura encontra um MISS obrigatório.",
      "A tela aguarda e recebe apenas a versão atualizada.",
    ],
    codeTitle: "app/produtos/actions.ts",
    code: `"use server"

import { updateTag } from "next/cache"

export async function atualizarProduto(id: string, nome: string) {
  await db.produto.update({
    where: { id },
    data: { nome },
  })

  updateTag("produtos")
}`,
    note: "updateTag só pode ser chamado dentro de Server Actions.",
  },
  {
    slug: "revalidate-tag",
    number: "05",
    group: "Cache Components",
    title: "Atualização suave com revalidateTag",
    shortTitle: "revalidateTag",
    eyebrow: "On-demand · stale-while-revalidate",
    summary:
      "A tag é marcada como stale. A próxima visita recebe a resposta antiga imediatamente enquanto o servidor atualiza o cache.",
    kind: "revalidate-tag",
    status: "SWR",
    verdict: "Use quando velocidade vale mais que consistência imediata.",
    useWhen: [
      "Catálogos, notícias, blog e documentação",
      "Uma versão ligeiramente antiga não causa prejuízo",
      "Você quer evitar uma espera após a invalidação",
    ],
    avoidWhen: [
      "O usuário precisa confirmar sua própria alteração",
      "O valor exibido participa de uma decisão crítica",
    ],
    steps: [
      "A origem recebe uma nova versão.",
      "revalidateTag(tag, 'max') marca o cache como stale.",
      "A próxima leitura recebe o valor anterior rapidamente.",
      "A atualização roda ao fundo e abastece a visita seguinte.",
    ],
    codeTitle: "app/api/webhook/route.ts",
    code: `import { revalidateTag } from "next/cache"

export async function POST() {
  revalidateTag("produtos", "max")

  return Response.json({
    revalidated: true,
  })
}`,
  },
  {
    slug: "revalidate-path",
    number: "06",
    group: "Cache Components",
    title: "Invalidação por rota",
    shortTitle: "revalidatePath",
    eyebrow: "On-demand · caminho",
    summary:
      "Em vez de localizar dados por tag, você invalida o conteúdo associado a um caminho específico.",
    kind: "revalidate-path",
    status: "Por rota",
    verdict: "Útil quando a unidade mental do negócio é a página.",
    useWhen: [
      "A mutação afeta uma página inteira conhecida",
      "Vários dados da rota precisam ser recalculados juntos",
      "O caminho é mais estável que a lista de tags",
    ],
    avoidWhen: [
      "O mesmo dado aparece em muitas rotas",
      "A invalidação precisa ser granular",
    ],
    steps: [
      "Uma rota está servindo conteúdo cacheado.",
      "A mutação altera a origem.",
      "revalidatePath marca o caminho para revalidação.",
      "A próxima visita reconstrói o conteúdo afetado.",
    ],
    codeTitle: "app/produtos/actions.ts",
    code: `"use server"

import { revalidatePath } from "next/cache"

export async function publicarProduto() {
  await salvarProduto()
  revalidatePath("/produtos")
}`,
  },
  {
    slug: "fetch-no-store",
    number: "07",
    group: "Modelo anterior",
    title: "Sem cache com no-store",
    shortTitle: "fetch no-store",
    eyebrow: "Fetch · dado sempre atual",
    summary:
      "Cada requisição atravessa o servidor e consulta a origem. Nada é gravado no Data Cache para a próxima visita.",
    kind: "no-store",
    status: "Sempre MISS",
    verdict: "Correto para dado individual ou crítico.",
    useWhen: [
      "Sessão, perfil, permissões ou pagamentos",
      "Estoque reservado e dados personalizados",
      "Cada leitura precisa refletir o estado mais recente",
    ],
    avoidWhen: [
      "A origem é cara e o dado é público",
      "O negócio tolera alguns segundos de desatualização",
    ],
    steps: [
      "A requisição chega ao servidor.",
      "O Data Cache é ignorado.",
      "A API é consultada em todas as leituras.",
      "A resposta volta sem ser armazenada.",
    ],
    codeTitle: "lib/perfil.ts",
    code: `export async function buscarPerfil() {
  const resposta = await fetch(
    "https://api.exemplo.com/perfil",
    { cache: "no-store" },
  )

  return resposta.json()
}`,
  },
  {
    slug: "force-cache",
    number: "08",
    group: "Modelo anterior",
    title: "Cache persistente com force-cache",
    shortTitle: "fetch force-cache",
    eyebrow: "Fetch · cache explícito",
    summary:
      "A primeira leitura consulta a API. As seguintes reutilizam o Data Cache até uma invalidação ou remoção interna.",
    kind: "force-cache",
    status: "HIT após 1ª",
    verdict: "Ideal para conteúdo público muito estável.",
    useWhen: [
      "Conteúdo público e praticamente estático",
      "A origem tem custo alto",
      "Existe uma estratégia de invalidação",
    ],
    avoidWhen: [
      "O dado muda sem que a aplicação saiba",
      "Mostrar uma versão antiga tem impacto relevante",
    ],
    steps: [
      "A primeira leitura procura a chave e encontra MISS.",
      "A API responde e o resultado é armazenado.",
      "Leituras seguintes encontram HIT no Data Cache.",
      "A origem deixa de ser consultada até invalidar.",
    ],
    codeTitle: "lib/termos.ts",
    code: `export async function buscarTermos() {
  const resposta = await fetch(
    "https://api.exemplo.com/termos",
    { cache: "force-cache" },
  )

  return resposta.json()
}`,
  },
  {
    slug: "fetch-revalidate",
    number: "09",
    group: "Modelo anterior",
    title: "Revalidação temporal com fetch",
    shortTitle: "next.revalidate + tags",
    eyebrow: "Fetch · tempo + invalidação",
    summary:
      "A resposta é reutilizada por um intervalo. Depois dele, uma nova visita dispara a atualização — o segundo 300 sozinho não executa uma tarefa.",
    kind: "fetch-revalidate",
    status: "ISR",
    verdict: "Explicite tempo e tag na própria requisição.",
    useWhen: [
      "APIs públicas com atualização periódica",
      "Aplicações ainda no modelo anterior",
      "Você precisa combinar tempo e invalidação manual",
    ],
    avoidWhen: [
      "O projeto já migrou para Cache Components",
      "O dado não pode ficar stale durante a revalidação",
    ],
    steps: [
      "Em MISS, a API é consultada e o resultado é guardado.",
      "Durante o intervalo, as leituras são HIT.",
      "Depois do prazo, uma visita dispara a revalidação.",
      "A tag permite antecipar essa atualização.",
    ],
    codeTitle: "lib/produtos.ts",
    code: `export async function buscarProdutos() {
  const resposta = await fetch(
    "https://api.exemplo.com/produtos",
    {
      next: {
        revalidate: 300,
        tags: ["produtos"],
      },
    },
  )

  return resposta.json()
}`,
  },
  {
    slug: "unstable-cache",
    number: "10",
    group: "Modelo anterior",
    title: "Consultas sem fetch com unstable_cache",
    shortTitle: "unstable_cache",
    eyebrow: "Banco de dados · modelo anterior",
    summary:
      "Consultas diretas ao banco não entram no Data Cache sozinhas. unstable_cache envolve a função e inclui os argumentos na chave.",
    kind: "unstable-cache",
    status: "Legado",
    verdict: "No Next.js 16, prefira migrar para use cache.",
    useWhen: [
      "Projeto anterior sem Cache Components",
      "Prisma, Drizzle, MongoDB ou outro cliente direto",
      "O resultado deve sobreviver entre requisições",
    ],
    avoidWhen: [
      "Projeto novo com Cache Components",
      "A consulta depende de cookies ou headers dentro do cache",
    ],
    steps: [
      "A função recebe seus argumentos.",
      "A chave combina código, prefixo e argumentos.",
      "Em MISS, o banco é consultado.",
      "Em HIT, o resultado serializado é reutilizado.",
    ],
    codeTitle: "lib/produtos.ts",
    code: `import { unstable_cache } from "next/cache"

export const buscarProdutoPorId = unstable_cache(
  async (produtoId: string) => {
    return db.produto.findUnique({
      where: { id: produtoId },
    })
  },
  ["produto"],
  {
    revalidate: 300,
    tags: ["produtos"],
  },
)`,
  },
  {
    slug: "configuracao-de-rota",
    number: "11",
    group: "Modelo anterior",
    title: "Configuração de rota",
    shortTitle: "dynamic / revalidate",
    eyebrow: "Segment config · modelo anterior",
    summary:
      "dynamic, revalidate e fetchCache controlam o comportamento do segmento inteiro. Com Cache Components, são substituídos pelo modelo explícito.",
    kind: "route-config",
    status: "Segmento",
    verdict: "Prefira configurar o fetch quando a regra for local.",
    useWhen: [
      "Você mantém uma aplicação no modelo anterior",
      "Toda a rota compartilha a mesma política",
      "A configuração pode ser analisada estaticamente",
    ],
    avoidWhen: [
      "A rota mistura fontes com políticas diferentes",
      "Cache Components está habilitado",
    ],
    steps: [
      "O Next.js analisa a configuração no build.",
      "A menor revalidate da árvore pode prevalecer.",
      "force-dynamic renderiza a rota em cada requisição.",
      "force-static exige que o conteúdo seja pré-renderizável.",
    ],
    codeTitle: "app/produtos/page.tsx",
    code: `export const dynamic = "auto"
export const revalidate = 300
export const fetchCache = "auto"

export default async function ProdutosPage() {
  const produtos = await buscarProdutos()
  return <ListaProdutos produtos={produtos} />
}`,
    note: "revalidate precisa ser um literal estático e não funciona no Edge Runtime.",
  },
  {
    slug: "camadas-de-cache",
    number: "12",
    group: "Fundamentos",
    title: "Não confunda as camadas",
    shortTitle: "As 3 camadas",
    eyebrow: "Fundamentos · mapa mental",
    summary:
      "React.cache deduplica dentro da renderização; o Data Cache atravessa requisições; o Router Cache reutiliza payloads no navegador.",
    kind: "cache-layers",
    status: "3 escopos",
    verdict: "O nome “cache” esconde ciclos de vida bem diferentes.",
    useWhen: [
      "Você está diagnosticando uma resposta antiga",
      "Precisa escolher a API correta",
      "Quer explicar onde exatamente o HIT aconteceu",
    ],
    avoidWhen: [
      "Tratar as três camadas como equivalentes",
      "Confundir stale com o cabeçalho HTTP Cache-Control",
    ],
    steps: [
      "O Router Cache pode responder sem consultar o servidor.",
      "No servidor, React.cache evita trabalho duplicado no mesmo render.",
      "O Data Cache reutiliza dados entre requisições.",
      "CDN e cache HTTP formam outras camadas independentes.",
    ],
    codeTitle: "mapa-resumo.ts",
    code: `React.cache(fn)
// deduplica durante uma renderização

fetch(url, { cache: "force-cache" })
// reutiliza no Data Cache

cacheLife({ stale: 60 })
// informa o Router Cache do cliente

// stale NÃO configura Cache-Control`,
  },
];

export const labBySlug = new Map(labs.map((lab) => [lab.slug, lab]));

export const groups = [
  "Cache Components",
  "Modelo anterior",
  "Fundamentos",
] as const;

