"use server";

import { auth } from "@/auth";
import { connectToDB } from "@/lib/db";
import { User } from "@/models/User";
import { Product } from "@/models/Product";
import { deleteImageFromServer } from "./deleteImage";
import { revalidatePath } from "next/cache";

// دالة للتحقق أن المستخدم أدمن
async function checkAdmin() {
  const session = await auth();
  if (!session?.user?.email) throw new Error("غير مصرح لك، يجب تسجيل الدخول");
  
  await connectToDB();
  const user = await User.findOne({ email: session.user.email });
  if (!user || user.role !== "admin") throw new Error("غير مصرح لك، أنت لست أدمن!");
  
  return user;
}

// 1. حذف مستخدم عبر رابط البروفايل
export async function adminDeleteUser(url: string) {
  await checkAdmin(); // التحقق من الأدمن

  // استخراج الـ username من الرابط (مثال: /profile/ahmed123 -> ahmed123)
  const parts = url.split("/");
  const username = parts[parts.length - 1];

  if (!username) throw new Error("الرابط غير صحيح");

  const user = await User.findOne({ username });
  if (!user) throw new Error("المستخدم غير موجود في النظام");

  // 1. حذف جميع منتجات البائع (إذا كان بائعاً)
  const products = await Product.find({ seller: user._id });
  for (const product of products) {
    for (const img of product.images) {
      await deleteImageFromServer(img); // حذف صور المنتجات من السيرفر
    }
  }
  await Product.deleteMany({ seller: user._id });

  // 2. حذف صورة البروفايل
  if (user.avatar) await deleteImageFromServer(user.avatar);

  // 3. حذف المستخدم نفسه
  await User.findByIdAndDelete(user._id);

  revalidatePath("/admin");
  return { success: true, message: `تم حذف المستخدم ${username} وجميع منتجاته وصوره بنجاح` };
}

// 2. حذف منتج عبر رابط المنتج
export async function adminDeleteProduct(url: string) {
  await checkAdmin(); // التحقق من الأدمن

  // استخراج الـ ID من الرابط (مثال: /product/65ab... -> 65ab...)
  const parts = url.split("/");
  const productId = parts[parts.length - 1];

  if (!productId) throw new Error("الرابط غير صحيح");

  const product = await Product.findById(productId);
  if (!product) throw new Error("المنتج غير موجود");

  // 1. حذف صور المنتج من السيرفر
  for (const img of product.images) {
    await deleteImageFromServer(img);
  }

  // 2. حذف المنتج من قاعدة البيانات
  await Product.findByIdAndDelete(productId);

  // 3. إزالة المنتج من سلة ومفضلة جميع المستخدمين (تنظيف الداتابيز)
  await User.updateMany(
    {},
    { 
      $pull: { 
        cart: { product: productId }, 
        wishlist: productId 
      } 
    }
  );

  revalidatePath("/admin");
  return { success: true, message: `تم حذف المنتج وإزالته من سلال المستخدمين بنجاح` };
}