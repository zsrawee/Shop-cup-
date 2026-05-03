"use client";

import { useState, useTransition } from "react";
import { deleteProduct } from "@/actions/productActions";
import Link from "next/link";

export default function SellerDashboard({ user, products }: { user: any; products: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null); // لتخزين id المنتج المراد حذفه

  const handleDelete = () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      await deleteProduct(deleteTarget);
      setDeleteTarget(null); // إغلاق النافذة
    });
  };

  return (
    <div className="space-y-8" dir="rtl">
      
      {/* === رأس لوحة التحكم والترحيب === */}
      <div className="bg-gradient-to-l from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-3xl font-bold border-2 border-white/30 overflow-hidden">
              {user.avatar ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" /> : user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold">مرحباً، {user.name} 👋</h1>
              <p className="text-blue-200 mt-1">هنا مركز التحكم الخاص بمتجرك</p>
            </div>
          </div>
          <Link 
            href="/products/add" 
            className="bg-white text-blue-700 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition shadow-md flex items-center gap-2"
          >
            إضافة منتج جديد ➕
          </Link>
        </div>
      </div>

      {/* === بطاقات الإحصائيات === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">📦</div>
          <div>
            <p className="text-gray-500 text-sm">إجمالي المنتجات</p>
            <p className="text-2xl font-extrabold text-gray-900">{products.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">✅</div>
          <div>
            <p className="text-gray-500 text-sm">حالة المتجر</p>
            <p className="text-2xl font-extrabold text-green-600">{user.sellerInfo?.isVerified ? "موثوق" : "قيد المراجعة"}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-2xl">⭐</div>
          <div>
            <p className="text-gray-500 text-sm">تقييم المتجر</p>
            <p className="text-2xl font-extrabold text-gray-900">{user.sellerInfo?.rating || 0}</p>
          </div>
        </div>
      </div>

      {/* === شبكة المنتجات مع إمكانية الحذف === */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 border-r-4 border-blue-600 pr-3">منتجاتك</h2>
        
        {products.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500 text-lg mb-4">لم تقم بإضافة أي منتجات بعد</p>
            <Link href="/products/add" className="text-blue-600 font-bold hover:underline">ابدأ بإضافة منتجك الأول 🚀</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product._id.toString()} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-shadow group relative">
                
                {/* صورة المنتج */}
                <div className="w-full h-48 bg-gray-100 overflow-hidden">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">📸</div>
                  )}
                </div>

                {/* تفاصيل المنتج */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 truncate">{product.title}</h3>
                  <p className="text-blue-600 font-extrabold mt-1">${product.price}</p>
                  <div className="text-xs text-gray-400 mt-2">المخزون: {product.stock}</div>
                </div>

                {/* زر الحذف (يظهر عند تمرير الماوس أو بشكل دائم في الجوال) */}
                <button 
                  onClick={() => setDeleteTarget(product._id.toString())}
                  className="absolute top-3 left-3 bg-red-500/80 backdrop-blur-md text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="حذف المنتج"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* === نافذة تأكيد الحذف (Modal) === */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md text-center space-y-4">
            <div className="text-5xl">⚠️</div>
            <h3 className="text-xl font-bold text-gray-900">هل أنت متأكد من الحذف؟</h3>
            <p className="text-gray-500 text-sm">لا يمكنك التراجع عن هذا الإجراء. سيتم حذف المنتج وصوره نهائياً.</p>
            <div className="flex gap-3 pt-4">
              <button 
                onClick={() => setDeleteTarget(null)} 
                className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
              >
                إلغاء
              </button>
              <button 
                onClick={handleDelete} 
                disabled={isPending}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition disabled:opacity-50"
              >
                {isPending ? "جاري الحذف..." : "تأكيد الحذف"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}