"use client";
import { removeFromCartAction } from "@/actions/userActions";
import { useTransition } from "react";

export default function RemoveFromCartButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button 
      onClick={() => startTransition(async () => { await removeFromCartAction(productId); })} 
      disabled={isPending}
      className="text-red-500 hover:text-red-700 text-sm font-bold disabled:opacity-50"
    >
      {isPending ? "جاري..." : "حذف ❌"}
    </button>
  );
}
