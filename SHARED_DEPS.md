# Shared Dependencies Strategy

🇧🇷 [Leia em Português](./SHARED_DEPS.pt-BR.md)

## Why share dependencies in MFEs?

In a Microfrontend architecture, each remote is an Angular application built separately. Without sharing, the browser would download Angular core, RxJS, and zone.js for EACH remote — easily 3x the payload of a monolith.

Native Federation solves this with an **Import Map**: shared packages are downloaded once and reused across all MFEs in the same browser session.

---

## The `strictVersion` trade-off

| Option | Behavior | When to use |
|---|---|---|
| `strictVersion: false` | A remote built with rxjs@7.8.1 can use the host's rxjs@7.8.0 | Utility libs with stable APIs (rxjs, tslib, lodash) |
| `strictVersion: true` | Version mismatch throws an error at **RUNTIME** | Angular packages — DI system is global and version-sensitive |

**Rule:** Use `strictVersion: true` only for packages where running two instances simultaneously would cause correctness bugs, not just sub-optimal bundle size.

### Example failure with `strictVersion: true`

```
Error: Unsatisfied version constraint for '@angular/core':
  Required: >=18.0.0 <19.0.0
  Found: 17.3.12
```

This happens when the shell and a remote have incompatible Angular versions. The fix is to keep all MFEs on the same Angular major.minor.

---

## Strategy used in this starter kit

```js
// federation.config.js — pattern applied to ALL packages
shared: {
  // Baseline: share everything, allow patch/minor divergence
  ...shareAll({ singleton: true, strictVersion: false, requiredVersion: 'auto' }),

  // Override for Angular — global DI, zero tolerance for version differences
  '@angular/core':             { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  '@angular/common':           { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  '@angular/router':           { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  '@angular/forms':            { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  '@angular/platform-browser': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  '@angular/animations':       { singleton: true, strictVersion: true, requiredVersion: 'auto' },

  // @org/contracts MUST be singleton for EventBusService to share the same Subject
  '@org/contracts': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
}
```

---

## `@org/contracts` as singleton — why it's critical

`EventBusService` uses a JS module singleton (`static getInstance()`). For the **same** `Subject<MfeEvent>` to be shared among the shell, mfe-products, and mfe-checkout, the `@org/contracts` module must be loaded **exactly once** by the browser.

This only happens if `@org/contracts` is in the `shared` map with `singleton: true`. Without it:

```
shell        → loads @org/contracts v1.0.0 → Subject A
mfe-products → loads @org/contracts v1.0.0 → Subject B (different instance!)
mfe-checkout → loads @org/contracts v1.0.0 → Subject C (different instance!)
```

`bus.emit(PRODUCT_SELECTED)` in mfe-products emits on Subject B. mfe-checkout subscribes to Subject C. **No event arrives.** This bug is silent and hard to diagnose.

---

## `file:` vs GitHub Packages

In local development, each Angular app references contracts as:

```json
"@org/contracts": "file:../mfe-contracts"
```

In production (real polyrepo), each repo publishes and consumes from the registry:

```json
"@org/contracts": "^1.0.0"
```

With `.npmrc`:
```
@org:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

The only change in the code is this one line in `package.json`. The federation configuration remains identical.

---

## Manifest cache-busting in production

`federation.manifest.prod.json` is a small file the shell fetches at runtime. CDNs tend to cache files without special extensions. If the manifest is cached with a high TTL, a remote deploy won't be "seen" by the shell for hours.

**Solution:** Configure `Cache-Control: no-cache` (or a low TTL) specifically for `*.json` on your CDN/server:

```nginx
location ~* \.json$ {
  add_header Cache-Control "no-cache, must-revalidate";
}
```

Or on Netlify/Vercel, via headers config:
```toml
[[headers]]
  for = "/*.json"
  [headers.values]
    Cache-Control = "no-cache"
```
