# Angular MFE Starter Kit

> Production reference for **Microfrontends with Angular 21 + Native Federation** in a polyrepo topology. Every technical decision is documented in the code — the "why" alongside the "what".

[![Angular](https://img.shields.io/badge/Angular-21-dd0031?logo=angular)](https://angular.dev)
[![Native Federation](https://img.shields.io/badge/Native_Federation-21.2-1976d2)](https://github.com/angular-architects/module-federation-plugin)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

🇧🇷 [Leia em Português](./README.pt-BR.md)

---

## What is this project?

Most Microfrontend tutorials show two buttons on a screen and call it "MFE". This repo is different: it's a **minimal production implementation** with a real shell, multiple independently deployable remotes, cross-MFE communication without coupling, and a documented shared dependencies strategy.

Use it as:

- **Architectural reference** to understand the decisions tutorials omit
- **Template** to start a real MFE project
- **Study material** — each file has comments explaining the "why"

---

## Architecture

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
   │   Dependencies via        │
   │     Import Map            │
   │  @angular/*  (singleton)  │
   │  rxjs, tslib (singleton)  │
   │  @org/contracts (single.) │
   └───────────────────────────┘
```

### Cross-remote communication (no direct import)

```
mfe-products ──emit(PRODUCT_SELECTED)──► EventBus ──► mfe-checkout (updates cart)
                                                  └──► shell header (badge counter)
```

The `EventBus` is a `Subject<MfeEvent>` in the `@org/contracts` package. No remote imports code from another.

---

## Prerequisites

| Tool | Minimum version | Check |
|---|---|---|
| Node.js | 20.x | `node -v` |
| npm | 10.x | `npm -v` |
| Angular CLI | 21.x (global) | `ng version` |

```bash
# Install Angular CLI globally (if you haven't already)
npm install -g @angular/cli@^21
```

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/GhabryelHenrique/mfe-starter-kit.git
cd mfe-starter-kit

# 2. Install dependencies for all packages (root + 4 packages)
npm run install:all

# 3. Build @org/contracts — MUST be done before the Angular apps
#    (it's a file: dependency for all three apps)
npm run build:contracts

# 4. Start all packages in parallel with color-coded output
npm run dev
```

Open **http://localhost:4200**. Estimated time: < 2 minutes with a warm npm cache.

### Interactive documentation

```bash
# In another terminal — starts the documentation app
npm run docs
```

Open **http://localhost:4203** for the full documentation with code examples.

---

## Testing the Event Bus (project demo)

1. Go to **<http://localhost:4200>** → redirects to `/products`
2. Click **"Add to Cart"** on any product
3. Watch the **badge counter** in the header update in real time
4. Navigate to **Checkout** — the item appears in the cart
5. Click **Clear** — the badge resets to zero

None of these actions involve a direct import between `mfe-products` and `mfe-checkout`. Everything goes through the `EventBus` in `@org/contracts`.

---

## Packages

| Package | Port | Role | What it exposes |
| --- | --- | --- | --- |
| `mfe-shell` | 4200 | Host | layout, router, manifest |
| `mfe-products` | 4201 | Remote | `./Routes` → ProductsListComponent |
| `mfe-checkout` | 4202 | Remote | `./Routes` → CheckoutPageComponent |
| `mfe-contracts` | — | TS Library | EventBus, MfeEvent, Product, CartItem |
| `mfe-docs` | 4203 | Docs app | — |

---

## How it works — technical decisions

### 1. `initFederation()` before bootstrap

```typescript
// packages/mfe-shell/src/main.ts
initFederation(environment.federationManifest)  // ← FIRST
  .then(() => import('./bootstrap'));            // ← Angular boots only after
```

**Why?** Native Federation injects an **Import Map** into the browser at runtime. This Import Map is what allows `loadRemoteModule()` inside the routes to know the real URL of each remote. If `bootstrapApplication()` ran first, calls to `loadRemoteModule()` would fail because the Import Map wouldn't exist yet.

---

### 2. Per-environment manifest

Three JSON files, one per environment:

```
public/
  federation.manifest.dev.json      → localhost:4201, localhost:4202
  federation.manifest.staging.json  → staging URLs
  federation.manifest.prod.json     → production URLs
```

`angular.json` uses `fileReplacements` to swap `environment.ts` according to the build configuration:

```bash
ng build --configuration production  # uses environment.prod.ts → manifest.prod.json
ng build --configuration staging     # uses environment.staging.ts → manifest.staging.json
ng serve                             # uses environment.ts → manifest.dev.json
```

**Why this matters?** The shell doesn't need to be rebuilt when a remote deploys. Only `federation.manifest.prod.json` needs to be updated with the remote's new URL. See `.github/workflows/ci-products.yml` for the automation pattern.

---

### 3. Shared deps strategy (`strictVersion`)

```javascript
// federation.config.js — pattern used in all packages
shared: {
  // Baseline: share everything, allow patch/minor divergence
  ...shareAll({ singleton: true, strictVersion: false, requiredVersion: 'auto' }),

  // Override for Angular — global DI system, zero tolerance
  '@angular/core': { singleton: true, strictVersion: true, requiredVersion: 'auto' },

  // @org/contracts — mandatory singleton for EventBus to work
  '@org/contracts': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
}
```

| Setting | Behavior | When to use |
|---|---|---|
| `strictVersion: false` | Different versions coexist (uses the host's) | RxJS, tslib, utility libs |
| `strictVersion: true` | Version mismatch = **runtime error** | Angular core, `@org/contracts` |
| `singleton: true` | Only **1 instance** in the browser | Everything with global state |

See [`SHARED_DEPS.md`](./SHARED_DEPS.md) for the full analysis.

---

### 4. Cross-MFE communication with `@org/contracts`

**Anti-pattern** (direct coupling):

```typescript
// ❌ NEVER do this in mfe-checkout
import { ProductsListComponent } from 'mfe-products/...'
```

**Correct pattern** (via contract):

```typescript
// ✅ mfe-checkout only knows @org/contracts
this.bus.on('PRODUCT_SELECTED').subscribe(event => {
  // event.payload is Product — full typing via discriminated union
});
```

The `EventBusService` is a **JS module singleton** — the `_instance` variable exists exactly once because `@org/contracts` is loaded exactly once by the browser (guaranteed by `singleton: true` in the shared config of all packages).

---

### 5. Per-route error boundary

```typescript
// packages/mfe-shell/src/app/app.routes.ts
{
  path: 'products',
  loadChildren: () =>
    loadRemoteModule('mfe-products', './Routes')
      .then(m => m.routes)
      .catch(() => [{ path: '**', component: RemoteErrorComponent }])
      //     ↑ remote offline → shows error page without breaking the shell
}
```

**Test it:** stop the `mfe-products` process and navigate to `/products` → `RemoteErrorComponent` renders. Other routes keep working.

---

## Package structure

```
mfe-starter-kit/
├── .github/workflows/
│   ├── ci-shell.yml       # build + deploy shell
│   ├── ci-products.yml    # build + deploy + update manifest
│   └── ci-checkout.yml
├── packages/
│   ├── mfe-contracts/     # @org/contracts — pure TypeScript
│   │   └── src/lib/
│   │       ├── events.ts             # MfeEvent discriminated union
│   │       ├── event-bus.service.ts  # Subject + on<K>() + getInstance()
│   │       └── models/               # Product, CartItem
│   ├── mfe-shell/
│   │   ├── federation.config.js      # host: documented shared deps
│   │   ├── public/                   # 3 manifests per environment
│   │   └── src/
│   │       ├── main.ts               # initFederation() → import('./bootstrap')
│   │       ├── environments/         # 3 environment files
│   │       └── app/
│   │           ├── app.routes.ts     # loadRemoteModule + error boundary
│   │           ├── core/tokens/      # EVENT_BUS InjectionToken
│   │           └── layout/           # ShellLayout, Header (badge), Footer
│   ├── mfe-products/
│   │   ├── federation.config.js      # remote: exposes './Routes'
│   │   └── src/app/products/         # ProductsList (emit), ProductCard
│   ├── mfe-checkout/
│   │   ├── federation.config.js      # remote: exposes './Routes'
│   │   └── src/app/checkout/         # CheckoutPage (subscribe), Cart
│   └── mfe-docs/
│       └── src/app/pages/            # Interactive documentation (:4203)
├── scripts/dev.js         # concurrently: contracts + 3 Angular apps
├── SHARED_DEPS.md         # full strictVersion trade-off analysis
└── CONTRIBUTING.md        # how to extract to a real polyrepo
```

---

## Adding a new remote

```bash
# 1. Scaffold the Angular project inside packages/
cd packages
ng new mfe-dashboard --routing --style=scss --standalone --skip-git

# 2. Add Native Federation as a remote on port 4204
cd mfe-dashboard
ng add @angular-architects/native-federation@^21 --type remote --port 4204

# 3. Copy the federation.config.js pattern from mfe-products
#    (replace name: 'mfe-products' with name: 'mfe-dashboard')
#    (replace './Routes' with the correct path)

# 4. Add @org/contracts to package.json and run npm install
#    "@org/contracts": "file:../mfe-contracts"

# 5. Add the entry to the dev manifest
#    packages/mfe-shell/public/federation.manifest.dev.json:
#    "mfe-dashboard": "http://localhost:4204/remoteEntry.json"

# 6. Add the route in the shell (packages/mfe-shell/src/app/app.routes.ts)
#    { path: 'dashboard', loadChildren: () => loadRemoteModule('mfe-dashboard', './Routes')... }

# 7. Add the process in scripts/dev.js

# 8. Create .github/workflows/ci-dashboard.yml
```

---

## Troubleshooting

| Symptom | Likely cause | Solution |
| --- | --- | --- |
| Console: "Angular loaded twice" or DI error | `singleton: true` missing in some package | Check `federation.config.js` for all packages — `@angular/core` must have `singleton: true` everywhere |
| Error boundary appears when loading a remote | Wrong URL in manifest or remote is offline | Check `public/federation.manifest.dev.json` and whether `npm run dev` is running |
| Header badge doesn't update / CART_UPDATED doesn't arrive | `@org/contracts` not in `shared` config | Add `'@org/contracts': { singleton: true, strictVersion: true }` to all `federation.config.js` |
| `Unsatisfied version constraint` error at runtime | Angular versions differ between shell and remote | Sync `@angular/*` in all packages' `package.json` to the same version |

---

## Roadmap

- [x] MVP: shell + 2 remotes + event bus
- [x] Cross-MFE communication via `@org/contracts`
- [x] Per-environment manifest (dev / staging / prod)
- [x] Per-route error boundary
- [x] Independent CI/CD per remote
- [x] Documentation app (`mfe-docs`)
- [ ] mfe-dashboard (third example remote)
- [ ] Integrated auth guard (JWT + interceptor in the shell)
- [ ] E2E tests with Playwright (shell loads real remotes)
- [ ] GitHub Packages publish pipeline for `@org/contracts`

---

## References

- [Native Federation for Angular](https://www.npmjs.com/package/@angular-architects/native-federation)
- [SHARED_DEPS.md](./SHARED_DEPS.md) — full `strictVersion` trade-off analysis
- [CONTRIBUTING.md](./CONTRIBUTING.md) — how to extract to a real polyrepo
- [Interactive documentation](http://localhost:4203) — `npm run docs`

---

## License

MIT © 2025 — GhabryelHenrique
