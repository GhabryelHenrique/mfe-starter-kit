// federation.config.js — Native Federation for mfe-products (REMOTE).
//
// This is a REMOTE: it EXPOSES modules for the shell to consume.
// It does not declare other remotes (no `remotes` key).
//
// EXPOSING './Routes':
// We expose the routes array instead of a single component.
// This allows the shell to use a sub-router, enabling deep links
// (e.g. /products/123) within the remote.
//
// SHARED DEPENDENCIES:
// Same pattern as the shell — see shell/federation.config.js for the rationale.
// The remote MUST share the same packages with compatible constraints,
// otherwise Native Federation loads two Angular instances and breaks the DI system.
//
// @org/contracts is NOT shared automatically by shareAll because
// it is a `file:` dependency — the resolution name doesn't match the
// package name. We declare it explicitly.

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
    // './Routes' maps to the exported `routes` array.
    // The shell loads it via: loadRemoteModule('mfe-products', './Routes')
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
