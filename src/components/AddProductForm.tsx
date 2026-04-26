"use client";

import { addProduct } from "@/actions/productActions";
import { useTransition } from "react";

export default function AddProductForm({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <form 
      action={(formData) => {
        startTransition(async () => {
          await addProduct(formData);
        });
      }} 
      className="space-y-5"
    >
      {/* حقل مخفي لتمرير معرف البائع */}
      <input type="hidden" name="sellerId" value={userId} />

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">اسم المنتج</label>
        <input 
          type="text" 
          name="title" 
          required 
          className="w-full border border-gray-300 p-2.5 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" 
          placeholder="مثال: هاتف آيفون 15 برو"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">الوصف</label>
        <textarea 
          name="description" 
          required
          rows={4}
          className="w-full border border-gray-300 p-2.5 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" 
          placeholder="اكتب وصفاً تفصيلياً للمنتج..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">السعر ($)</label>
          <input 
            type="number" 
            name="price" 
            step="0.01"
            required 
            className="w-full border border-gray-300 p-2.5 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="999.99"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">المخزون (الكمية)</label>
          <input 
            type="number" 
            name="stock" 
            required 
            defaultValue={1}
            className="w-full border border-gray-300 p-2.5 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" 
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">روابط الصور</label>
        <input 
          type="text" 
          name="images" 
          className="w-full border border-gray-300 p-2.5 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" 
          placeholder="ضع رابط الصورة، وافصل بين الصور بفاصلة (,)"
        />
        <p className="text-xs text-gray-400 mt-1">مثال: https://img1.jpg, https://img2.jpg</p>
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="w-full bg-green-600 text-white p-3 rounded-xl font-bold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "جاري إضافة المنتج..." : "إضافة المنتج 🚀"}
      </button>
    </form>
  );
}