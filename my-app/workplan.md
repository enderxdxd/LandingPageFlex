# 🎫 WORKPLAN COMPLETO — Sistema de Chamados Flex Fitness

## Documento de Planejamento Técnico e Funcional

**Projeto:** Sistema de Chamados Internos — Flex Fitness Center  
**Data:** Março 2026  
**Versão:** 1.0  

---

## 1. VISÃO GERAL DO PROJETO

### 1.1 Objetivo
Desenvolver um sistema completo de abertura e gestão de chamados internos para a Flex Fitness Center, cobrindo as áreas de **TI, Manutenção, Limpeza e Administrativo**, atendendo as **4 unidades** (Alphaville, Buena Vista, Marista e Palmas). O sistema será acessado via endpoint próprio (não exposto no site público), utilizando o mesmo domínio para aproveitar a API do Resend já configurada.

### 1.2 Stack Atual (manter compatibilidade)

| Tecnologia | Uso Atual |
|---|---|
| **Next.js 14** (App Router) | Framework principal |
| **React 18** | UI Library |
| **TypeScript** | Tipagem |
| **Tailwind CSS** | Estilização |
| **Framer Motion** | Animações |
| **Firebase Auth** | Autenticação (admin) |
| **Firebase Firestore** | Banco de dados |
| **Firebase Storage** | Armazenamento de arquivos |
| **Resend** | Envio de emails (API já configurada no domínio) |
| **Vercel** | Deploy / Hosting |
| **react-hook-form** | Formulários |

### 1.3 Decisão de Arquitetura

O sistema viverá **dentro do mesmo projeto Next.js** (my-app), mas em rotas isoladas sob `/chamados/*`. O endpoint não será linkado no site público — acesso será feito diretamente via URL (ex: `flexfitness.com.br/chamados`). Isso garante:

- Reuso da API do Resend já verificada no domínio
- Mesmo deploy, mesmo repositório
- Compartilhamento de componentes, types e utils
- Firebase Auth já configurado

---

## 2. ARQUITETURA DO SISTEMA

### 2.1 Estrutura de Rotas

```
/chamados                          → Página de login do sistema
/chamados/novo                     → Formulário de abertura de chamado (qualquer colaborador)
/chamados/meus                     → Listagem dos meus chamados (solicitante)
/chamados/meus/[id]                → Detalhe do meu chamado + timeline
/chamados/painel                   → Dashboard do gestor/admin
/chamados/painel/[id]              → Detalhe do chamado (visão admin)
/chamados/painel/relatorios        → Relatórios e métricas
/chamados/painel/configuracoes     → Configurações do sistema
```

### 2.2 Estrutura de Pastas no Projeto

```
src/
├── app/
│   └── chamados/
│       ├── layout.tsx                    # Layout exclusivo (sem nav do site)
│       ├── page.tsx                      # Login
│       ├── novo/
│       │   └── page.tsx                  # Abrir chamado
│       ├── meus/
│       │   ├── page.tsx                  # Meus chamados
│       │   └── [id]/
│       │       └── page.tsx              # Detalhe do chamado
│       └── painel/
│           ├── page.tsx                  # Dashboard admin
│           ├── [id]/
│           │   └── page.tsx              # Detalhe admin
│           ├── relatorios/
│           │   └── page.tsx              # Relatórios
│           └── configuracoes/
│               └── page.tsx              # Configurações
│
├── components/
│   └── chamados/
│       ├── layout/
│       │   ├── ChamadosSidebar.tsx       # Menu lateral
│       │   ├── ChamadosHeader.tsx        # Header com notificações
│       │   └── ChamadosLayout.tsx        # Wrapper layout
│       ├── forms/
│       │   ├── NovoChamadoForm.tsx       # Formulário principal
│       │   ├── ChamadoFilters.tsx        # Filtros de busca
│       │   └── ComentarioForm.tsx        # Adicionar comentário
│       ├── cards/
│       │   ├── ChamadoCard.tsx           # Card na listagem
│       │   ├── ChamadoStatusBadge.tsx    # Badge de status
│       │   ├── ChamadoPrioridadeBadge.tsx # Badge de prioridade
│       │   └── ChamadoStatCard.tsx       # Card de estatística
│       ├── detail/
│       │   ├── ChamadoTimeline.tsx       # Timeline de eventos
│       │   ├── ChamadoInfo.tsx           # Informações do chamado
│       │   ├── ChamadoAnexos.tsx         # Galeria de anexos
│       │   └── ChamadoAcoes.tsx          # Botões de ação
│       ├── dashboard/
│       │   ├── DashboardStats.tsx        # Cards de métricas
│       │   ├── DashboardCharts.tsx       # Gráficos
│       │   ├── DashboardRecentes.tsx     # Chamados recentes
│       │   └── DashboardKanban.tsx       # Visão Kanban
│       └── shared/
│           ├── EmptyState.tsx            # Estado vazio
│           ├── LoadingState.tsx          # Estado de carregamento
│           ├── ConfirmModal.tsx          # Modal de confirmação
│           └── NotificationBell.tsx      # Sino de notificações
│
├── lib/
│   └── chamados/
│       ├── types.ts                      # Tipos TypeScript
│       ├── constants.ts                  # Constantes (categorias, prioridades, etc)
│       ├── services/
│       │   ├── chamadoService.ts         # CRUD chamados (Firestore)
│       │   ├── comentarioService.ts      # CRUD comentários
│       │   ├── notificacaoService.ts     # Gestão de notificações
│       │   └── relatorioService.ts       # Geração de relatórios
│       ├── hooks/
│       │   ├── useChamados.ts            # Hook para listagem
│       │   ├── useChamado.ts             # Hook para detalhe
│       │   ├── useAuth.ts                # Hook de autenticação
│       │   └── useNotificacoes.ts        # Hook de notificações
│       └── utils/
│           ├── protocolo.ts              # Gerador de protocolo
│           ├── sla.ts                    # Cálculo de SLA
│           └── permissions.ts            # Controle de permissões
│
├── app/api/
│   └── chamados/
│       ├── notificar/route.ts            # API de notificação por email
│       ├── relatorio/route.ts            # Geração de relatório PDF
│       └── webhook/route.ts              # Webhook para integrações futuras
```

### 2.3 Modelo de Dados (Firebase Firestore)

#### Collection: `chamados`

```typescript
interface Chamado {
  id: string                          // Auto-generated
  protocolo: string                   // "CHM-2026-00001"
  
  // Solicitante
  solicitante: {
    nome: string
    email: string
    telefone?: string
    cargo?: string
    setor: string
  }
  
  // Chamado
  unidade: 'alphaville' | 'buena-vista' | 'marista' | 'palmas'
  categoria: 'ti' | 'manutencao' | 'limpeza' | 'administrativo'
  subcategoria: string                // Ex: "computador", "ar-condicionado", etc
  titulo: string
  descricao: string
  local: string                       // Local específico dentro da unidade
  
  // Classificação
  prioridade: 'baixa' | 'media' | 'alta' | 'critica'
  status: 'aberto' | 'em_andamento' | 'aguardando' | 'resolvido' | 'fechado' | 'cancelado'
  
  // Responsável
  atribuidoPara?: {
    uid: string
    nome: string
    email: string
  }
  
  // Anexos
  anexos: {
    nome: string
    url: string
    tipo: string                      // MIME type
    tamanho: number
  }[]
  
  // SLA
  sla: {
    prazoResposta: Timestamp          // Baseado na prioridade
    prazoResolucao: Timestamp         // Baseado na prioridade
    respondidoEm?: Timestamp
    resolvidoEm?: Timestamp
    estourado: boolean
  }
  
  // Metadata
  criadoEm: Timestamp
  atualizadoEm: Timestamp
  fechadoEm?: Timestamp
  avaliacaoSolicitante?: {
    nota: 1 | 2 | 3 | 4 | 5
    comentario?: string
  }
}
```

#### Collection: `chamados/{id}/historico` (Subcollection)

```typescript
interface HistoricoChamado {
  id: string
  tipo: 'criacao' | 'comentario' | 'mudanca_status' | 'atribuicao' | 
        'mudanca_prioridade' | 'anexo' | 'avaliacao'
  descricao: string
  autor: {
    uid: string
    nome: string
    role: 'solicitante' | 'tecnico' | 'admin'
  }
  dados?: {
    de?: string                       // Status/prioridade anterior
    para?: string                     // Status/prioridade novo
    comentario?: string
    anexo?: { nome: string; url: string }
  }
  criadoEm: Timestamp
}
```

#### Collection: `chamados_usuarios`

```typescript
interface ChamadoUsuario {
  uid: string                         // Firebase Auth UID
  email: string
  nome: string
  role: 'solicitante' | 'tecnico' | 'admin' | 'gestor'
  unidades: string[]                  // Unidades que tem acesso
  categorias?: string[]               // Categorias que pode atender (técnico)
  ativo: boolean
  criadoEm: Timestamp
  ultimoAcesso?: Timestamp
}
```

#### Collection: `chamados_notificacoes`

```typescript
interface ChamadoNotificacao {
  id: string
  usuarioId: string
  chamadoId: string
  protocolo: string
  tipo: 'novo_chamado' | 'atribuido' | 'comentario' | 'status_alterado' | 
        'sla_proximo' | 'sla_estourado' | 'resolvido'
  titulo: string
  mensagem: string
  lida: boolean
  emailEnviado: boolean
  criadoEm: Timestamp
}
```

#### Collection: `chamados_config`

```typescript
interface ChamadoConfig {
  id: 'global'
  sla: {
    baixa: { resposta: number; resolucao: number }    // Em horas
    media: { resposta: number; resolucao: number }
    alta: { resposta: number; resolucao: number }
    critica: { resposta: number; resolucao: number }
  }
  categorias: {
    ti: { subcategorias: string[]; responsavelPadrao?: string }
    manutencao: { subcategorias: string[]; responsavelPadrao?: string }
    limpeza: { subcategorias: string[]; responsavelPadrao?: string }
    administrativo: { subcategorias: string[]; responsavelPadrao?: string }
  }
  emailsNotificacao: {
    [unidade: string]: string[]       // Emails que recebem cópia por unidade
  }
  horarioFuncionamento: {
    inicio: string                    // "08:00"
    fim: string                       // "18:00"
    diasUteis: number[]               // [1,2,3,4,5] = Seg-Sex
  }
}
```

---

## 3. FUNCIONALIDADES DETALHADAS

### 3.1 Módulo de Autenticação e Acesso

**Referências:** Firebase Auth (já existente no projeto), modelo de roles similar ao Freshdesk/osTicket

| Funcionalidade | Descrição |
|---|---|
| Login por email/senha | Firebase Auth (mesmo já utilizado na /admin) |
| Registro de novos usuários | Somente via admin (não self-service) |
| Roles e permissões | 4 níveis: Solicitante, Técnico, Gestor, Admin |
| Controle por unidade | Cada usuário tem acesso a unidades específicas |
| Sessão persistente | Manter logado por 7 dias |
| Recuperação de senha | Firebase Auth nativo |

**Tabela de Permissões:**

| Ação | Solicitante | Técnico | Gestor | Admin |
|---|---|---|---|---|
| Abrir chamado | ✅ | ✅ | ✅ | ✅ |
| Ver seus chamados | ✅ | ✅ | ✅ | ✅ |
| Comentar no chamado | ✅ (próprios) | ✅ (atribuídos) | ✅ (unidade) | ✅ (todos) |
| Alterar status | ❌ | ✅ (atribuídos) | ✅ (unidade) | ✅ (todos) |
| Atribuir técnico | ❌ | ❌ | ✅ | ✅ |
| Ver dashboard | ❌ | ❌ | ✅ | ✅ |
| Ver relatórios | ❌ | ❌ | ✅ | ✅ |
| Gerenciar usuários | ❌ | ❌ | ❌ | ✅ |
| Gerenciar configurações | ❌ | ❌ | ❌ | ✅ |
| Cancelar chamado | ✅ (próprios, se aberto) | ❌ | ✅ | ✅ |

### 3.2 Módulo de Abertura de Chamados

**Referências:** Zendesk (formulário inteligente), Freshdesk (categorização automática), osTicket (campos customizáveis)

**Formulário Principal:**

| Campo | Tipo | Obrigatório | Notas |
|---|---|---|---|
| Unidade | Select | ✅ | Alphaville, Buena Vista, Marista, Palmas |
| Categoria | Select | ✅ | TI, Manutenção, Limpeza, Administrativo |
| Subcategoria | Select dinâmico | ✅ | Muda conforme categoria selecionada |
| Título | Input text | ✅ | Max 100 caracteres |
| Descrição | Textarea rich | ✅ | Min 20 caracteres, com formatação básica |
| Local específico | Input text | ✅ | Ex: "Sala de musculação, andar 2" |
| Prioridade | Radio/Select | ✅ | Com descrição visual de cada nível |
| Anexos | File upload | ❌ | Até 5 arquivos, máx 10MB cada (fotos, PDF) |

**Subcategorias por Categoria:**

```
TI:
├── Computador / Notebook
├── Internet / Wi-Fi
├── Impressora
├── Software / Sistema
├── Câmera de segurança
├── Som / Áudio ambiente
├── TV / Monitor
├── Ponto eletrônico
└── Outro

Manutenção:
├── Ar-condicionado
├── Iluminação
├── Equipamento de academia
├── Hidráulica / Encanamento
├── Elétrica
├── Porta / Fechadura
├── Pintura / Parede
├── Piso
├── Elevador
└── Outro

Limpeza:
├── Banheiro / Vestiário
├── Área de treino
├── Recepção
├── Estacionamento
├── Piscina (se aplicável)
├── Copa / Cozinha
├── Área externa
└── Outro

Administrativo:
├── Recursos Humanos
├── Financeiro
├── Compras / Suprimentos
├── Contrato / Documentação
├── Comunicação interna
└── Outro
```

**Comportamentos do formulário:**
- Campos aparecem progressivamente (progressive disclosure) — primeiro unidade e categoria, depois o restante
- Subcategoria carrega dinamicamente ao selecionar categoria
- Preview do chamado antes de enviar
- Upload com drag-and-drop e preview de imagens
- Estimativa de SLA exibida ao selecionar prioridade
- Auto-save em rascunho (localStorage)

### 3.3 Módulo de Acompanhamento (Visão Solicitante)

**Referências:** HelpDesk (timeline simples), HappyFox (portal do cliente)

| Funcionalidade | Descrição |
|---|---|
| Lista de chamados | Cards com status, prioridade, data, protocolo |
| Filtros | Por status, categoria, data, prioridade |
| Busca | Por protocolo, título ou descrição |
| Detalhe do chamado | Timeline completa de eventos |
| Adicionar comentário | Com opção de anexar arquivo |
| Cancelar chamado | Somente se status = "aberto" |
| Avaliação | Ao resolver, solicitante avalia de 1-5 estrelas |
| Notificações in-app | Badge no header com contagem |

**Visão da lista:**
- Cards com indicador visual de cor por prioridade
- Indicador de SLA (verde = ok, amarelo = próximo, vermelho = estourado)
- Ordenação por mais recente / mais antigo / prioridade
- Paginação infinita (scroll) ou paginação numérica

### 3.4 Módulo de Gestão (Dashboard Admin/Gestor)

**Referências:** Jira Service Management (kanban), Zendesk (métricas), ServiceDesk Plus (relatórios)

#### Dashboard Principal

| Widget | Descrição |
|---|---|
| Cards de métricas | Total abertos, em andamento, resolvidos hoje, SLA estourado |
| Gráfico de pizza | Distribuição por categoria |
| Gráfico de barras | Chamados por unidade |
| Gráfico de linha | Tendência semanal/mensal |
| Lista de urgentes | Chamados críticos e com SLA próximo |
| Atividade recente | Últimas 10 ações no sistema |

#### Visão de Listagem Avançada

| Funcionalidade | Descrição |
|---|---|
| Tabela completa | Com todas colunas sortáveis |
| Filtros avançados | Unidade, categoria, status, prioridade, técnico, data |
| Busca global | Protocolo, título, solicitante |
| Seleção múltipla | Para ações em lote |
| Ações em lote | Atribuir, alterar status, alterar prioridade |
| Exportar | CSV / PDF |

#### Visão Kanban (Inspirado no Jira)

Colunas arrastáveis:
```
Aberto → Em Andamento → Aguardando → Resolvido → Fechado
```
- Drag and drop para mudar status
- Filtro por unidade / categoria / técnico
- Contagem por coluna
- Indicador de SLA em cada card

#### Detalhe do Chamado (Admin)

| Funcionalidade | Descrição |
|---|---|
| Informações completas | Todos os dados do chamado |
| Timeline completa | Criação, comentários, mudanças de status, atribuições |
| Atribuir técnico | Select com lista de técnicos disponíveis |
| Alterar status | Com campo obrigatório de justificativa |
| Alterar prioridade | Com registro no histórico |
| Comentar | Comentário interno (só admin) ou público (visível ao solicitante) |
| Anexar arquivo | Adicionar documentos/fotos |
| Métricas do chamado | Tempo de resposta, tempo de resolução, SLA |

### 3.5 Módulo de Notificações por Email (Resend)

**Utilizando a API do Resend já configurada no domínio.**

#### Emails Automáticos

| Evento | Destinatário | Assunto |
|---|---|---|
| Chamado criado | Solicitante | "Chamado {protocolo} aberto com sucesso" |
| Chamado criado | Admin da unidade | "Novo chamado {protocolo} — {categoria}" |
| Chamado atribuído | Técnico | "Chamado {protocolo} atribuído a você" |
| Novo comentário | Solicitante/Técnico | "Novo comentário no chamado {protocolo}" |
| Status alterado | Solicitante | "Chamado {protocolo} — Status: {novo_status}" |
| SLA próximo (80%) | Técnico + Gestor | "⚠️ SLA do chamado {protocolo} próximo do prazo" |
| SLA estourado | Gestor + Admin | "🚨 SLA estourado — Chamado {protocolo}" |
| Chamado resolvido | Solicitante | "Chamado {protocolo} resolvido — Avalie o atendimento" |
| Relatório semanal | Gestores | "Relatório Semanal de Chamados — {unidade}" |

#### API Route: `/api/chamados/notificar`

```typescript
// Estrutura da API
POST /api/chamados/notificar
Body: {
  tipo: 'novo' | 'atribuido' | 'comentario' | 'status' | 'sla_proximo' | 'sla_estourado' | 'resolvido'
  chamadoId: string
  destinatarios: { email: string; nome: string }[]
  dados: Record<string, any>
}
```

#### Templates de Email

Seguir o padrão visual já existente nos emails do site (HTML inline com tabelas), mesma identidade visual Flex Fitness:

- Header: Logo + Nome do sistema
- Corpo: Card branco com borda colorida por prioridade
- Tabela de dados do chamado
- Botão CTA: "Ver Chamado" (link direto)
- Footer: Informações da empresa
- Cores por prioridade: Baixa (azul), Média (amarelo), Alta (laranja), Crítica (vermelho)

#### Mapeamento de Emails por Unidade (Baseado no padrão existente)

```typescript
const emailsPorUnidade: Record<string, string[]> = {
  'alphaville': [
    'vendas.alphaville@flexacademia.com.br',
    'supervisaotecnicaalphaville@flexacademia.com.br'
  ],
  'buena-vista': [
    'vendasflexbuenavista@flexacademia.com.br',
    'supervisaotecnicabuenavista@flexacademia.com.br'
  ],
  'marista': [
    'jonatas@flexacademia.com.br',
    'vendasmarista@flexacademia.com.br'
  ],
  'palmas': [
    'vendaspalmas@flexacademia.com.br',
    'gestaotecnica@flexpalmas.com.br'
  ],
  'geral': [
    'hudson@flexacademia.com.br',
    'comercial@flexacademia.com.br'
  ]
}
```

### 3.6 Módulo de SLA (Service Level Agreement)

**Referências:** Jira SLA tracking, Zendesk SLA policies

#### Configuração Padrão de SLA

| Prioridade | Tempo de Resposta | Tempo de Resolução | Cor |
|---|---|---|---|
| Baixa | 24h úteis | 72h úteis | 🔵 Azul |
| Média | 8h úteis | 48h úteis | 🟡 Amarelo |
| Alta | 4h úteis | 24h úteis | 🟠 Laranja |
| Crítica | 1h úteis | 8h úteis | 🔴 Vermelho |

#### Regras de SLA

- SLA conta apenas em **horário de funcionamento** (configurável)
- Finais de semana e feriados **pausam** o SLA
- Ao atingir **80% do prazo**, notificação de alerta é disparada
- Ao **estourar**, notificação escalada para gestor
- Chamados com status "aguardando" (ex: esperando informação do solicitante) **pausam** o SLA
- Dashboard exibe indicador visual: verde (< 50%), amarelo (50-80%), vermelho (> 80%), preto (estourado)

### 3.7 Módulo de Relatórios

**Referências:** Freshdesk Analytics, ServiceDesk Plus reports

| Relatório | Descrição | Formato |
|---|---|---|
| Visão geral | Total de chamados por período, status, categoria, unidade | Dashboard |
| Performance por técnico | Chamados atendidos, tempo médio, SLA cumprido | Tabela + gráficos |
| Análise de SLA | % de cumprimento por categoria, unidade, prioridade | Gráficos |
| Tendência | Evolução de chamados ao longo do tempo | Gráfico de linha |
| Top problemas | Subcategorias com mais chamados | Ranking |
| Satisfação | Média de avaliação por técnico, unidade, categoria | Gráficos |
| Exportação | Relatório completo para download | PDF / CSV |

#### Filtros de Relatório

- Período (hoje, 7 dias, 30 dias, 90 dias, customizado)
- Unidade (todas ou específica)
- Categoria (todas ou específica)
- Técnico (todos ou específico)

---

## 4. DESIGN UI/UX

### 4.1 Princípios de Design

| Princípio | Implementação |
|---|---|
| **Simplicidade** | Formulário progressivo, poucos cliques para abrir chamado |
| **Clareza visual** | Cores por prioridade/status, ícones informativos |
| **Responsividade** | Mobile-first (colaboradores podem abrir do celular) |
| **Acessibilidade** | Contraste adequado, labels claros, navegação por teclado |
| **Feedback imediato** | Loading states, toasts de confirmação, animações sutis |
| **Consistência** | Mesma linguagem visual do site Flex (cores, fontes, spacing) |

### 4.2 Paleta de Cores do Sistema de Chamados

```
Base (do site):
- Primary: #1E40AF (azul principal)
- Secondary: #3B82F6 (azul médio)
- Accent: #60A5FA (azul claro)
- Dark: #0F172A
- Light: #F8FAFC

Status:
- Aberto: #3B82F6 (azul)
- Em Andamento: #F59E0B (amarelo)
- Aguardando: #8B5CF6 (roxo)
- Resolvido: #10B981 (verde)
- Fechado: #6B7280 (cinza)
- Cancelado: #EF4444 (vermelho)

Prioridade:
- Baixa: #3B82F6 (azul)
- Média: #F59E0B (amarelo)
- Alta: #F97316 (laranja)
- Crítica: #EF4444 (vermelho) + pulsante
```

### 4.3 Layout

**Desktop:** Sidebar fixa à esquerda (240px) + conteúdo principal à direita. Header com busca global, notificações e perfil.

**Mobile:** Sidebar vira menu hamburger. Cards adaptados para tela cheia. Formulário em etapas (wizard) no mobile.

**Componentes chave com Tailwind:**
- Sidebar: `fixed left-0 w-60 h-screen bg-white border-r`
- Cards: `bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition`
- Badges: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`
- Tabela: `min-w-full divide-y divide-gray-200`
- Timeline: `relative border-l-2 border-gray-200 pl-6 space-y-6`

### 4.4 Telas Principais (Wireframe Descritivo)

#### Tela 1: Login
- Card centralizado com logo Flex
- Campos email + senha
- Botão "Entrar" com gradiente azul
- Link "Esqueci minha senha"
- Background: gradiente azul escuro → azul médio

#### Tela 2: Novo Chamado
- Step 1: Seleciona unidade + categoria (cards visuais com ícones)
- Step 2: Preenche subcategoria + título + local + prioridade
- Step 3: Descrição detalhada + anexos (drag-and-drop zone)
- Step 4: Preview/resumo + botão "Abrir Chamado"
- Barra de progresso no topo (4 steps)

#### Tela 3: Meus Chamados
- Header com filtros rápidos (status pills clicáveis)
- Campo de busca
- Lista de cards de chamado com:
  - Badge de status (colorido)
  - Badge de prioridade
  - Protocolo + título
  - Unidade + categoria
  - Data de abertura
  - Indicador de SLA
  - Avatar do técnico atribuído (se houver)

#### Tela 4: Detalhe do Chamado
- Coluna esquerda (2/3): Timeline de eventos (estilo GitHub issues)
  - Cada evento com avatar, nome, data, descrição
  - Comentários com rich text
  - Mudanças de status com badge antes → depois
- Coluna direita (1/3): Card fixo com informações
  - Status (editável por admin)
  - Prioridade
  - Técnico atribuído
  - SLA (barra de progresso)
  - Anexos
  - Ações rápidas

#### Tela 5: Dashboard Admin
- Row 1: 4 cards de métricas com ícones e variação %
- Row 2: Gráfico de chamados por dia (linha) + pizza por categoria
- Row 3: Tabela de chamados urgentes + atividade recente
- Filtros no topo: período + unidade

#### Tela 6: Kanban
- 5 colunas com scroll vertical
- Cards arrastáveis com info resumida
- Filtros acima: unidade + categoria + técnico
- Contagem em cada coluna header

---

## 5. INTEGRAÇÕES E AUTOMAÇÕES

### 5.1 Automações Baseadas em Regras

| Automação | Trigger | Ação |
|---|---|---|
| Auto-atribuição | Chamado criado em categoria com responsável padrão | Atribui automaticamente |
| Escalação | SLA estourado | Notifica gestor da unidade |
| Lembrete | Chamado sem ação por 24h | Notifica técnico atribuído |
| Fechamento automático | Chamado resolvido sem interação por 72h | Fecha automaticamente |
| Reabertura | Solicitante comenta em chamado resolvido | Reabre chamado |

### 5.2 Cron Jobs (via Vercel Cron ou Firebase Functions)

| Job | Frequência | Ação |
|---|---|---|
| Verificar SLA | A cada 15 minutos | Checa prazos e dispara alertas |
| Fechamento automático | Diariamente às 00:00 | Fecha chamados resolvidos há 72h |
| Relatório semanal | Segunda-feira 08:00 | Envia resumo por email aos gestores |
| Limpeza de notificações | Semanalmente | Remove notificações lidas há 30+ dias |

---

## 6. PLANO DE IMPLEMENTAÇÃO

### 6.1 Fases de Desenvolvimento

#### FASE 1 — Fundação (Semanas 1-2)

| Task | Descrição | Prioridade |
|---|---|---|
| 1.1 | Setup das rotas `/chamados/*` e layout isolado | Alta |
| 1.2 | Configurar regras de segurança Firestore para novas collections | Alta |
| 1.3 | Criar tipos TypeScript (types.ts) | Alta |
| 1.4 | Criar constantes (categorias, subcategorias, status, prioridades) | Alta |
| 1.5 | Implementar sistema de autenticação (login, roles, permissions) | Alta |
| 1.6 | Criar collection `chamados_usuarios` e seed de admin | Alta |
| 1.7 | Criar collection `chamados_config` com configuração padrão | Média |
| 1.8 | Criar componentes base (Layout, Sidebar, Header) | Alta |

#### FASE 2 — Abertura e Listagem (Semanas 3-4)

| Task | Descrição | Prioridade |
|---|---|---|
| 2.1 | Formulário de abertura de chamado (wizard 4 steps) | Alta |
| 2.2 | Serviço de CRUD (chamadoService.ts) | Alta |
| 2.3 | Gerador de protocolo único | Alta |
| 2.4 | Upload de anexos para Firebase Storage | Alta |
| 2.5 | Listagem "Meus Chamados" com filtros e busca | Alta |
| 2.6 | Tela de detalhe com timeline | Alta |
| 2.7 | Funcionalidade de comentários | Média |
| 2.8 | Notificações in-app (badge + lista) | Média |

#### FASE 3 — Emails e SLA (Semanas 5-6)

| Task | Descrição | Prioridade |
|---|---|---|
| 3.1 | API Route `/api/chamados/notificar` | Alta |
| 3.2 | Templates de email HTML (6+ templates) | Alta |
| 3.3 | Integrar envio de email em cada evento | Alta |
| 3.4 | Cálculo de SLA (respeitando horário comercial) | Alta |
| 3.5 | Indicadores visuais de SLA na listagem e detalhe | Média |
| 3.6 | Alertas automáticos de SLA (80% e estourado) | Média |
| 3.7 | Email de relatório semanal | Baixa |

#### FASE 4 — Dashboard e Gestão (Semanas 7-8)

| Task | Descrição | Prioridade |
|---|---|---|
| 4.1 | Dashboard com métricas e gráficos | Alta |
| 4.2 | Listagem avançada com filtros e ações em lote | Alta |
| 4.3 | Visão Kanban drag-and-drop | Média |
| 4.4 | Funcionalidade de atribuição de técnico | Alta |
| 4.5 | Alteração de status/prioridade com histórico | Alta |
| 4.6 | Comentários internos (visíveis só para admin/técnico) | Média |
| 4.7 | Exportação CSV/PDF | Baixa |

#### FASE 5 — Relatórios e Polish (Semanas 9-10)

| Task | Descrição | Prioridade |
|---|---|---|
| 5.1 | Tela de relatórios completa | Média |
| 5.2 | Gráficos de tendência e performance | Média |
| 5.3 | Sistema de avaliação pós-resolução (1-5 estrelas) | Média |
| 5.4 | Tela de configurações (SLA, categorias, emails) | Média |
| 5.5 | Gestão de usuários (CRUD) | Média |
| 5.6 | Automações (fechamento automático, reabertura, etc) | Média |
| 5.7 | Responsividade completa mobile | Alta |
| 5.8 | Testes manuais e correções | Alta |
| 5.9 | Otimização de performance (Firestore indexes, etc) | Média |
| 5.10 | Documentação de uso para gestores | Baixa |

### 6.2 Estimativa de Esforço

| Fase | Semanas | Complexidade |
|---|---|---|
| Fase 1 — Fundação | 2 | Média |
| Fase 2 — Abertura e Listagem | 2 | Alta |
| Fase 3 — Emails e SLA | 2 | Alta |
| Fase 4 — Dashboard e Gestão | 2 | Alta |
| Fase 5 — Relatórios e Polish | 2 | Média |
| **Total estimado** | **10 semanas** | — |

---

## 7. DEPENDÊNCIAS TÉCNICAS

### 7.1 Pacotes NPM Adicionais

```bash
# Gráficos para dashboard/relatórios
npm install recharts

# Drag and drop para Kanban
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# Dates (cálculo de SLA respeitando horário comercial)
npm install date-fns

# Upload de arquivos com preview
npm install react-dropzone

# Exportação CSV
npm install papaparse
npm install @types/papaparse --save-dev

# Rich text para comentários (opcional)
npm install @tiptap/react @tiptap/starter-kit

# Toast notifications
npm install react-hot-toast
```

### 7.2 Regras do Firestore (Atualizar)

```javascript
// Adicionar às rules existentes:
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ... regras existentes ...
    
    // Chamados
    match /chamados/{chamadoId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      
      match /historico/{historicoId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null;
      }
    }
    
    match /chamados_usuarios/{userId} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }
    
    match /chamados_notificacoes/{notifId} {
      allow read: if request.auth != null && 
                     resource.data.usuarioId == request.auth.uid;
      allow update: if request.auth != null && 
                       resource.data.usuarioId == request.auth.uid;
    }
    
    match /chamados_config/{configId} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }
    
    function isAdmin() {
      return get(/databases/$(database)/documents/chamados_usuarios/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### 7.3 Índices do Firestore (Criar)

```
Collection: chamados
- unidade ASC, criadoEm DESC
- status ASC, criadoEm DESC
- categoria ASC, criadoEm DESC
- atribuidoPara.uid ASC, status ASC, criadoEm DESC
- solicitante.email ASC, criadoEm DESC
- unidade ASC, status ASC, criadoEm DESC
- unidade ASC, categoria ASC, status ASC, criadoEm DESC

Collection: chamados_notificacoes
- usuarioId ASC, lida ASC, criadoEm DESC
```

### 7.4 Firebase Storage Rules (Atualizar)

```javascript
// Adicionar regra para anexos de chamados
match /chamados/{chamadoId}/{allPaths=**} {
  allow read: if request.auth != null;
  allow write: if request.auth != null
    && request.resource.size < 10 * 1024 * 1024  // max 10MB
    && request.resource.contentType.matches('image/.*|application/pdf');
}
```

---

## 8. CHECKLIST PRÉ-DEPLOY

- [ ] Todos os tipos TypeScript definidos e sem erros
- [ ] Regras de segurança do Firestore atualizadas e testadas
- [ ] Índices compostos do Firestore criados
- [ ] Storage rules atualizadas
- [ ] Templates de email testados em múltiplos clientes (Gmail, Outlook)
- [ ] Responsividade testada em mobile (iPhone, Android)
- [ ] SLA calculando corretamente com horário comercial
- [ ] Emails disparando corretamente via Resend
- [ ] Performance OK (Firestore queries < 1s)
- [ ] Variáveis de ambiente documentadas
- [ ] Seed de dados de teste removido
- [ ] Admin inicial criado
- [ ] robots.txt atualizado para bloquear /chamados/* do Google
- [ ] Middleware Next.js para proteger rotas /chamados/*

---

## 9. VARIÁVEIS DE AMBIENTE (Adicionar ao .env)

```env
# Já existentes (manter):
RESEND_API_KEY=re_xxxxx
NEXT_PUBLIC_FIREBASE_API_KEY=xxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxxxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxxxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxxxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxxxx

# Novas (adicionar):
CHAMADOS_ADMIN_EMAIL=admin@flexacademia.com.br
CHAMADOS_FROM_EMAIL=chamados@flexacademia.com.br
CHAMADOS_REPLY_TO=suporte@flexacademia.com.br
```

---

## 10. CONSIDERAÇÕES FINAIS

### 10.1 Segurança
- Endpoint `/chamados` protegido por autenticação Firebase
- Adicionar `noindex, nofollow` no layout dos chamados
- Implementar rate limiting no envio de emails
- Validar todos os inputs server-side nas API routes
- Sanitizar HTML nos comentários para prevenir XSS

### 10.2 Performance
- Usar Firestore listeners para atualizações real-time no dashboard
- Implementar paginação cursor-based (não offset) no Firestore
- Lazy loading de imagens nos anexos
- Code splitting automático do Next.js por rota

### 10.3 Escalabilidade Futura
- Base de dados já preparada para novas categorias
- Estrutura modular permite adicionar novas unidades facilmente
- API routes prontas para integração com WhatsApp Business API
- Possibilidade de adicionar chatbot para abertura de chamados
- Estrutura permite implementar workflow de aprovação (chamados que precisam de aprovação antes de executar)

### 10.4 Monitoramento
- Logs no console.log (já padrão do projeto) para debugging
- Considerar integrar Sentry para error tracking em produção
- Firebase Analytics para métricas de uso do sistema

---

**Documento preparado para início imediato de desenvolvimento.**  
**Stack 100% compatível com o projeto Flex Fitness existente.**