// federation.config.js — Native Federation para mfe-products (REMOTE).
//
// Este é um REMOTE: EXPÕE módulos para o shell consumir.
// Não declara outros remotes (sem chave `remotes`).
//
// EXPONDO './Routes':
// Exponhamos o array de rotas ao invés de um único componente.
// Isso permite que o shell use um sub-router, habilitando deep links
// (ex: /products/123) dentro do remote.
//
// DEPENDÊNCIAS COMPARTILHADAS:
// Mesmo padrão do shell — veja shell/federation.config.js para o raciocínio.
// O remote DEVE compartilhar os mesmos pacotes com constraints compatíveis,
// caso contrário Native Federation carrega duas instâncias do Angular e
// quebra o DI system.
//
// @org/contracts NÃO é compartilhado automaticamente pelo shareAll porque
// é uma dependência `file:` — o nome de resolução não casa com o nome do
// pacote. Declaramos explicitamente.

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
  name: 'mfe-products',

  exposes: {
    // './Routes' mapeia para o array `routes` exportado.
    // O shell carrega via: loadRemoteModule('mfe-products', './Routes')
    './Routes': './src/app/app.routes.ts',
  },

  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: false,
      requiredVersion: 'auto',
    }),
    ...Object.fromEntries(
      ANGULAR_PACKAGES.map((pkg) => [
        pkg,
        { singleton: true, strictVersion: true, requiredVersion: 'auto' },
      ])
    ),
    '@org/contracts': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  },

  skip: ['rxjs/ajax', 'rxjs/fetch', 'rxjs/testing', 'rxjs/webSocket'],

  features: { ignoreUnusedDeps: true },
});
