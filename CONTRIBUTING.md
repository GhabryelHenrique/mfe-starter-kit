# Contributing

🇧🇷 [Leia em Português](./CONTRIBUTING.pt-BR.md)

## Repository structure

This repo is a **polyrepo-in-a-monorepo**: a single Git repository containing four independent packages under `packages/`. In real production, each package becomes its own Git repository with its own CI/CD pipeline.

```
mfe-starter-kit/       ← this repo (reference meta-repo)
├── packages/
│   ├── mfe-contracts/ ← could be: github.com/your-org/mfe-contracts
│   ├── mfe-shell/     ← could be: github.com/your-org/mfe-shell
│   ├── mfe-products/  ← could be: github.com/your-org/mfe-products
│   └── mfe-checkout/  ← could be: github.com/your-org/mfe-checkout
```

## How to extract to a real polyrepo

1. Create 4 separate repositories in your org
2. For each package:
   ```bash
   cd packages/mfe-xxx
   git init
   git remote add origin https://github.com/your-org/mfe-xxx.git
   git add .
   git commit -m "initial commit"
   git push -u origin main
   ```
3. In each Angular app's `package.json`, replace:
   ```json
   "@org/contracts": "file:../mfe-contracts"
   ```
   with:
   ```json
   "@org/contracts": "^1.0.0"
   ```
4. Set up `.npmrc` with your GitHub Packages token
5. Each repo uses its own `ci-*.yml` (copy from `.github/workflows/`)

## Conventions

- **Commits:** Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`)
- **Branches:** `feat/feature-name`, `fix/bug-name`
- **Pull Requests:** English title and description

## Running locally

```bash
npm run install:all      # install deps for all packages
npm run build:contracts  # build @org/contracts first
npm run dev              # start all 4 packages in parallel
```

## Adding a new remote

1. Generate the Angular project: `ng new mfe-name --routing --style=scss`
2. Add native federation: `ng add @angular-architects/native-federation --type remote --port 4203`
3. Copy the `federation.config.js` pattern from mfe-products
4. Add the entry to `federation.manifest.dev.json` in the shell
5. Add the route in `packages/mfe-shell/src/app/app.routes.ts`
6. Add the process in `scripts/dev.js`
7. Create `.github/workflows/ci-name.yml`
