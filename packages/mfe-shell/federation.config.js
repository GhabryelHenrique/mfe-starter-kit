// federation.config.js — Native Federation para o SHELL (host).
//
// O shell é um HOST: não expõe módulos (sem `exposes`).
// Apenas declara quais dependências compartilha com os remotes.
//
// ESTRATÉGIA DE SHARED DEPS:
// ─────────────────────────────────────────────────────────────────────────────
// shareAll()        → compartilha TUDO que está no package.json automaticamente.
//                     Opt out com o array `skip`.
//
// singleton: true   → Apenas UMA cópia da lib é carregada em TODOS os MFEs.
//                     OBRIGATÓRIO para Angular (zone.js, platform, router, DI
//                     system são globais — duas instâncias = bugs impossíveis
//                     de debugar em runtime).
//
// strictVersion: false (baseline) → Um remote com rxjs@7.8.1 pode usar o
//                     rxjs@7.8.0 do shell sem erro. Trade-off: perde garantia
//                     de versão em compilação.
//                     Ver SHARED_DEPS.md para análise completa.
//
// Angular override → strictVersion: true
//                     Angular DEVE ser exatamente o mesmo major.minor em todos
//                     os MFEs. Versões diferentes do Angular core causam falhas
//                     sutis de DI que são difíceis de diagnosticar.
//
// @org/contracts    → singleton: true + strictVersion: true
//                     O EventBusService usa um singleton de módulo JS.
//                     Sem singleton federation, cada MFE carrega sua própria
//                     instância de @org/contracts e o Subject não é compartilhado.

const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

const ANGULAR_PACKAGES = [
  '@angular/core',
  '@angular/common',
  '@angular/router',
  '@angular/forms',
  '@angular/platform-browser',
  '@angular/animations',
];

module.exports = withNativeFederation({
  // Host não tem `name` nem `exposes`.
  // Se quiser que o shell também atue como remote (padrão avançado),
  // adicione name: 'shell' e o mapa de exposes aqui.

  shared: {
    // Baseline: compartilha tudo, permite divergência de minor/patch.
    ...shareAll({
      singleton: true,
      strictVersion: false,
      requiredVersion: 'auto',
    }),

    // Pacotes Angular: strictVersion: true — DI system global, zero tolerância.
    // Este override sobrescreve o baseline acima para esses pacotes específicos.
    ...Object.fromEntries(
      ANGULAR_PACKAGES.map((pkg) => [
        pkg,
        { singleton: true, strictVersion: true, requiredVersion: 'auto' },
      ])
    ),

    // @org/contracts deve ser singleton para o EventBusService ser compartilhado.
    '@org/contracts': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  },

  skip: [
    // Sub-entrypoints do rxjs raramente usados em browser apps.
    // Remover reduz o tamanho do Import Map.
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket',
  ],

  features: {
    // Evita erros de build de dependências transitivas não usadas
    // (ex: pacotes Node.js-only puxados por algumas libs).
    ignoreUnusedDeps: true,
  },
});
