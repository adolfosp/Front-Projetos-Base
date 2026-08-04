# CSS Lab

Laboratório visual e interativo para aprender CSS observando o efeito real de
cada propriedade no layout.

## Primeiro experimento

`position`: compare `static`, `relative`, `absolute`, `fixed` e `sticky`, altere
os offsets, troque o bloco de referência e role uma viewport isolada.

## Executar

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Como adicionar uma propriedade

1. Registre o tópico em `src/lib/topics.ts`.
2. Crie o experimento em `src/components/labs`.
3. Faça o roteamento do novo `kind` em `src/components/lab-renderer.tsx`.

A navegação, o catálogo e as páginas dinâmicas consomem o mesmo registro.
