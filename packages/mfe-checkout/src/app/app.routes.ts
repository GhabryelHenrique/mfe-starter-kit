// app.routes.ts — EXPOSTO como './Routes' no federation.config.js.
// Este arquivo É a API pública deste remote.

import { Routes } from '@angular/router';
import { CheckoutPageComponent } from './checkout/checkout-page/checkout-page.component';

export const routes: Routes = [
  {
    path: '',
    component: CheckoutPageComponent,
    title: 'Checkout — MFE Starter Kit',
  },
];
