import Link from "next/link";
import Image from "next/image";

// تعريف نوع المنتج
interface Product {
  _id: { toString(): string } | string;
  title: string;
  price: number;
  images?: string[];
  averageRating?: number;
}


export function ProductCard({ product }: { product: any }) {
  return (
    // ✅ لفنا الكارد بالكامل برابط يودي لصفحة تفاصيل المنتج
    <Link href={`/products/${product._id.toString()}`} className="block">
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group h-full flex flex-col">
        {/* صورة المنتج */}
        <div className="w-full h-48 bg-gray-100 overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <img 
              src={product.images[0]} 
              alt={product.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
              📸
            </div>
          )}
        </div>
        
        {/* تفاصيل المنتج */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-bold text-gray-900 truncate mb-2">{product.title}</h3>
          <div className="mt-auto flex justify-between items-center">
            <span className="text-blue-600 font-extrabold text-lg">${product.price}</span>
            <div className="flex items-center gap-1 text-yellow-500 text-sm">
              <span>⭐</span>
              <span>{product.averageRating || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}


// ✅ مكون القائمة الذي يرتب المنتجات (الشبكة)
export default function ProductList({ products }: { products: Product[] }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        لا توجد منتجات حالياً.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product._id.toString()} product={product} />
      ))}
    </div>
  );
}