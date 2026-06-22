# Estratégia de Dependências Compartilhadas

🇺🇸 [Read in English](./SHARED_DEPS.md)

## Por que compartilhar dependências em MFEs?

Em uma arquitetura de Microfrontends, cada remote é uma aplicação Angular construída separadamente. Sem compartilhamento, o navegador baixaria Angular core, RxJS e zone.js para CADA remote — facilmente 3x o payload de um monolito.

Native Federation resolve isso com um **Import Map**: pacotes compartilhados são baixados uma vez e reutilizados em todos os MFEs na mesma sessão do navegador.

---

## O Trade-off `strictVersion`

| Opção | Comportamento | Quando usar |
|---|---|---|
| `strictVersion: false` | Um remote construído com rxjs@7.8.1 pode usar o rxjs@7.8.0 do host | Libs utilitárias com APIs estáveis (rxjs, tslib, lodash) |
| `strictVersion: true` | Divergência de versão lança um erro em **RUNTIME** | Pacotes Angular — DI system é global e sensível à versão |

**Regra:** Use `strictVersion: true` apenas para pacotes onde rodar duas instâncias simultaneamente causaria bugs de correção, não apenas tamanho de bundle sub-ótimo.

### Exemplo de falha com `strictVersion: true`

```
Error: Unsatisfied version constraint for '@angular/core':
  Required: >=18.0.0 <19.0.0
  Found: 17.3.12
```

Isso acontece quando shell e remote têm versões incompatíveis de Angular. A solução é manter todos os MFEs no mesmo major.minor de Angular.

---

## Estratégia deste starter kit

```js
// federation.config.js — padrão aplicado em TODOS os pacotes
shared: {
  // Baseline: compartilha tudo, permite divergência de patch/minor
  ...shareAll({ singleton: true, strictVersion: false, requiredVersion: 'auto' }),

  // Override para Angular — DI global, zero tolerância a versões diferentes
  '@angular/core':             { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  '@angular/common':           { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  '@angular/router':           { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  '@angular/forms':            { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  '@angular/platform-browser': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  '@angular/animations':       { singleton: true, strictVersion: true, requiredVersion: 'auto' },

  // @org/contracts DEVE ser singleton para o EventBusService compartilhar o mesmo Subject
  '@org/contracts': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
}
```

---

## `@org/contracts` como singleton — por que é crítico

O `EventBusService` usa um singleton de módulo JS (`static getInstance()`). Para que o **mesmo** `Subject<MfeEvent>` seja compartilhado entre shell, mfe-products e mfe-checkout, o módulo `@org/contracts` deve ser carregado **uma única vez** pelo navegador.

Isso só acontece se `@org/contracts` estiver no mapa `shared` com `singleton: true`. Sem isso:

```
Shell            → carrega @org/contracts v1.0.0 → Subject A
mfe-products     → carrega @org/contracts v1.0.0 → Subject B (instância diferente!)
mfe-checkout     → carrega @org/contracts v1.0.0 → Subject C (instância diferente!)
```

`bus.emit(PRODUCT_SELECTED)` no mfe-products emite no Subject B. mfe-checkout assina o Subject C. **Nenhum evento chega.** Esse bug é silencioso e difícil de diagnosticar.

---

## `file:` vs GitHub Packages

Em desenvolvimento local, cada Angular app referencia contracts como:

```json
"@org/contracts": "file:../mfe-contracts"
```

Em produção (polyrepo real), cada repo publica e consome do registry:

```json
"@org/contracts": "^1.0.0"
```

Com `.npmrc`:
```
@org:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

A única mudança no código é esta linha no `package.json`. A configuração de federation permanece igual.

---

## Cache-busting do manifest em produção

O `federation.manifest.prod.json` é um arquivo pequeno que o shell busca em runtime. CDNs tendem a cachear arquivos sem extensão especial. Se o manifest for cacheado com TTL alto, um deploy de remote não será "visto" pelo shell por horas.

**Solução:** Configure `Cache-Control: no-cache` (ou TTL baixo) especificamente para `*.json` no seu CDN/servidor:

```nginx
location ~* \.json$ {
  add_header Cache-Control "no-cache, must-revalidate";
}
```

Ou no Netlify/Vercel, via headers config:
```toml
[[headers]]
  for = "/*.json"
  [headers.values]
    Cache-Control = "no-cache"
```
