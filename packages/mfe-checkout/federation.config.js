// federation.config.js — Native Federation for mfe-checkout (REMOTE).
//
// Same pattern as mfe-products — see mfe-products/federation.config.js
// for detailed comments on each decision.
//
// KEY POINT of this remote:
// mfe-checkout SUBSCRIBES to events from mfe-products via EventBus.
// It never imports anything from mfe-products directly.
// The contract is @org/contracts — declared as a shared singleton.

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
