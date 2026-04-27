"use server";

import { connectToDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { User } from "@/models/User";
import { redirect } from "next/navigation";

export async function addProduct(formData: FormData) {
  // 1. استخراج البيانات الأساسية من النموذج
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const sellerId = formData.get("sellerId") as string;

  // التحقق الأساسي
  if (!title || !price || !sellerId) {
    throw new Error("الاسم والسعر ومعلومات البائع مطلوبة");
  }

  // 2. ✅ استخراج الصور (التعديل الجديد)
  // نستخدم getAll لأننا نرسل عدة روابط بنفس الاسم "images" من الـ Client
  const images = formData.getAll("images") as string[];

  // 3. حفظ المنتج في قاعدة البيانات
  await connectToDB();
  
  await Product.create({
    title,
    description,
    price,
    stock,
    images, // يتم تمرير المصفوفة مباشرة ["https://...", "https://..."]
    seller: sellerId, 
  });

  // 4. جلب اسم المستخدم لتحويله لبروفايله بعد الإضافة
  const user = await User.findById(sellerId);
  
  if (user) {
    redirect(`/profile/${user.username}`);
  } else {
    redirect(`/`); 
  }
}