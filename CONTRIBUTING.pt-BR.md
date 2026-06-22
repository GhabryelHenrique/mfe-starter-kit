# Contributing

🇺🇸 [Read in English](./CONTRIBUTING.md)

## Estrutura do repositório

Este repo é um **polyrepo-in-a-monorepo**: um único repositório Git que contém quatro pacotes independentes em `packages/`. Em produção real, cada pacote vira seu próprio repositório Git + pipeline de CI/CD.

```
mfe-starter-kit/       ← este repo (meta-repo de referência)
├── packages/
│   ├── mfe-contracts/ ← poderia ser: github.com/sua-org/mfe-contracts
│   ├── mfe-shell/     ← poderia ser: github.com/sua-org/mfe-shell
│   ├── mfe-products/  ← poderia ser: github.com/sua-org/mfe-products
│   └── mfe-checkout/  ← poderia ser: github.com/sua-org/mfe-checkout
```

## Como extrair para polyrepo real

1. Crie 4 repositórios separados na sua org
2. Para cada pacote:
   ```bash
   cd packages/mfe-xxx
   git init
   git remote add origin https://github.com/sua-org/mfe-xxx.git
   git add .
   git commit -m "initial commit"
   git push -u origin main
   ```
3. Em cada `package.json` de Angular app, troque:
   ```json
   "@org/contracts": "file:../mfe-contracts"
   ```
   por:
   ```json
   "@org/contracts": "^1.0.0"
   ```
4. Configure `.npmrc` com seu GitHub Packages token
5. Cada repo usa seu próprio `ci-*.yml` (copie de `.github/workflows/`)

## Convenções

- **Commits:** Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`)
- **Branches:** `feat/nome-da-feature`, `fix/nome-do-bug`
- **Pull Requests:** Título em inglês, descrição em português é ok

## Rodando localmente

```bash
npm run install:all      # instala deps de todos os pacotes
npm run build:contracts  # compila @org/contracts primeiro
npm run dev              # inicia todos os 4 pacotes em paralelo
```

## Adicionando um novo remote

1. Gere o projeto Angular: `ng new mfe-nome --routing --style=scss`
2. Adicione native federation: `ng add @angular-architects/native-federation --type remote --port 4203`
3. Copie o padrão de `federation.config.js` do mfe-products
4. Adicione a entrada no `federation.manifest.dev.json` do shell
5. Adicione a rota em `packages/mfe-shell/src/app/app.routes.ts`
6. Adicione o processo no `scripts/dev.js`
7. Crie `.github/workflows/ci-nome.yml`
