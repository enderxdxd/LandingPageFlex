# Workplan — Módulo de Solicitações de Arte (Design Requests)

> **Contexto:** Este módulo será integrado ao sistema Flex Fitness Center existente, em paralelo ao módulo de Helpdesk/Tickets já planejado. Ele compartilha infraestrutura (Next.js App Router, Firestore, Firebase Storage, Resend, layout admin, componentes UI) mas possui coleções, rotas e fluxos próprios. **Não misturar com o helpdesk.**

> **Público-alvo:** funcionários da empresa (recepcionistas, gerentes, professores) com baixa aptidão tecnológica. Toda decisão de UX deve priorizar clareza extrema, validação agressiva e fluxos guiados passo a passo (wizard).

---

## 0. Stack e convenções obrigatórias

- **Framework:** Next.js (App Router) — mesmo projeto existente
- **Database:** Firestore
- **Storage:** Firebase Storage
- **Email:** Resend + `@react-email/components` para templates
- **Drag & drop:** `@dnd-kit`
- **Datas:** `date-fns`
- **Upload:** `react-dropzone`
- **Gráficos:** `recharts`
- **CSV:** `papaparse`
- **Idioma da UI:** português brasileiro (pt-BR)
- **Fuso horário:** America/Sao_Paulo
- Reutilizar componentes UI e layout admin já existentes no projeto
- Seguir padrões de código, estrutura de pastas e nomenclatura do projeto existente

---

## 1. Conceito geral do módulo

Um sistema de **solicitações de arte** em que funcionários das 4 unidades (Alphaville, Buena Vista, Goiânia, Palmas) podem requisitar peças gráficas (aulas experimentais, escalas, eventos, avisos, promoções, etc.) que serão produzidas pelo designer interno.

**Problemas que resolve:**
1. Pedidos espalhados em grupos de WhatsApp sem padrão nem histórico
2. Briefings mal descritos (campos obrigatórios forçam descrição adequada)
3. Sem registro de quem pediu, quando, e o que foi entregue
4. Designer precisa abrir WhatsApp manualmente e enviar para cada solicitante
5. Sem métricas de volume, tempo de entrega, retrabalho

**O que NÃO é:** não é uma ferramenta de design. O designer continuará usando Photoshop externamente. O sistema apenas recebe briefings e distribui arquivos finais.

---

## 2. Autenticação e identificação de solicitantes

**Decisão:** não criar login individual para cada funcionário. Usar identificação leve por dispositivo + nome.

### Fluxo

1. Cada unidade tem uma URL dedicada: `/arte/[unidade]` (ex: `/arte/buena-vista`)
2. Na primeira visita, o sistema gera um `deviceId` (UUID v4) e salva em:
   - Cookie httpOnly com validade de 180 dias
   - localStorage como fallback
3. Mostra tela de cadastro com 3 campos:
   - **Nome completo** (obrigatório)
   - **WhatsApp** (obrigatório, com máscara `(XX) XXXXX-XXXX`, validação de formato BR)
   - **Cargo** (select: Recepcionista / Gerente / Professor / Personal / Coordenador / Outro)
4. Ao submeter, cria documento na coleção `requesters` e redireciona pro wizard
5. Nas visitas seguintes, o header mostra: `"Olá, Maria 👋 (Buena Vista) — [Não é você?]"`
6. Link "Não é você?" limpa identificação e volta à tela de cadastro

### Considerações

- O slug da unidade na URL define o `unitId` — não permitir troca pelo solicitante
- Validar que o slug é uma das 4 unidades válidas; caso contrário, 404
- Admins (designer, gerência) continuam usando o login real existente do sistema para acessar `/admin/arte/*`
- Rotas públicas `/arte/[unidade]` NÃO exigem login — são acessadas por URL direta (sistema interno)
- Adicionar `noindex` nas rotas `/arte/*` para não aparecer em buscadores

---

## 3. Modelo de dados (Firestore)

### Coleção `requesters`

```ts
{
  id: string,                    // auto
  deviceId: string,              // UUID do dispositivo
  name: string,
  phone: string,                 // formato E.164: +5562999999999
  phoneDisplay: string,          // formato BR: (62) 99999-9999
  unitId: 'alphaville' | 'buena-vista' | 'goiania' | 'palmas',
  role: 'recepcionista' | 'gerente' | 'professor' | 'personal' | 'coordenador' | 'outro',
  createdAt: Timestamp,
  lastActiveAt: Timestamp,
  isBlocked: boolean,            // admin pode bloquear
  totalRequests: number          // denormalizado para relatórios
}
```

### Coleção `designRequests`

```ts
{
  id: string,                    // auto
  requestNumber: number,         // sequencial global (#127) — usar counter doc
  unitId: string,
  type: 'aula-experimental' | 'escala' | 'evento' | 'comunicado' | 'promocao' | 'aniversariantes' | 'outro',
  destinations: Array<'tv' | 'stories' | 'feed' | 'whatsapp' | 'impresso'>,
  dynamicFields: Record<string, any>,  // campos específicos do tipo
  description: string,           // observação livre
  referenceImages: Array<{
    url: string,
    storagePath: string,
    fileName: string,
    uploadedAt: Timestamp
  }>,
  deadline: Timestamp,           // prazo desejado
  
  // Solicitante
  requesterId: string,
  requesterName: string,         // denormalizado
  requesterPhone: string,        // denormalizado
  requesterRole: string,         // denormalizado
  
  // Status e atribuição
  status: 'novo' | 'em-producao' | 'em-revisao' | 'concluido' | 'cancelado',
  assignedTo: string | null,     // userId do designer
  assignedToName: string | null,
  
  // Versões entregues
  deliveries: Array<{
    version: number,             // 1, 2, 3...
    files: Array<{
      url: string,
      storagePath: string,
      fileName: string,
      dimension: 'tv' | 'stories' | 'feed' | 'whatsapp' | 'impresso' | 'outro',
      sizeBytes: number
    }>,
    deliveredAt: Timestamp,
    deliveredBy: string,         // userId
    reviewStatus: 'aguardando' | 'aprovado' | 'ajuste-solicitado',
    reviewedAt: Timestamp | null,
    feedback: string | null      // texto do ajuste solicitado
  }>,
  
  // Timeline
  createdAt: Timestamp,
  updatedAt: Timestamp,
  assignedAt: Timestamp | null,
  firstDeliveryAt: Timestamp | null,
  completedAt: Timestamp | null,
  
  // Flags
  isUrgent: boolean,             // calculado por deadline próximo
  roundsOfRevision: number       // quantas versões até aprovar
}
```

### Coleção `designRequestComments`

```ts
{
  id: string,
  requestId: string,
  authorType: 'requester' | 'designer' | 'admin',
  authorId: string,
  authorName: string,
  message: string,
  createdAt: Timestamp,
  readBy: string[]               // array de userIds que já leram
}
```

### Coleção `counters`

Para gerar `requestNumber` sequencial global:

```ts
{
  id: 'designRequests',
  currentValue: number
}
```

Incrementar via transação Firestore.

### Índices compostos necessários

- `designRequests`: `unitId + status + createdAt desc`
- `designRequests`: `status + deadline asc`
- `designRequests`: `assignedTo + status + createdAt desc`
- `designRequests`: `requesterId + createdAt desc`
- `designRequestComments`: `requestId + createdAt asc`

---

## 4. Estrutura de rotas

```
/app/arte/
  /[unidade]/
    page.tsx                    → landing + identificação + wizard inicial
    /novo/page.tsx              → wizard de novo pedido (multi-step)
    /meus-pedidos/page.tsx      → lista de pedidos do solicitante atual
    /pedido/[id]/page.tsx       → acompanhamento do pedido
    /pedido/[id]/revisar/page.tsx → tela de aprovação (aprovar / pedir ajuste)

/app/admin/arte/
  /page.tsx                     → Kanban principal do designer
  /pedido/[id]/page.tsx         → detalhe + upload de entrega
  /solicitantes/page.tsx        → gestão de solicitantes
  /relatorios/page.tsx          → dashboard de métricas
  /arquivo/page.tsx              → pedidos concluídos antigos

/app/api/arte/
  /requests/route.ts            → POST criar, GET listar
  /requests/[id]/route.ts       → GET, PATCH, DELETE
  /requests/[id]/deliver/route.ts → POST entregar versão
  /requests/[id]/review/route.ts → POST aprovar/ajustar
  /requests/[id]/comments/route.ts → GET, POST
  /requests/[id]/assign/route.ts → POST atribuir designer
  /requesters/route.ts          → POST criar/upsert
  /requesters/[id]/route.ts     → GET, PATCH
  /upload/route.ts              → POST upload para Storage
```

---

## 5. Wizard de criação de pedido

**Princípio:** uma pergunta por tela, validação que bloqueia avanço sem preencher, linguagem simples, exemplos em tudo.

### Passo 1 — Tipo de arte

Grid de cards grandes com ícone + título + descrição curta:

- 🎓 **Aula experimental ou novo horário** — "Divulgar uma aula nova ou horário experimental"
- 📅 **Escala de aulas coletivas** — "Divulgar a grade de horários do mês"
- 🏆 **Evento, desafio ou workshop** — "Divulgar um evento especial"
- 📢 **Comunicado ou aviso** — "Informar algo importante aos alunos"
- 💰 **Promoção ou campanha** — "Divulgar uma oferta comercial"
- 🎂 **Aniversariantes do mês** — "Lista de aniversariantes"
- ✏️ **Outro (descreva você mesmo)** — "Qualquer outra necessidade"

Cada card é clicável, ocupa área grande (mínimo 180x140px desktop), cursor pointer, hover destacado.

### Passo 2 — Onde vai ser usada?

Multi-select com cards visuais mostrando a proporção:

- 📺 **TV da recepção** (16:9 — 1920x1080)
- 📱 **Stories Instagram** (9:16 — 1080x1920)
- 📷 **Feed Instagram** (1:1 — 1080x1080)
- 💬 **WhatsApp** (quadrado — 1080x1080)
- 🖨️ **Impresso** (definir com designer)

Deve permitir múltiplas seleções. Pelo menos 1 obrigatória.

### Passo 3 — Campos dinâmicos por tipo

#### Tipo: Aula experimental
- Nome da aula (ex: Ritmos, Pilates, Muay Thai) — obrigatório
- Data de início — obrigatório, date picker, não permitir passado
- Dias da semana — checkboxes Seg/Ter/Qua/Qui/Sex/Sáb/Dom — pelo menos 1
- Horário — time picker — obrigatório
- Professor(es) — texto — obrigatório
- Unidade onde acontece (pode ser diferente da unidade do solicitante) — select

#### Tipo: Escala
- Período de vigência (ex: "Abril 2026") — texto obrigatório
- Upload de planilha OU foto da escala — obrigatório (aceitar .xlsx, .csv, .jpg, .png, .pdf)
- Alternativa: campo de texto para digitar a escala
- Unidade — select

#### Tipo: Evento
- Nome do evento — obrigatório
- Data — date picker obrigatório
- Horário — time picker obrigatório
- Local (unidade específica ou "todas") — select obrigatório
- Professor(es) responsáveis — texto obrigatório
- Descrição curta (máximo 200 caracteres) — textarea obrigatório com contador
- Como se inscrever — select: "Na recepção" / "Link" / "Grátis" / "Outro" — se "Link" ou "Outro" abre campo texto
- Tema visual desejado (opcional) — texto

#### Tipo: Comunicado
- Título — obrigatório
- Corpo do texto — textarea obrigatório
- Urgência — radio: Normal / Urgente
- Data de validade (quando parar de exibir) — date picker obrigatório

#### Tipo: Promoção
- Nome da promoção — obrigatório
- Descrição do benefício — textarea obrigatório
- Condições — textarea obrigatório
- Válida de — date obrigatório
- Válida até — date obrigatório
- Call-to-action — select: "Matricule-se hoje" / "Fale na recepção" / "Outro"
- Público-alvo — select: "Novos alunos" / "Alunos atuais" / "Ex-alunos" / "Todos"

#### Tipo: Aniversariantes
- Mês de referência — select obrigatório
- Upload de lista OU colar texto — obrigatório
- Unidade — select obrigatório

#### Tipo: Outro
- Título — obrigatório
- Descrição detalhada — textarea obrigatório com **mínimo de 100 caracteres** (exibir contador)
- Forçar descrição completa é intencional

### Passo 4 — Detalhes finais

- Observação adicional — textarea opcional
- Imagens de referência — upload múltiplo via `react-dropzone`, aceitar .jpg .png .webp até 10MB cada, máximo 5 arquivos
- Prazo desejado — date picker obrigatório, **não permitir datas com menos de 2 dias úteis a partir de hoje** (usar `date-fns` com business days)

### Passo 5 — Revisão

Mostrar tudo preenchido em formato de "card preview" legível:
- Tipo
- Destinos (com ícones)
- Todos os campos dinâmicos preenchidos
- Observação
- Thumbnails das referências
- Prazo
- Botão secundário "Voltar e editar"
- Botão primário grande verde "✅ Enviar solicitação"

### Tela de sucesso

Após criação:
- Ícone de sucesso grande
- "✅ Pedido #127 recebido!"
- "O designer foi notificado e vai começar em breve."
- "Você receberá a arte no WhatsApp assim que estiver pronta."
- Botão "Ver meus pedidos"
- Botão "Fazer outro pedido"

---

## 6. Painel do designer (Kanban)

### Layout

**Header fixo:**
- Logo Flex
- Nome do designer logado
- Filtros: por unidade (pills clicáveis com cores), por tipo, por urgência
- Campo de busca global (busca por número, nome, título)
- Contador: "12 pendentes, 3 urgentes"
- Botão "Atualizar" (os dados devem atualizar em tempo real via Firestore onSnapshot)

### Colunas

1. **📥 Novos** — pedidos sem `assignedTo`
2. **🎨 Em produção** — `status = em-producao`
3. **👀 Em revisão** — `status = em-revisao` (entregue, aguardando aprovação)
4. **✅ Concluídos** — `status = concluido`, últimos 7 dias apenas (resto vai pra `/admin/arte/arquivo`)

### Card do pedido

```
┌─────────────────────────────┐
│ 🔴 URGENTE    #127          │
│ Aula Experimental           │
│ Ritmos - Buena Vista        │
│ 📺 📱 📷                    │
│ ─────────────────────────   │
│ 👤 Maria (Recepção)         │
│ ⏰ Prazo: amanhã 18h        │
│ 💬 2                        │
└─────────────────────────────┘
```

- Borda lateral esquerda colorida por unidade (Alphaville azul, Buena Vista verde, Goiânia laranja, Palmas roxo — cores a definir)
- Badge "URGENTE" aparece se `deadline` < 24h
- Prazo colorido: vermelho se < 24h, amarelo se < 48h, cinza caso contrário
- Contador de comentários não lidos
- Ícones de destinos

### Drag and drop

- Usar `@dnd-kit` para arrastar cards entre colunas
- Regras:
  - Novo → Em produção: seta `assignedTo` automaticamente pro designer logado e `assignedAt = now`
  - Em produção → Em revisão: **bloqueado pelo drag** — precisa usar o fluxo de "Entregar arte" no drawer
  - Em revisão → Concluídos: **bloqueado pelo drag** — só via aprovação do solicitante
  - Qualquer coluna → Novos: permitido (desatribuir)

### Drawer de detalhes (clique no card)

Drawer lateral deslizante (não modal), pode ficar aberto enquanto navega no Kanban:

**Seção 1 — Cabeçalho**
- Número do pedido, tipo, unidade, status
- Botões de ação rápida (conforme status atual)

**Seção 2 — Briefing**
- Todos os campos do briefing formatados de forma legível (não JSON)
- Grid de referências (clicável para abrir em tamanho maior)
- Prazo com countdown

**Seção 3 — Solicitante**
- Nome, cargo, telefone (com botão "abrir WhatsApp")
- Histórico: "5 pedidos anteriores"

**Seção 4 — Timeline**
- Lista cronológica de eventos: criado, atribuído, entregue, revisado, etc.

**Seção 5 — Conversa**
- Chat estilo comentários com o solicitante
- Input para nova mensagem
- Marca comentários como lidos ao abrir o drawer

**Seção 6 — Entregar arte** (se status = em-producao)
- Área de drag and drop para múltiplos arquivos
- Para cada arquivo, select de dimensão (TV / Stories / Feed / WhatsApp / Impresso / Outro)
- Botão grande "📤 Entregar e notificar"
- Ao clicar:
  1. Faz upload pro Storage em `/design-requests/{id}/deliveries/v{N}/`
  2. Cria nova entrada em `deliveries[]`
  3. Muda status para `em-revisao`
  4. Dispara email pro solicitante
  5. Abre modal com link `wa.me` pré-preenchido + arquivos baixados

**Seção 7 — Versões anteriores** (se houver)
- Lista de versões entregues com data e status (aprovado/ajuste)
- Feedback de cada ajuste solicitado

---

## 7. Fluxo de entrega e aprovação

### Entrega via `wa.me` (Fase 1)

**Decisão arquitetural:** Fase 1 usa link `wa.me` manual-assistido. Fase 2 (pós-lançamento) migra para WhatsApp Cloud API oficial. A interface do designer deve ser projetada para que a migração seja transparente.

**Fluxo ao clicar "Entregar e notificar":**

1. Upload dos arquivos para Firebase Storage
2. Gerar signed URLs válidas por 30 dias
3. Criar entrada em `deliveries[]` com version = max + 1
4. Atualizar status para `em-revisao`
5. Disparar email para o solicitante via Resend (template "Arte pronta")
6. Mostrar modal pro designer com:
   - Arquivos disponíveis para download (auto-download ao abrir modal)
   - Botão grande: "📱 Abrir WhatsApp do solicitante"
     - Link: `https://wa.me/{phone}?text={mensagem_encoded}`
     - Mensagem: "Olá {nome}! Sua arte solicitada está pronta 🎨\n\nPedido #{número} - {tipo}\n\nRevise e aprove aqui: {link_revisao}"
   - Checkbox: "✓ Marquei como entregue após enviar no WhatsApp"
   - Botão "Fechar"
7. O designer arrasta os arquivos baixados para a conversa do WhatsApp e envia manualmente

### Tela de revisão do solicitante

Rota: `/arte/[unidade]/pedido/[id]/revisar`

- Acessível sem login (verificação via `deviceId` no cookie OU token no link)
- Se for acessada por dispositivo diferente do solicitante original, exigir confirmação do nome
- Mostrar:
  - Cabeçalho com número do pedido e tipo
  - Grid grande com todas as artes entregues na última versão
  - Clique em qualquer arte abre em tela cheia
  - Abaixo das artes, duas opções grandes:
    - ✅ **"Está perfeito! Aprovar"** (botão verde grande)
    - ✏️ **"Preciso de um ajuste"** (botão amarelo)
  - Se clicar em ajuste: abre textarea **obrigatória** com placeholder "Descreva o que precisa ser mudado. Seja específico (ex: 'trocar cor do título pra azul', 'corrigir horário para 08:00')"
  - Botão "Enviar pedido de ajuste"

### Ao aprovar

1. Atualiza última entrega para `reviewStatus = aprovado`
2. Muda status do pedido para `concluido`
3. Seta `completedAt`
4. Dispara email pro designer: "Maria aprovou o pedido #127 🎉"
5. Tela de agradecimento: "Obrigado! Sua aprovação foi registrada."

### Ao solicitar ajuste

1. Atualiza última entrega para `reviewStatus = ajuste-solicitado`
2. Salva feedback
3. Muda status do pedido de volta para `em-producao`
4. Incrementa `roundsOfRevision`
5. Dispara email pro designer com o trecho do feedback
6. Tela: "Pedido de ajuste enviado! O designer vai revisar."

---

## 8. Notificações (Resend)

Todas as notificações devem usar templates React Email (`@react-email/components`) com layout visual (não texto puro). Incluir logo Flex, cores da marca, CTA claro.

### Matriz de notificações

| # | Evento | Destinatário | Template ID | Assunto |
|---|--------|--------------|-------------|---------|
| 1 | Pedido criado | Designer(s) | `new-request` | `[Flex Arte] Novo pedido #{N} - {tipo}` |
| 2 | Designer assumiu | Solicitante | `request-assigned` | `Seu pedido #{N} está sendo produzido` |
| 3 | Pergunta do designer | Solicitante | `designer-question` | `{Designer} tem uma dúvida no pedido #{N}` |
| 4 | Resposta do solicitante | Designer | `requester-reply` | `{Nome} respondeu no pedido #{N}` |
| 5 | Arte entregue | Solicitante | `delivery` | `✅ Sua arte #{N} está pronta!` |
| 6 | Pedido aprovado | Designer | `approved` | `🎉 {Nome} aprovou o pedido #{N}` |
| 7 | Ajuste solicitado | Designer | `revision-requested` | `✏️ Ajuste solicitado no pedido #{N}` |
| 8 | Prazo em 24h sem ação | Designer | `deadline-warning` | `⚠️ Pedido #{N} vence amanhã` |
| 9 | Prazo vencido | Designer + Admin | `deadline-overdue` | `🚨 Pedido #{N} venceu` |

### Implementação dos alertas de prazo

Usar Firestore scheduled function OU cron via Vercel Cron (`vercel.json`):
- Rodar a cada 1 hora
- Buscar pedidos com status in ['novo', 'em-producao'] e deadline próximo
- Disparar emails apropriados
- Marcar flag `deadlineWarningSent` no documento pra não duplicar

---

## 9. Firebase Storage — estrutura e regras

### Estrutura de pastas

```
/design-requests/
  /{requestId}/
    /references/
      ref-{uuid}.{ext}
    /deliveries/
      /v1/
        {dimension}-{uuid}.{ext}
      /v2/
        ...
```

### Metadata nos arquivos de entrega

```
contentType: 'image/png'
customMetadata: {
  requestId: string,
  version: string,
  dimension: string,
  uploadedBy: string
}
```

### Security rules (exemplo)

```
match /design-requests/{requestId}/{allPaths=**} {
  allow read: if true;  // signed URLs gerenciam acesso
  allow write: if request.auth != null && 
    (request.auth.token.admin == true || request.auth.token.designer == true);
}
```

Uploads de referência feitos pelo solicitante devem passar por API route que valida e sobe server-side (o solicitante não tem auth Firebase).

### Lifecycle

Implementar Cloud Function ou rotina agendada:
- Após 90 dias de `completedAt`, mover arquivos para `/archive/design-requests/{id}/`
- Manter registros no Firestore indefinidamente

---

## 10. Firestore Security Rules

```
// requesters
match /requesters/{requesterId} {
  allow read: if request.auth != null && 
    (request.auth.token.admin == true || request.auth.token.designer == true);
  allow create, update: if false;  // via API route apenas
}

// designRequests
match /designRequests/{requestId} {
  allow read: if request.auth != null && 
    (request.auth.token.admin == true || request.auth.token.designer == true);
  allow create, update, delete: if false;  // via API route apenas
}

// designRequestComments
match /designRequestComments/{commentId} {
  allow read: if request.auth != null;
  allow create, update, delete: if false;  // via API route
}
```

Toda criação e modificação de dados passa por API routes do Next.js que validam:
- Autenticação (para ações admin)
- `deviceId` do cookie (para ações do solicitante)
- Validação de schema (usar Zod)
- Rate limiting básico

---

## 11. Relatórios (`/admin/arte/relatorios`)

Dashboard com `recharts` incluindo:

1. **Volume total** — KPIs: total do mês, total pendente, total concluído, tempo médio de entrega
2. **Volume por unidade** — gráfico de barras
3. **Volume por tipo** — gráfico de pizza
4. **Tempo médio de entrega por tipo** — gráfico de barras horizontais
5. **Taxa de ajuste por tipo** — % de pedidos que tiveram 2+ versões
6. **Top solicitantes** — tabela com nome, unidade, total de pedidos
7. **Pedidos fora do prazo** — lista
8. **Dimensões mais pedidas** — gráfico de pizza
9. **Evolução mensal** — gráfico de linha (últimos 12 meses)

Filtros no topo: período (últimos 7/30/90 dias, personalizado), unidade, tipo.

Botão "Exportar CSV" usando `papaparse`.

---

## 12. Plano de implementação por sprints

### Sprint 1 — Fundação (semana 1-2)

- [ ] Criar coleções Firestore e security rules iniciais
- [ ] Criar counter doc para `requestNumber`
- [ ] Configurar Firebase Storage com regras
- [ ] Implementar identificação por `deviceId` (cookie + localStorage)
- [ ] Rota `/arte/[unidade]/page.tsx` com validação de slug
- [ ] Tela de cadastro inicial do solicitante
- [ ] API route `/api/arte/requesters` (POST, PATCH)
- [ ] Wizard básico funcionando com 2 tipos: "Aula Experimental" e "Outro"
- [ ] Upload de referências via `react-dropzone` → Firebase Storage
- [ ] API route `/api/arte/requests` (POST)
- [ ] Tela de sucesso pós-criação
- [ ] Instalar pacotes: `@dnd-kit`, `date-fns`, `react-dropzone`, `recharts`, `papaparse`, `@react-email/components`

### Sprint 2 — Painel do designer (semana 3)

- [ ] Rota `/admin/arte/page.tsx` com layout admin existente
- [ ] Kanban com 4 colunas usando `@dnd-kit`
- [ ] Card do pedido com todos os elementos especificados
- [ ] Filtros (unidade, tipo, urgência) e busca
- [ ] Real-time via Firestore `onSnapshot`
- [ ] Drawer lateral com detalhes do pedido
- [ ] Área de upload de entregas
- [ ] Primeiro template Resend funcionando ("Pedido criado")
- [ ] API route `/api/arte/requests/[id]/assign`
- [ ] API route `/api/arte/requests/[id]/deliver`

### Sprint 3 — Fluxo completo de entrega (semana 4)

- [ ] Modal de entrega com link `wa.me` e download de arquivos
- [ ] Rota `/arte/[unidade]/pedido/[id]/revisar` (tela de aprovação)
- [ ] Botões aprovar / pedir ajuste
- [ ] Histórico de versões no drawer admin
- [ ] Todos os 9 templates Resend implementados
- [ ] Chat de comentários no drawer
- [ ] API route `/api/arte/requests/[id]/review`
- [ ] API route `/api/arte/requests/[id]/comments`
- [ ] Sistema de marcação de comentários lidos

### Sprint 4 — Todos os tipos + polimento (semana 5)

- [ ] Implementar os tipos restantes: Escala, Evento, Comunicado, Promoção, Aniversariantes
- [ ] Validações Zod para cada tipo
- [ ] Mensagens de erro amigáveis em pt-BR
- [ ] Responsivo mobile (wizard principalmente)
- [ ] Rota `/arte/[unidade]/meus-pedidos/page.tsx`
- [ ] Rota `/arte/[unidade]/pedido/[id]/page.tsx` (acompanhamento)
- [ ] Testes com usuário real, ajustes de UX

### Sprint 5 — Relatórios e refinos (semana 6)

- [ ] Rota `/admin/arte/relatorios/page.tsx` com todos os gráficos
- [ ] Rota `/admin/arte/solicitantes/page.tsx` (gestão de solicitantes)
- [ ] Rota `/admin/arte/arquivo/page.tsx` (pedidos antigos)
- [ ] Cron job para alertas de prazo (Vercel Cron)
- [ ] Lifecycle de arquivamento no Storage
- [ ] Exportação CSV dos relatórios
- [ ] Pre-deploy checklist

### Sprint 6 — WhatsApp Cloud API (opcional, pós-lançamento)

- [ ] Setup Meta Business + número dedicado
- [ ] Criar templates e submeter para aprovação
- [ ] Implementar wrapper de envio via Cloud API
- [ ] Webhook de status de entrega
- [ ] Migração transparente: substituir função de entrega mantendo UX do designer
- [ ] Fallback automático para `wa.me` em caso de erro da API

---

## 13. Pre-deploy checklist

- [ ] Todas as security rules revisadas (Firestore + Storage)
- [ ] Todos os índices compostos criados no Firestore
- [ ] Variáveis de ambiente configuradas (Resend API key, Firebase config)
- [ ] Rate limiting nas API routes públicas
- [ ] `noindex` nas rotas `/arte/*` e `/admin/arte/*`
- [ ] Testes manuais dos 7 tipos de pedido
- [ ] Teste do fluxo completo: criar → designer pega → entrega → aprovar
- [ ] Teste do fluxo de ajuste (2+ versões)
- [ ] Teste dos 9 templates de email (conteúdo, formatação, mobile)
- [ ] Teste em mobile real (iOS e Android)
- [ ] Validação de uploads grandes (10MB)
- [ ] Timeouts apropriados nas API routes
- [ ] Logs de erro capturados (Sentry ou similar se já existir)
- [ ] Backup dos dados Firestore configurado
- [ ] Documentação interna para o designer (como usar o painel)
- [ ] Documentação interna para solicitantes (cartilha simples impressa pra recepção)

---

## 14. Pontos importantes para o implementador

1. **Não misture com o helpdesk.** Apesar de compartilhar infra, são dois domínios diferentes. Coleções separadas, rotas separadas, fluxos separados.

2. **Público com baixa aptidão tecnológica.** Cada decisão de UX deve ser brutalmente a favor da clareza. Labels explícitas, exemplos entre parênteses, mensagens de erro em português simples, sem jargão técnico.

3. **Validação no cliente E no servidor.** Usar Zod nos dois lados. O cliente bloqueia visualmente, o servidor garante integridade.

4. **Denormalização é intencional.** Campos como `requesterName`, `assignedToName`, `totalRequests` são denormalizados de propósito para evitar N+1 queries no Kanban e relatórios. Atualizar em transações quando fizer sentido.

5. **`wa.me` na Fase 1 é decisão consciente.** Não tentar implementar Cloud API agora. Projetar a função de entrega de forma isolada para facilitar migração futura.

6. **Toda operação de escrita passa por API route.** Não permitir writes diretos do cliente no Firestore. Isso simplifica security rules e centraliza validação.

7. **Real-time apenas no Kanban admin.** As telas do solicitante não precisam de `onSnapshot` — fetch normal é suficiente. Economiza cotas do Firestore.

8. **URLs de unidade são o single source of truth.** Nunca confiar no client para enviar `unitId` — sempre derivar do slug da URL (validado server-side).

9. **Identificação por `deviceId` não é segurança.** É conveniência. Não armazenar nada sensível. Admins acessam tudo com auth real.

10. **Siga os padrões do projeto existente.** Antes de criar componentes novos, procure componentes similares já em uso. Reutilize layout admin, botões, inputs, etc.