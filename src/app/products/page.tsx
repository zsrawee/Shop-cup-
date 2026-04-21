// app/products/page.tsx
'use client';

import { useProducts } from '@/lib/api/products';

export default function ProductsPage() {
  const { data: products, isLoading, isError, error } = useProducts();

  // 1. Handle Loading State
  if (isLoading) {
    return <div>Loading products...</div>;
  }

  // 2. Handle Error State
  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  // 3. Handle Empty State
  if (!products || products.length === 0) {
    return <div>No products found.</div>;
  }

  // 4. Render Data
  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <h2>{product.title}</h2>
            <p>${product.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}