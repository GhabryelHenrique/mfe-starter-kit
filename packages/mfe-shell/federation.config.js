// federation.config.js — Native Federation for the SHELL (host).
//
// The shell is a HOST: it does not expose modules (no `exposes` key).
// It only declares which dependencies it shares with the remotes.
//
// SHARED DEPS STRATEGY:
// ─────────────────────────────────────────────────────────────────────────────
// shareAll()        → shares EVERYTHING in package.json automatically.
//                     Opt out with the `skip` array.
//
// singleton: true   → Only ONE copy of the lib is loaded across ALL MFEs.
//                     REQUIRED for Angular (zone.js, platform, router, DI
//                     system are global — two instances = impossible-to-debug
//                     runtime bugs).
//
// strictVersion: false (baseline) → A remote with rxjs@7.8.1 can use the
//                     shell's rxjs@7.8.0 without error. Trade-off: loses
//                     version guarantee at compile time.
//                     See SHARED_DEPS.md for full analysis.
//
// Angular override → strictVersion: true
//                     Angular MUST be the exact same major.minor across all
//                     MFEs. Different Angular core versions cause subtle DI
//                     failures that are hard to diagnose.
//
// @org/contracts    → singleton: true + strictVersion: true
//                     EventBusService uses a JS module singleton.
//                     Without federation singleton, each MFE loads its own
//                     instance of @org/contracts and the Subject is not shared.

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
  // Host has no `name` or `exposes`.
  // To make the shell also act as a remote (advanced pattern),
  // add name: 'shell' and the exposes map here.

  shared: {
    // Baseline: share everything, allow minor/patch divergence.
    ...shareAll({
      singleton: true,
      strictVersion: false,
      requiredVersion: 'auto',
    }),

    // Angular packages: strictVersion: true — global DI system, zero tolerance.
    // This override replaces the baseline above for these specific packages.
    ...Object.fromEntries(
      ANGULAR_PACKAGES.map((pkg) => [
        pkg,
        { singleton: true, strictVersion: true, requiredVersion: 'auto' },
      ])
    ),

    // @org/contracts must be singleton so EventBusService is shared.
    '@org/contracts': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  },

  skip: [
    // Rarely used rxjs sub-entrypoints in browser apps.
    // Removing them reduces the Import Map size.
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket',
  ],

  features: {
    // Avoids build errors from unused transitive dependencies
    // (e.g. Node.js-only packages pulled in by some libs).
    ignoreUnusedDeps: true,
  },
});
