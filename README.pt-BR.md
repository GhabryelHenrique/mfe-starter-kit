# Angular MFE Starter Kit

> Referência de produção para **Microfrontends com Angular 21 + Native Federation** em topologia polyrepo. Cada decisão técnica está documentada no código — o "porquê" junto com o "o quê".

[![Angular](https://img.shields.io/badge/Angular-21-dd0031?logo=angular)](https://angular.dev)
[![Native Federation](https://img.shields.io/badge/Native_Federation-21.2-1976d2)](https://github.com/angular-architects/module-federation-plugin)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

🇺🇸 [Read in English](./README.md)

---

## O que é este projeto?

A maioria dos tutoriais de Microfrontend mostra dois botões numa tela e chama de "MFE". Este repo é diferente: é uma **implementação de produção mínima** com shell real, múltiplos remotes com deploy independente, comunicação cross-MFE sem acoplamento e estratégia de dependências compartilhadas documentada.

Use como:

- **Referência arquitetural** para entender as decisões que os tutoriais omitem
- **Template** para iniciar um projeto MFE real
- **Material de estudo** — cada arquivo tem comentários explicando o "porquê"

---

## Arquitetura

```
Browser
   │
   ▼
┌─────────────────────────────────────┐
│  Shell (host) — localhost:4200       │
│  router + federation.manifest.json  │
└──────┬───────────────┬──────────────┘
       │               │
       ▼               ▼
┌─────────────┐  ┌──────────────┐
│ mfe-products│  │ mfe-checkout │
│  :4201      │  │  :4202       │
│ remoteEntry │  │ remoteEntry  │
└─────────────┘  └──────────────┘
       │               │
       └───────┬───────┘
               ▼
   ┌───────────────────────────┐
   │   Dependências via        │
   │     Import Map            │
   │  @angular/*  (singleton)  │
   │  rxjs, tslib (singleton)  │
   │  @org/contracts (single.) │
   └───────────────────────────┘
```

### Comunicação entre remotes (sem import direto)

```
mfe-products ──emit(PRODUCT_SELECTED)──► EventBus ──► mfe-checkout (atualiza carrinho)
                                                  └──► shell header (badge numérico)
```

O `EventBus` é um `Subject<MfeEvent>` no pacote `@org/contracts`. Nenhum remote importa código do outro.

---

## Pré-requisitos

| Ferramenta | Versão mínima | Verificar |
|---|---|---|
| Node.js | 20.x | `node -v` |
| npm | 10.x | `npm -v` |
| Angular CLI | 21.x (global) | `ng version` |

```bash
# Instalar Angular CLI globalmente (se ainda não tiver)
npm install -g @angular/cli@^21
```

---

## Quick Start

```bash
# 1. Clone o repositório
git clone https://github.com/GhabryelHenrique/mfe-starter-kit.git
cd mfe-starter-kit

# 2. Instala dependências de todos os pacotes (root + 4 packages)
npm run install:all

# 3. Compila @org/contracts — DEVE ser feito antes dos Angular apps
#    (é uma dependência file: dos três apps)
npm run build:contracts

# 4. Sobe todos os pacotes em paralelo com saída colorida
npm run dev
```

Abra **http://localhost:4200**. Tempo estimado: < 2 minutos com cache npm quente.

### Documentação interativa

```bash
# Em outro terminal — sobe o app de documentação
npm run docs
```

Abra **http://localhost:4203** para ver a documentação completa com exemplos de código.

---

## Como testar o Event Bus (demo do projeto)

1. Acesse **<http://localhost:4200>** → redireciona para `/products`
2. Clique **"Add to Cart"** em qualquer produto
3. Observe o **badge numérico** no header atualizar em tempo real
4. Navegue para **Checkout** — o item aparece no carrinho
5. Clique **Clear** — o badge volta a zero

Nenhuma dessas ações envolve import direto entre `mfe-products` e `mfe-checkout`. Tudo passa pelo `EventBus` em `@org/contracts`.

---

## Pacotes

| Pacote | Porta | Papel | O que expõe |
| --- | --- | --- | --- |
| `mfe-shell` | 4200 | Host | layout, router, manifest |
| `mfe-products` | 4201 | Remote | `./Routes` → ProductsListComponent |
| `mfe-checkout` | 4202 | Remote | `./Routes` → CheckoutPageComponent |
| `mfe-contracts` | — | Biblioteca TS | EventBus, MfeEvent, Product, CartItem |
| `docs-starter-kit` | 4203 | App de docs | — |

---

## Como funciona — decisões técnicas

### 1. `initFederation()` antes do bootstrap

```typescript
// packages/mfe-shell/src/main.ts
initFederation(environment.federationManifest)  // ← PRIMEIRO
  .then(() => import('./bootstrap'));            // ← só depois o Angular sobe
```

**Por quê?** Native Federation injeta um **Import Map** no browser em runtime. Esse Import Map é o que permite que `loadRemoteModule()` dentro das rotas saiba a URL real de cada remote. Se `bootstrapApplication()` rodasse antes, as chamadas de `loadRemoteModule()` falhariam porque o Import Map ainda não existiria.

---

### 2. Manifest por ambiente

Três arquivos JSON, um por ambiente:

```
public/
  federation.manifest.dev.json      → localhost:4201, localhost:4202
  federation.manifest.staging.json  → URLs de staging
  federation.manifest.prod.json     → URLs de produção
```

O `angular.json` usa `fileReplacements` para trocar `environment.ts` conforme a configuração de build:

```bash
ng build --configuration production  # usa environment.prod.ts → manifest.prod.json
ng build --configuration staging     # usa environment.staging.ts → manifest.staging.json
ng serve                             # usa environment.ts → manifest.dev.json
```

**Por quê isso importa?** O shell não precisa ser rebuildado quando um remote faz deploy. Só o `federation.manifest.prod.json` precisa ser atualizado com a nova URL do remote. Veja `.github/workflows/ci-products.yml` para o padrão de automação.

---

### 3. Estratégia de shared deps (`strictVersion`)

```javascript
// federation.config.js — padrão em todos os pacotes
shared: {
  // Baseline: compartilha tudo, permite divergência de patch/minor
  ...shareAll({ singleton: true, strictVersion: false, requiredVersion: 'auto' }),

  // Override para Angular — DI system global, zero tolerância
  '@angular/core': { singleton: true, strictVersion: true, requiredVersion: 'auto' },

  // @org/contracts — singleton obrigatório para o EventBus funcionar
  '@org/contracts': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
}
```

| Configuração | Comportamento | Quando usar |
|---|---|---|
| `strictVersion: false` | Versões diferentes coexistem (usa a do host) | RxJS, tslib, libs utilitárias |
| `strictVersion: true` | Versão diferente = **erro em runtime** | Angular core, `@org/contracts` |
| `singleton: true` | Apenas **1 instância** no browser | Tudo que tiver estado global |

Ver [`SHARED_DEPS.md`](./SHARED_DEPS.pt-BR.md) para a análise completa.

---

### 4. Comunicação cross-MFE com `@org/contracts`

**Anti-padrão** (acoplamento direto):

```typescript
// ❌ NUNCA faça isso em mfe-checkout
import { ProductsListComponent } from 'mfe-products/...'
```

**Padrão correto** (via contrato):

```typescript
// ✅ mfe-checkout só conhece @org/contracts
this.bus.on('PRODUCT_SELECTED').subscribe(event => {
  // event.payload é Product — tipagem completa pelo discriminated union
});
```

O `EventBusService` é um **singleton de módulo JS** — a variável `_instance` existe uma única vez porque `@org/contracts` é carregado uma única vez pelo browser (garantido pelo `singleton: true` no shared config de todos os pacotes).

---

### 5. Error boundary por rota

```typescript
// packages/mfe-shell/src/app/app.routes.ts
{
  path: 'products',
  loadChildren: () =>
    loadRemoteModule('mfe-products', './Routes')
      .then(m => m.routes)
      .catch(() => [{ path: '**', component: RemoteErrorComponent }])
      //     ↑ remote offline → mostra página de erro sem quebrar o shell
}
```

**Teste:** derrube o processo `mfe-products` e navegue para `/products` → `RemoteErrorComponent` renderiza. As outras rotas continuam funcionando.

---

## Estrutura de pacotes

```
mfe-starter-kit/
├── .github/workflows/
│   ├── ci-shell.yml       # build + deploy shell
│   ├── ci-products.yml    # build + deploy + atualiza manifest
│   └── ci-checkout.yml
├── packages/
│   ├── mfe-contracts/     # @org/contracts — TypeScript puro
│   │   └── src/lib/
│   │       ├── events.ts             # MfeEvent discriminated union
│   │       ├── event-bus.service.ts  # Subject + on<K>() + getInstance()
│   │       └── models/               # Product, CartItem
│   ├── mfe-shell/
│   │   ├── federation.config.js      # host: shared deps documentados
│   │   ├── public/                   # 3 manifests por ambiente
│   │   └── src/
│   │       ├── main.ts               # initFederation() → import('./bootstrap')
│   │       ├── environments/         # 3 arquivos de ambiente
│   │       └── app/
│   │           ├── app.routes.ts     # loadRemoteModule + error boundary
│   │           ├── core/tokens/      # EVENT_BUS InjectionToken
│   │           └── layout/           # ShellLayout, Header (badge), Footer
│   ├── mfe-products/
│   │   ├── federation.config.js      # remote: expõe './Routes'
│   │   └── src/app/products/         # ProductsList (emit), ProductCard
│   ├── mfe-checkout/
│   │   ├── federation.config.js      # remote: expõe './Routes'
│   │   └── src/app/checkout/         # CheckoutPage (subscribe), Cart
│   └── docs-starter-kit/
│       └── src/app/pages/            # Documentação interativa (:4203)
├── scripts/dev.js         # concurrently: contratos + 3 Angular apps
├── SHARED_DEPS.pt-BR.md   # análise completa do trade-off strictVersion
└── CONTRIBUTING.pt-BR.md  # como extrair para polyrepo real
```

---

## Como adicionar um novo remote

```bash
# 1. Scaffolda o projeto Angular dentro de packages/
cd packages
ng new mfe-dashboard --routing --style=scss --standalone --skip-git

# 2. Adiciona Native Federation como remote na porta 4204
cd mfe-dashboard
ng add @angular-architects/native-federation@^21 --type remote --port 4204

# 3. Copie o padrão de federation.config.js de mfe-products
#    (substitua name: 'mfe-products' por name: 'mfe-dashboard')
#    (substitua './Routes' pelo path correto)

# 4. Adicione @org/contracts no package.json e npm install
#    "@org/contracts": "file:../mfe-contracts"

# 5. Adicione a entrada no manifest de dev
#    packages/mfe-shell/public/federation.manifest.dev.json:
#    "mfe-dashboard": "http://localhost:4204/remoteEntry.json"

# 6. Adicione a rota no shell (packages/mfe-shell/src/app/app.routes.ts)
#    { path: 'dashboard', loadChildren: () => loadRemoteModule('mfe-dashboard', './Routes')... }

# 7. Adicione o processo em scripts/dev.js

# 8. Crie .github/workflows/ci-dashboard.yml
```

---

## Troubleshooting

| Sintoma | Causa provável | Solução |
| --- | --- | --- |
| Console: "Angular loaded twice" ou erro de DI | `singleton: true` ausente em algum pacote | Verificar `federation.config.js` de todos — `@angular/core` deve ter `singleton: true` em todos |
| Error boundary aparece ao carregar remote | URL errada no manifest ou remote offline | Conferir `public/federation.manifest.dev.json` e se `npm run dev` está rodando |
| Badge do header não atualiza / CART_UPDATED não chega | `@org/contracts` não está no `shared` config | Adicionar `'@org/contracts': { singleton: true, strictVersion: true }` em todos os `federation.config.js` |
| Erro `Unsatisfied version constraint` em runtime | Versões Angular divergentes entre shell e remote | Sincronizar `@angular/*` no `package.json` de todos os pacotes para a mesma versão |

---

## Roadmap

- [x] MVP: shell + 2 remotes + event bus
- [x] Comunicação cross-MFE via `@org/contracts`
- [x] Manifest por ambiente (dev / staging / prod)
- [x] Error boundary por rota
- [x] CI/CD independente por remote
- [x] App de documentação (`docs-starter-kit`)
- [ ] mfe-dashboard (terceiro remote de exemplo)
- [ ] Auth guard integrado (JWT + interceptor no shell)
- [ ] Testes e2e com Playwright (shell carrega remotes reais)
- [ ] GitHub Packages publish pipeline para `@org/contracts`

---

## Referências

- [Native Federation for Angular](https://www.npmjs.com/package/@angular-architects/native-federation)
- [SHARED_DEPS.pt-BR.md](./SHARED_DEPS.pt-BR.md) — análise completa do trade-off `strictVersion`
- [CONTRIBUTING.pt-BR.md](./CONTRIBUTING.pt-BR.md) — como extrair para polyrepo real
- [Documentação interativa](http://localhost:4203) — `npm run docs`

---

## Licença

MIT © 2025 — GhabryelHenrique
