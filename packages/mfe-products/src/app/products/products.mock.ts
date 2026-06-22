// products.mock.ts — Mock data for the product catalog.
// In production, replace with an HttpClient call to your API.
// Typed with Product from @org/contracts to ensure type safety
// between the remote and any consumer (e.g. mfe-checkout).

import { Product } from '@org/contracts';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Angular T-Shirt',
    description: 'Official Angular community shirt. 100% cotton.',
    price: 29.99,
    imageUrl: 'https://placehold.co/280x280/dd0031/white?text=Angular',
    category: 'Apparel',
    stock: 42,
  },
  {
    id: '2',
    name: 'RxJS Mug',
    description: 'Fuel container for reactive programming.',
    price: 14.99,
    imageUrl: 'https://placehold.co/280x280/e14ea8/white?text=RxJS',
    category: 'Accessories',
    stock: 18,
  },
  {
    id: '3',
    name: 'Native Federation Hoodie',
    description: 'Stay warm while your modules load in parallel.',
    price: 49.99,
    imageUrl: 'https://placehold.co/280x280/1976d2/white?text=NF',
    category: 'Apparel',
    stock: 7,
  },
  {
    id: '4',
    name: 'TypeScript Sticker Pack',
    description: 'Stickers for your laptop. Type safety never looked so good.',
    price: 9.99,
    imageUrl: 'https://placehold.co/280x280/3178c6/white?text=TS',
    category: 'Accessories',
    stock: 99,
  },
];
