# Dossiê Completo — Projeto UNIP Polo Caraguatatuba (Landing Page + Google Ads)

> **Objetivo deste documento:** reunir cronologicamente todas as informações relevantes da conversa para servir como base de um estudo de caso profissional. Este documento **não resume** a história; ele organiza os fatos, decisões, problemas, hipóteses, resultados e aprendizados.

---

# 1. Contexto inicial do projeto

## Cliente

* Viviane
* Responsável pelo Polo UNIP Caraguatatuba.

## Objetivo inicial

Criar um sistema completo de captação de alunos utilizando:

* Landing Page própria
* Google Ads
* posteriormente Meta Ads
* acompanhamento de resultados
* otimizações contínuas

O objetivo nunca foi apenas criar uma landing page, mas validar um funil completo de aquisição de alunos.

---

# 2. Desenvolvimento da Landing Page

Durante o projeto foi construída uma landing page própria para o polo.

Características:

* Hero otimizado
* CTA para WhatsApp
* Cursos
* Bolsas
* FAQ
* Informações do polo
* SEO
* Design alinhado com identidade da UNIP

Posteriormente houve discussão sobre:

* unir Hero + segunda seção
* melhorar UX
* aumentar conversão

---

# 3. Estrutura inicial do Google Ads

Foi criada uma campanha:

Pesquisa | Captação de Demanda

Objetivo:

Contatos

Estratégia:

Maximizar Conversões

Orçamento:

R$50/dia

---

# 4. Construção dos anúncios

Foram produzidos:

Responsive Search Ads

com:

* diversos títulos
* descrições
* sitelinks
* snippets estruturados
* extensões

O anúncio ficou visualmente muito forte.

Comentário feito:

> "Anúncio ficou bonitão."

---

# 5. Estruturação dos grupos de anúncios

Inicialmente discutiu-se criar:

5 grupos

Depois foi tomada a decisão de reduzir.

## Decisão tomada

Criar apenas 3 grupos.

Motivo:

Orçamento pequeno (R$50/dia).

Dividir demais poderia:

* fragmentar dados
* atrasar aprendizado
* reduzir volume estatístico.

Estrutura final:

Grupo 1

Faculdade EAD

Grupo 2

Cursos

Grupo 3

Pós-graduação

Essa estrutura foi considerada suficiente para:

* iniciar aprendizado
* validar demanda
* posteriormente expandir.

---

# 6. Construção das palavras-chave

Foram discutidas:

* exata
* frase
* ampla

Inicialmente optou-se por:

Exata + Frase

evitando ampla.

---

Depois o próprio Google começou a recomendar:

Correspondência ampla.

Inicialmente houve resistência.

Motivos:

* medo de perder controle
* gastar orçamento
* trazer pesquisas ruins

---

# 7. Primeira fase da campanha

Logo após publicação:

problema:

campanha quase não entregava.

Sintomas:

* poucas impressões
* praticamente sem cliques
* orçamento não era gasto

A conta parecia "travada".

---

Hipóteses levantadas:

* campanha em aprendizado
* estratégia de Maximizar Conversões
* ausência de histórico
* algoritmo conservador

---

# 8. Reestruturação das palavras-chave

Foi decidido:

adotar sugestões do Google.

Diversas palavras passaram para:

Correspondência ampla

Resultado praticamente imediato.

---

# 9. Mudança brusca de performance

Após adoção das amplas:

A campanha "destravou".

Passou a gerar:

* muito mais impressões
* muito mais cliques
* muito mais distribuição

Foi um ponto importante da evolução.

---

# 10. Problema de conversões

Apesar da campanha gerar leads,

Google Ads mostrava:

0 conversões.

Mesmo quando:

Viviane confirmava recebimento de mensagens.

Isso criou um conflito:

Realidade

↓

Google mostrava zero.

---

# 11. Investigação técnica

Começou auditoria completa.

Hipóteses levantadas:

* conversão não disparando
* GTM
* Google Tag
* evento errado
* callback
* Consent Mode
* configuração do Google Ads

---

Foi utilizado:

Tag Assistant.

O Tag Assistant mostrava:

Conversão

Remarketing

Whatsapp Click Hero

Hits enviados

Ou seja,

eventos existiam.

Mas:

ação Lead WhatsApp permanecia inativa.

---

# 12. Auditoria realizada pelo Cursor

Foi solicitado um relatório completo.

Resultado.

Foi encontrado um bug extremamente específico.

No código existia:

e6hXCIWl5cccEMLvzY5E

(letra L)

Enquanto o Google esperava:

e6hXCIW15cccEMLvzY5E

(número 1)

Ou seja.

Erro de um único caractere.

---

Diagnóstico:

O Google recebia um evento de conversão.

Mas:

não correspondia à ação cadastrada.

Por isso:

Lead WhatsApp permanecia inativa.

---

# 13. Fluxo técnico auditado

Foi mapeado:

WhatsAppButton

↓

trackEvent()

↓

trackWhatsAppConversion()

↓

gtag("conversion")

↓

send_to

Também foi identificado:

11 pontos de clique no projeto.

Todos auditados.

---

# 14. Correção aplicada

Alterado:

src/lib/googleAds.ts

Substituição do label.

Depois:

Deploy.

---

# 15. Nova validação

Tag Assistant passou a mostrar:

Lead WhatsApp

Lead WhatsApp

Remarketing

Ao invés de apenas:

Conversion

Remarketing

Ou seja.

Agora a ação correta era disparada.

---

# 16. Aprendizado importante

Um único caractere incorreto no send_to

quebrou completamente a mensuração da campanha.

Esse foi provavelmente o maior bug técnico do projeto.

---

# 17. Primeiros resultados da campanha

Nos primeiros dias:

CPC:

aproximadamente

R$7

Depois:

R$6

Depois:

R$4

Depois:

R$3,80

Ou seja.

O algoritmo começou a otimizar.

---

# 18. Primeiro feedback da cliente

Viviane informou:

Algumas mensagens chegaram.

Isso ocorreu logo nos primeiros dias.

---

Foi solicitado:

Ela contabilizar:

* quantidade
* qualidade
* matrícula

para cruzar dados.

---

# 19. Segundo feedback

Ela informou:

4 mensagens.

Ainda curiosos.

Pouco interessados.

---

Mesmo assim:

Procura aumentou.

---

# 20. Oportunidade comercial

Durante essa conversa

Viviane escreveu:

Quando puder,

vamos pensar na Pousada de Itanhaém.

Comentou:

principal investimento continuará sendo UNIP.

Mas gostaria de fazer algo para a pousada.

---

Esse foi um marco importante.

Porque mostrou:

satisfação

*

confiança

*

possibilidade de upsell.

---

# 21. Crescimento da campanha

Depois das alterações.

Campanha passou a gerar diariamente:

entre

3 e 7 conversões.

Foi considerado um excelente desempenho.

---

# 22. Estatísticas após aproximadamente duas semanas

Investimento:

R$655

Cliques:

101

Conversões:

23

CPA:

~R$28

---

Esses números foram considerados muito bons

para geração de leads.

---

# 23. Dúvida estratégica

Mesmo com:

23 conversões

não se sabia:

quantas matrículas haviam ocorrido.

Foi discutido.

Se:

0 matrículas

↓

preocupante.

1 matrícula

↓

CPA muito alto.

2 matrículas

↓

aceitável.

3 matrículas

↓

muito bom.

---

# 24. Feedback posterior da Viviane

Resposta:

As mensagens estão chegando.

Alguns mais interessados.

Outros curiosos.

Ainda não tivemos matrículas.

Mas:

"A procura aumentou consideravelmente."

Essa frase tornou-se um dos principais indicadores qualitativos do projeto.

---

# 25. Interpretação

Foi entendido que:

o topo do funil estava funcionando.

Ou seja.

Problema não era:

gerar procura.

Mas:

converter procura em matrícula.

---

# 26. Oscilações do algoritmo

Durante a campanha houve dias muito diferentes.

Exemplos:

Dia excelente.

Depois:

CPC saltou.

Depois voltou.

Exemplo.

CPC:

R$4

↓

R$9

↓

R$20

↓

R$5 novamente.

---

Também ocorreram dias:

sem entrega.

ou:

orçamento quase não gasto.

---

Hipóteses levantadas:

Aprendizado automático.

Oscilação do leilão.

Maior concorrência.

Baixo volume.

Sistema redistribuindo orçamento.

---

# 27. Problema específico

Um dia.

4 cliques.

Todo orçamento consumido.

CPC médio:

R$20.

Sem conversões.

---

Análise realizada.

Termos encontrados.

Exemplo.

humanitas medicina bolsa

R$46

por clique.

Claramente

pesquisa extremamente concorrida.

---

Foi considerado:

dia atípico.

---

# 28. Recuperação

No dia seguinte.

CPC caiu novamente.

R$5,76

8 cliques.

2 conversões.

CPA:

R$23.

Indicando:

campanha voltou ao comportamento esperado.

---

# 29. Estratégia adotada

Foi decidido:

não alterar estratégia de lance.

Continuar em:

Maximizar Conversões.

Mesmo diante das oscilações.

Porque:

já havia provas de que a campanha performava.

---

# 30. Comunicação constante com cliente

Ao longo do projeto.

Foi adotada estratégia de:

alinhamento de expectativa.

Sempre explicando:

* algoritmo
* aprendizado
* necessidade de tempo
* otimizações

sem prometer resultados imediatos.

---

# 31. Relação com cliente

Evolução percebida.

Início:

Cliente contratando.

↓

Depois:

Recebendo relatórios.

↓

Depois:

Confiança suficiente para pedir projeto da pousada.

↓

Depois:

Compartilhando mensagens suspeitas recebidas.

↓

Depois:

Consultando antes de responder terceiros.

Esse comportamento indica aumento de confiança profissional.

---

# 32. Caso do WhatsApp (Magicpin)

Viviane recebeu mensagem dizendo:

Google mostrava FMU.

Foi analisado.

Conclusão.

Muito provavelmente:

spam

ou

empresa tentando vender gestão do Perfil da Empresa.

Orientação.

Não responder.

Verificar diretamente o Perfil da Empresa do Google.

---

# 33. Aprendizados técnicos

Durante o projeto foram aprendidos:

* Maximizar Conversões pode travar contas novas.
* Correspondência ampla ajudou muito o algoritmo.
* Tag Assistant nem sempre significa conversão correta.
* send_to precisa casar exatamente.
* Um caractere errado pode invalidar toda a mensuração.
* Dias ruins isolados não justificam mudanças bruscas.
* Campanhas novas apresentam alta volatilidade.
* Comunicação frequente reduz ansiedade do cliente.
* Qualidade do lead precisa ser validada fora do Google Ads.
* Conversão em WhatsApp não significa matrícula.

---

# 34. Aprendizados comerciais

* Mostrar dados gera confiança.
* Explicar oscilações evita insegurança.
* Cliente passou a enxergar o gestor como parceiro.
* Bom relacionamento abriu oportunidade para novos contratos.
* Resultados qualitativos ("a procura aumentou") também têm valor quando ainda não há matrículas.

---

# 35. Estado do projeto ao final desta conversa

## Landing Page

Concluída.

---

## Google Ads

Estruturado.

Campanha ativa.

3 grupos.

Correspondência ampla adotada em parte das palavras.

---

## Conversões

Problema técnico corrigido.

Evento Lead WhatsApp funcionando corretamente.

---

## Performance

Investimento aproximado:

R$655

101 cliques.

23 conversões.

Campanha com oscilações normais do algoritmo.

---

## Cliente

Satisfeita.

Confirmando aumento de procura.

Sem matrículas até o momento relatado.

Interessada em contratar também um projeto para a Pousada de Itanhaém.

---

# Linha do tempo resumida

1. Desenvolvimento da Landing Page.
2. Criação da campanha Search.
3. Estrutura inicial de anúncios.
4. Criação de 3 grupos de anúncios.
5. Primeira fase sem entrega.
6. Mudança para palavras amplas.
7. Campanha destrava.
8. Primeiros leads.
9. Conversões não aparecem no Ads.
10. Auditoria técnica completa.
11. Descoberta do label incorreto (`l` vs `1`).
12. Correção do código.
13. Conversões passam a ser identificadas corretamente.
14. Campanha entra em fase de boa performance (3–7 conversões/dia).
15. Cliente confirma aumento da procura.
16. Oscilações pontuais de CPC e entrega.
17. Recuperação da performance.
18. Interesse da cliente em expandir a parceria para a Pousada de Itanhaém.
