import { connectToDB } from "@/lib/db";
import { Product } from "@/models/Product";
import Link from "next/link";
import { ProductCard } from "@/components/ProductList"; // نستخدم الكارد اللي سويناه

// دالة لإنشاء أزرار أرقام الصفحات
function PaginationButtons({ currentPage, totalPages, searchQuery }: { currentPage: number, totalPages: number, searchQuery: string }) {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-10">
      {currentPage > 1 && (
        <Link 
          href={`/products?page=${currentPage - 1}&search=${searchQuery}`}
          className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
        >
          السابق
        </Link>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={`/products?page=${page}&search=${searchQuery}`}
          className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition ${
            page === currentPage 
              ? "bg-blue-600 text-white shadow-md" 
              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link 
          href={`/products?page=${currentPage + 1}&search=${searchQuery}`}
          className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
        >
          التالي
        </Link>
      )}
    </div>
  );
}

export default async function ProductsPage({
  searchParams, 
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  // 1. قراءة رقم الصفحة وكلمة البحث من الرابط (URL)
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const search = params?.search || "";
  const limit = 20; // عدد المنتجات في كل صفحة

  await connectToDB();

  // 2. بناء شرط البحث (Query)
  // إذا كان هناك كلمة بحث، نبحث في اسم المنتج (بشكل غير حساس لحالة الأحرف)
  const query: any = {};
  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  // 3. جلب العدد الإجمالي للمنتجات (لحساب عدد الصفحات)
  const totalProducts = await Product.countDocuments(query);
  const totalPages = Math.ceil(totalProducts / limit);

  // 4. جلب المنتجات الخاصة بالصفحة الحالية
  const products = await Product.find(query)
    .sort({ createdAt: -1 }) // الأحدث أولاً
    .skip((page - 1) * limit) // تخطي المنتجات السابقة
    .limit(limit) // أخذ 20 منتج فقط
    .lean();

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen" dir="rtl">
      
      {/* === رأس الصفحة وشريط البحث === */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">جميع المنتجات 🛍️</h1>
          <p className="text-gray-500 text-sm mt-1">
            {totalProducts} منتج {search && `نتائج البحث عن "${search}"`}
          </p>
        </div>

        {/* شريط البحث */}
        {/* باستخدام Form بسيط، عند الضغط على Enter سيقوم بتحديث الرابط وإرسال كلمة البحث */}
        <form action="/products" method="GET" className="w-full md:w-96 flex gap-2">
          <input
            type="text"
            name="search" // ⚠️ الاسم يجب أن يكون search ليتوافق مع searchParams
            defaultValue={search} // للحفاظ على كلمة البحث في الحقل
            placeholder="ابحث عن منتج..."
            className="flex-1 border border-gray-300 p-3 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
          >
            بحث 🔍
          </button>
        </form>
      </div>

      {/* === شبكة المنتجات === */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
          <p className="text-5xl mb-4">🤷‍♂️</p>
          <p className="text-gray-500 text-lg">لا توجد منتجات تطابق بحثك</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            // نستخدم ProductCard الذي ربطناه بالـ Dynamic Route سابقاً
            <ProductCard key={product._id.toString()} product={product} />
          ))}
        </div>
      )}

      {/* === أزرار التنقل بين الصفحات (Pagination) === */}
      {totalPages > 1 && (
        <PaginationButtons 
          currentPage={page} 
          totalPages={totalPages} 
          searchQuery={search} 
        />
      )}
    </div>
  );
}