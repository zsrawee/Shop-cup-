"use server";

import { auth } from "@/auth";
import { connectToDB } from "@/lib/db";
import { User } from "@/models/User";
import { revalidatePath } from "next/cache";

// أضف هذه الدالة في ملف actions/userActions.ts

export async function updateCartQuantityAction(productId: string, quantity: number) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("غير مصرح");

  if (quantity < 1) {
    // إذا الكمية أقل من 1، نحذف المنتج مباشرة
    return removeFromCartAction(productId);
  }

  await connectToDB();
  const user = await User.findOne({ email: session.user.email });
  if (!user) throw new Error("المستخدم غير موجود");

  const item = user.cart.find((item: any) => item.product.toString() === productId);
  if (item) {
    item.quantity = quantity;
    await user.save();
  }

  revalidatePath("/cart");
  return { success: true };
}

export async function addToCartAction(productId: string, quantity: number = 1) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("يجب تسجيل الدخول أولاً");

  await connectToDB();
  const user = await User.findOne({ email: session.user.email });
  if (!user) throw new Error("المستخدم غير موجود");

  const existingItem = user.cart.find((item: any) => item.product.toString() === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    // @ts-ignore
    user.cart.push({ product: productId, quantity });
  }

  await user.save();
  revalidatePath("/cart");
  
  // نرجع العدد الجديد ليستخدمه الـ Context
  return { success: true, newCartCount: user.cart.length }; 
}

export async function removeFromCartAction(productId: string) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("غير مصرح");

  await connectToDB();
  const user = await User.findOne({ email: session.user.email });
  if (!user) throw new Error("المستخدم غير موجود");
  
  user.cart = user.cart.filter((item: any) => item.product.toString() !== productId);
  await user.save();
  
  revalidatePath("/cart");
  return { success: true, newCartCount: user.cart.length };
}

export async function toggleWishlistAction(productId: string) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("يجب تسجيل الدخول أولاً");

  await connectToDB();
  const user = await User.findOne({ email: session.user.email });
  if (!user) throw new Error("المستخدم غير موجود");

  // @ts-ignore
  const index = user.wishlist.indexOf(productId);
  let isAdded = false;
  
  if (index > -1) {
    user.wishlist.splice(index, 1); 
  } else {
    // @ts-ignore
    user.wishlist.push(productId); 
    isAdded = true;
  }

  await user.save();
  revalidatePath("/favorites");
  
  // نرجع العدد الجديد وحالة الإضافة
  return { success: true, newWishlistCount: user.wishlist.length, isAdded }; 
}