// federation.config.js — Native Federation para mfe-checkout (REMOTE).
//
// Mesmo padrão do mfe-products — veja mfe-products/federation.config.js
// para comentários detalhados sobre cada decisão.
//
// PONTO CHAVE deste remote:
// mfe-checkout ASSINA eventos de mfe-products via EventBus.
// Ele nunca importa nada de mfe-products diretamente.
// O contrato é @org/contracts — declarado como singleton compartilhado.

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
  name: 'mfe-checkout',

  exposes: {
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
