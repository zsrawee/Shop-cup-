"use client";

import { createOrderAction } from "@/actions/orderActions";
import { useTransition } from "react";

export default function CheckoutForm() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      await createOrderAction(formData);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">العنوان بالتفصيل</label>
        <textarea 
          name="shippingAddress" 
          required
          rows={4}
          className="w-full border border-gray-300 p-3 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          placeholder="المدينة، الحي، الشارع، رقم المبنى..."
        ></textarea>
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isPending ? (
          <span className="animate-pulse">جاري تأكيد الطلب...</span>
        ) : (
          "تأكيد الطلب 🎉"
        )}
      </button>
    </form>
  );
}