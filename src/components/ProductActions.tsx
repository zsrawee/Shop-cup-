"use client";

import { addToCartAction, toggleWishlistAction } from "@/actions/userActions";
import { useApp } from "@/context/AppContext";
import { useTransition } from "react";

export default function ProductActions({ productId }: { productId: string }) {
  const { setCartCount, setWishlistCount } = useApp();
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = () => {
    startTransition(async () => {
      const res = await addToCartAction(productId);
      if (res?.success) {
        setCartCount(res.newCartCount); // تحديث رقم السلة في النافبار فوراً
      }
    });
  };

  const handleToggleWishlist = () => {
    startTransition(async () => {
      const res = await toggleWishlistAction(productId);
      if (res?.success) {
        setWishlistCount(res.newWishlistCount); // تحديث رقم المفضلة في النافبار فوراً
      }
    });
  };

  return (
    <div className="flex gap-3 mt-4">
      <button 
        onClick={handleAddToCart} 
        disabled={isPending}
        className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isPending ? (
          <span className="animate-pulse">جاري الإضافة...</span>
        ) : (
          <>
            <span>أضف للسلة</span> 🛒
          </>
        )}
      </button>
      
      <button 
        onClick={handleToggleWishlist} 
        disabled={isPending}
        className="bg-red-50 text-red-500 p-3 rounded-xl hover:bg-red-100 transition disabled:opacity-50 border border-red-100"
        title="أضف للمفضلة"
      >
        ❤️
      </button>
    </div>
  );
}