// app/products/[id]/page.tsx

import { notFound } from 'next/navigation';

export default async function ProductPage({ params }) {
  // 1. فك تشفير الـ params (ضروري جداً)
  const resolvedParams = await params;
  const id = resolvedParams.id;

  let product;

  try {
    // 2. جلب البيانات من الـ API
    const res = await fetch(`https://fakestoreapi.com/products/${id}`);

    if (!res.ok) {
      return ; // إذا لم ينجح الطلب، اذهب لصفحة 404 بدلاً من كسر السيرفر
    }

    // 3. إضافة await هنا (هذا هو الخطأ الأساسي في كودك)
    product = await res.json();

    // إذا رجعت الـ API بيانات فارغة
    if (!product || Object.keys(product).length === 0) {
      return notFound();
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return notFound();
  }

  // الآن الكود سيعمل لأن product أصبح يحتوي على البيانات فعلياً
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Luxury Store
            </span>
          </h1>
          <p className="text-gray-400 italic">Where Elegance Meets Quality</p>
        </header>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-yellow-900 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-black rounded-2xl p-6 border border-yellow-800/30">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-96 object-contain rounded-xl transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-6 right-6 bg-gradient-to-r from-yellow-700 to-yellow-900 text-yellow-100 font-bold py-2 px-4 rounded-full shadow-lg">
                  <span className="text-2xl">${product.price}</span>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <div className="mb-4">
                  <span className="inline-block bg-yellow-900/30 text-yellow-400 text-sm font-semibold px-4 py-2 rounded-full border border-yellow-700/50">
                    {product.category}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                  <span className="bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                    {product.title}
                  </span>
                </h2>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-6 h-6 ${i < Math.floor(product.rating?.rate || 0) ? 'text-yellow-500' : 'text-gray-600'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-yellow-400 font-semibold">
                      {product.rating?.rate} <span className="text-gray-400">({product.rating?.count} reviews)</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-b from-gray-900/50 to-black/50 p-6 rounded-2xl border border-yellow-900/30">
                <h3 className="text-xl font-bold mb-4 text-yellow-300 flex items-center">
                  <span className="mr-2">ⓘ</span> Product Description
                </h3>
                <p className="text-gray-300 leading-relaxed text-lg">{product.description}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button className="flex-1 bg-gradient-to-r from-yellow-600 to-yellow-800 hover:from-yellow-700 hover:to-yellow-900 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-yellow-900/30">
                  Add to Cart
                </button>
                <button className="flex-1 bg-transparent hover:bg-yellow-900/20 text-yellow-400 font-bold py-4 px-6 rounded-xl border-2 border-yellow-700/50 transition-all duration-300 transform hover:scale-[1.02]">
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
