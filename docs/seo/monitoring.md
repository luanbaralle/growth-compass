# SEO — Monitoramento orgânico Raise One

Checklist operacional para acompanhar tráfego orgânico do blog e do site após indexação.

## Google Search Console (semanal)

1. **Desempenho** → filtrar por página `/blog/`
   - Impressões e cliques por query
   - CTR médio (meta: > 2% em long-tail após 60 dias)
   - Posição média por artigo pilar

2. **Indexação** → Páginas
   - Confirmar 17+ URLs de blog indexadas
   - Resolver erros de cobertura (404, redirect, canonical)

3. **Sitemaps**
   - URL: `https://raiseone.com.br/sitemap.xml`
   - Reenviar após cada lote de artigos novos ou expansões grandes
   - Comando local: `npm run generate:seo`

4. **Inspeção de URL** (após publicar conteúdo)
   - Solicitar indexação de artigos pilares e clusters novos

## GA4 (mensal)

| Métrica | Onde ver | Meta 90 dias |
|---------|----------|--------------|
| Sessões orgânicas `/blog/*` | Relatórios → Páginas | Crescimento mês a mês |
| Top 10 landing pages orgânicas | Aquisição → Tráfego orgânico | 3+ artigos no top 10 |
| Conversões Diagnóstico (origem blog) | Eventos / UTMs | Baseline + 20% |
| Cliques WhatsApp (origem blog) | Eventos | Baseline + 15% |

## KPIs por artigo

Para cada artigo pilar, acompanhar no Search Console:

- `como-estruturar-campanhas-google-ads`
- `funil-de-aquisicao-guia`
- `seo-local-guia-completo`
- `google-ads-captacao-alunos`
- `google-ads-clinicas-estetica`

Queries alvo (cauda longa):

- google ads captação alunos
- google ads clínica estética
- seo local empresas serviços
- funil de aquisição como construir
- integrar google ads crm whatsapp

## Ritual de publicação

1. `npm run generate:seo` (sitemap + RSS + assets OG)
2. Deploy na Vercel
3. Search Console → Inspecionar URL → Solicitar indexação
4. Validar rich results: [Teste de resultados rich](https://search.google.com/test/rich-results)

## Metas realistas (90 dias, site novo)

- 17 URLs de blog indexadas
- Primeiras impressões em queries long-tail
- 3–5 artigos pilares no top 20 para cauda longa
- RSS ativo em `https://raiseone.com.br/blog/rss.xml`

## Comandos úteis

```bash
npm run generate:seo      # sitemap + RSS + SVGs do blog
npm run generate:sitemap  # apenas sitemap
npm run generate:rss      # apenas RSS
npm run generate:blog-assets  # apenas SVGs featured/og
```
