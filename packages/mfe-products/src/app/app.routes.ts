// app.routes.ts — EXPOSTO como './Routes' no federation.config.js.
// Este arquivo É a API pública deste remote.
//
// As rotas aqui são FILHAS — o shell monta este remote em '/products',
// portanto '' renderiza em '/products'.

import { Routes } from '@angular/router';
import { ProductsListComponent } from './products/products-list/products-list.component';

export const routes: Routes = [
  {
    path: '',
    component: ProductsListComponent,
    title: 'Produtos — MFE Starter Kit',
  },
];
