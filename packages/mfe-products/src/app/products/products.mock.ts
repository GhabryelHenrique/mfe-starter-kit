// products.mock.ts — Dados mock para o catálogo de produtos.
// Em produção, substitua por uma chamada HttpClient à sua API.
// Tipado com Product de @org/contracts para garantir type safety
// entre o remote e qualquer consumidor (ex: mfe-checkout).

import { Product } from '@org/contracts';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Angular T-Shirt',
    description: 'Camiseta oficial da comunidade Angular. 100% algodão.',
    price: 29.99,
    imageUrl: 'https://placehold.co/280x280/dd0031/white?text=Angular',
    category: 'Vestuário',
    stock: 42,
  },
  {
    id: '2',
    name: 'RxJS Mug',
    description: 'Recipiente de combustível para programação reativa.',
    price: 14.99,
    imageUrl: 'https://placehold.co/280x280/e14ea8/white?text=RxJS',
    category: 'Acessórios',
    stock: 18,
  },
  {
    id: '3',
    name: 'Native Federation Hoodie',
    description: 'Fique aquecido enquanto seus módulos carregam em paralelo.',
    price: 49.99,
    imageUrl: 'https://placehold.co/280x280/1976d2/white?text=NF',
    category: 'Vestuário',
    stock: 7,
  },
  {
    id: '4',
    name: 'TypeScript Sticker Pack',
    description: 'Adesivos para seu laptop. Type safety nunca pareceu tão bom.',
    price: 9.99,
    imageUrl: 'https://placehold.co/280x280/3178c6/white?text=TS',
    category: 'Acessórios',
    stock: 99,
  },
];
