"use server";

import { connectToDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { User } from "@/models/User";
import { redirect } from "next/navigation";

export async function addProduct(formData: FormData) {
  // 1. استخراج البيانات من النموذج
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const imagesString = formData.get("images") as string;
  const sellerId = formData.get("sellerId") as string;

  // التحقق الأساسي
  if (!title || !price || !sellerId) {
    throw new Error("الاسم والسعر ومعلومات البائع مطلوبة");
  }

  // 2. تحويل نص روابط الصور إلى مصفوفة (Array)
  const images = imagesString 
    ? imagesString.split(",").map((img) => img.trim()).filter((img) => img !== "") 
    : [];

  // 3. الاتصال بقاعدة البيانات وحفظ المنتج
  await connectToDB();
  
  await Product.create({
    title,
    description,
    price,
    stock,
    images,
    seller: sellerId, // ✅ الربط بالبائع باستخدام الـ ID المخفي
  });

  // 4. جلب اسم المستخدم (username) لنوجهه لبروفايله مباشرة
  const user = await User.findById(sellerId);
  
  if (user) {
    redirect(`/profile/${user.username}`);
  } else {
    redirect(`/`); // احتياط
  }
}