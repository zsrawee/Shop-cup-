"use client";

import { removeFromCartAction, updateCartQuantityAction } from "@/actions/userActions";
import { useApp } from "@/context/AppContext";
import { useTransition } from "react";

export default function CartItemActions({ productId, quantity }: { productId: string; quantity: number }) {
  const { setCartCount } = useApp();
  const [isPending, startTransition] = useTransition();

  const handleRemove = () => {
    startTransition(async () => {
      const res = await removeFromCartAction(productId);
      if (res?.success) {
        setCartCount(res.newCartCount); // تحديث رقم السلة في النافبار فوراً
      }
    });
  };

  const handleUpdateQty = (newQty: number) => {
    startTransition(async () => {
      const res = await updateCartQuantityAction(productId, newQty);
      if (res?.success && newQty < 1) {
        // إذا تم الحذف لأن الكمية وصلت لصفر
        setCartCount((res as any).newCartCount);
      }
    });
  };

  return (
    <div className="flex items-center gap-3">
      {/* أزرار الكمية */}
      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
        <button 
          onClick={() => handleUpdateQty(quantity - 1)} 
          className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold transition"
          disabled={isPending}
        >
          -
        </button>
        <span className="px-4 py-1 text-sm font-bold bg-white">{quantity}</span>
        <button 
          onClick={() => handleUpdateQty(quantity + 1)} 
          className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold transition"
          disabled={isPending}
        >
          +
        </button>
      </div>

      {/* زر الحذف */}
      <button 
        onClick={handleRemove} 
        disabled={isPending}
        className="text-red-500 hover:text-red-700 text-sm font-bold transition disabled:opacity-50"
      >
        {isPending ? "جاري..." : "حذف ❌"}
      </button>
    </div>
  );
}