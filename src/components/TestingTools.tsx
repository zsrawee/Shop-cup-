"use client";

import { useState, useTransition } from "react";
import { toggleAdminRole, seedProducts } from "@/actions/testingActions";

export default function TestingTools({ currentRole }: { currentRole: string }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const handleToggleAdmin = () => {
    setMessage("");
    startTransition(async () => {
      try {
        const res = await toggleAdminRole();
        setMessage(`✅ تم تغيير دورك إلى: ${res.newRole}. يرجى عمل Refresh (F5) للصفحة ليتحدث الـ Navbar.`);
      } catch (error: any) {
        setMessage(`❌ خطأ: ${error.message}`);
      }
    });
  };

  const handleSeed = (count: number) => {
    if (!confirm(`هل أنت متأكد من إنشاء ${count} منتج وهمي؟`)) return;
    setMessage("");
    startTransition(async () => {
      try {
        const res = await seedProducts(count);
        setMessage(`✅ تم إنشاء ${res.count} منتج بنجاح! تفقد صفحة المنتجات أو لوحة تحكم البائع.`);
      } catch (error: any) {
        setMessage(`❌ خطأ: ${error.message}`);
      }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* رسائل النجاح أو الخطأ */}
      {message && (
        <div className="bg-gray-800 border border-gray-700 text-gray-200 p-4 rounded-xl text-sm">
          {message}
        </div>
      )}

      {/* تبديل الأدمن */}
      <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
        <h3 className="text-lg font-bold mb-4 text-gray-300">تبديل صلاحيات الأدمن</h3>
        <button
          onClick={handleToggleAdmin}
          disabled={isPending}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 rounded-xl font-extrabold transition disabled:opacity-50"
        >
          {isPending ? "جاري التغيير..." : `تحويل إلى ${currentRole === 'admin' ? 'مستخدم عادي' : 'أدمن 🛡️'}`}
        </button>
      </div>

      {/* توليد المنتجات */}
      <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
        <h3 className="text-lg font-bold mb-4 text-gray-300">توليد منتجات وهمية (Seed Data)</h3>
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => handleSeed(10)}
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition disabled:opacity-50"
          >
            إنشاء 10 منتجات
          </button>
          <button
            onClick={() => handleSeed(100)}
            disabled={isPending}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition disabled:opacity-50"
          >
            إنشاء 100 منتج
          </button>
          <button
            onClick={() => handleSeed(1000)}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition disabled:opacity-50"
          >
            إنشاء 1000 منتج 🚀
          </button>
        </div>
      </div>

    </div>
  );
}