"use client";

import { adminDeleteUser, adminDeleteProduct } from "@/actions/adminActions";
import { useState, useTransition } from "react";

export default function AdminActionsForm() {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDeleteUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return alert("الرجاء إدخال الرابط");
    
    const confirmDelete = confirm("⚠️ هل أنت متأكد من حذف هذا المستخدم وجميع منتجاته وصوره؟ لا يمكن التراجع!");
    if (!confirmDelete) return;

    setMessage(null);
    startTransition(async () => {
      try {
        const res = await adminDeleteUser(url);
        setMessage({ type: 'success', text: res.message });
        setUrl("");
      } catch (error: any) {
        setMessage({ type: 'error', text: error.message });
      }
    });
  };

  const handleDeleteProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return alert("الرجاء إدخال الرابط");
    
    const confirmDelete = confirm("⚠️ هل أنت متأكد من حذف هذا المنتج وصوره من كل السلات؟ لا يمكن التراجع!");
    if (!confirmDelete) return;

    setMessage(null);
    startTransition(async () => {
      try {
        const res = await adminDeleteProduct(url);
        setMessage({ type: 'success', text: res.message });
        setUrl("");
      } catch (error: any) {
        setMessage({ type: 'error', text: error.message });
      }
    });
  };

  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">رابط البروفايل أو المنتج</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="مثال: https://mystore.com/profile/ahmed أو /product/65ab..."
          className="w-full border border-gray-300 p-3 rounded-xl bg-gray-50 text-gray-900 focus:ring-2 focus:ring-red-500 outline-none"
          required
        />
      </div>

      {/* رسائل النجاح أو الخطأ */}
      {message && (
        <div className={`p-4 rounded-xl text-sm font-semibold ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="flex gap-4 pt-2">
        <button
          type="button"
          onClick={handleDeleteUser}
          disabled={isPending}
          className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition disabled:opacity-50"
        >
          {isPending ? "جاري الحذف..." : "🗑️ حذف المستخدم"}
        </button>
        
        <button
          type="button"
          onClick={handleDeleteProduct}
          disabled={isPending}
          className="flex-1 bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition disabled:opacity-50"
        >
          {isPending ? "جاري الحذف..." : "🗑️ حذف المنتج"}
        </button>
      </div>
    </form>
  );
}