"use client";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  category?: string;

};

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();



 function goToPageProduct(id: number) {
    router.push(`/products/${id}`);
    }

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        const res = await fetch('https://fakestoreapi.com/products/');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data: Product[] = await res.json();
        setProducts(data);
        setLoading(false);
      } catch (err: any) {
        setError(err?.message || 'حدث خطأ أثناء جلب المنتجات');
        setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 ">المنتجات</h1>

      {loading && <p>جارِ التحميل...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && (
        <div className='products' >
          {products.map((p) => (
            <article key={p.id} onClick={() => goToPageProduct(p.id) } 
             className="bg-white/5 w-55 h-2/4 rounded-lg p-4 flex flex-col shadow-sm">
              <div className="h-48 w-48 flex items-center justify-center mb-4 bg-black/10 rounded">
                <img
                  src={p.image}
                  alt={p.title}
                  className="max-h-40 object-contain"
                  width={160}
                  height={160}
                  loading="lazy"
                />
              </div>

              <h2 className="text-lg font-semibold mb-2 line-clamp-2">{p.title}</h2>

              <p className="text-sm text-gray-300 mb-4 line-clamp-3">{p.description}</p>

              <div className="mt-auto flex items-center justify-between gap-4">
                <span className="text-xl font-bold text-[#d4af37]">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p.price)}</span>
                {p.category && <span className="text-sm text-gray-400 capitalize">{p.category}</span>}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
