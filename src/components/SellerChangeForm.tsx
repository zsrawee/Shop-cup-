"use client";

import { useState, useTransition } from "react";
import { becomeSeller, abandonSellerRole } from "@/actions/sellerActions";
import Link from "next/link";

export default function SellerChangeForm({ userId, currentRole }: { userId: string; currentRole: string }) {
  const [isPending, startTransition] = useTransition();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isNowSeller, setIsNowSeller] = useState(false);

  // زر الترقية (بدون كلمة مرور)
  const handleBecomeSeller = () => {
    startTransition(async () => {
      const res = await becomeSeller(userId);
      if (res?.success) {
        setIsNowSeller(true); // نعرض رسالة التهنئة
      }
    });
  };

  // نموذج التخلي عن الرتبة (بكلمة مرور)
  const handleAbandonSeller = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    startTransition(async () => {
      const res = await abandonSellerRole(userId, password);
      if (res?.error) {
        setError(res.error);
      }
    });
  };

  // ✅ واجهة المستخدم العادي (زر واحد فقط بدون كلمة مرور)
  if (currentRole === "user" && !isNowSeller) {
    return (
      <div className="text-center py-10 bg-blue-50 rounded-2xl border border-blue-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">أريد أن أكون بائعاً</h2>
        <button 
          onClick={handleBecomeSeller} 
          disabled={isPending}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isPending ? "جاري الترقية..." : "ترقية حسابي لبائع 🚀"}
        </button>
      </div>
    );
  }

  // ✅ واجهة التهنئة (تظهر فور الترقية)
  if (currentRole === "seller" || isNowSeller) {
    return (
      <div className="space-y-8">
        {/* رسالة التهنئة وإضافة منتج */}
        <div className="text-center py-8 bg-green-50 rounded-2xl border border-green-100">
          <h2 className="text-2xl font-bold text-green-800 mb-2">🎉 تهانينا! أنت الآن بائع</h2>
          <p className="text-gray-600 mb-6">هل تريد إضافة منتجك الأول؟</p>
          <Link 
            href="/products/add" 
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition inline-block"
          >
            إضافة منتج ➕
          </Link>
        </div>

        {/* قسم التخلي عن الرتبة (هنا فقط نطلب كلمة المرور) */}
        <div className="text-center py-6 bg-red-50 rounded-2xl border border-red-200">
          <h3 className="text-lg font-bold text-red-800 mb-2">التخلي عن رتبة البائع</h3>
          <p className="text-red-600 text-sm mb-4">سيتم حذف جميع منتجاتك نهائياً.</p>
          
          <form onSubmit={handleAbandonSeller} className="max-w-xs mx-auto space-y-3">
            <input 
              type="password" 
              placeholder="أدخل كلمة المرور للتأكيد" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-red-300 p-2.5 rounded-xl bg-white text-gray-900 text-center focus:ring-2 focus:ring-red-500 outline-none" 
            />
            {error && <p className="text-red-700 text-xs font-bold">{error}</p>}
            <button 
              type="submit" 
              disabled={isPending}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-red-700 transition disabled:opacity-50 text-sm"
            >
              {isPending ? "جاري الحذف..." : "تأكيد التخلي عن الرتبة"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return null;
}