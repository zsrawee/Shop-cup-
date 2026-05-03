"use server";

import { auth } from "@/auth";
import { connectToDB } from "@/lib/db";
import { User } from "@/models/User";
import { Product } from "@/models/Product";
import { revalidatePath } from "next/cache";

// 1. دالة تبديل حالة الأدمن
export async function toggleAdminRole() {
  const session = await auth();
  if (!session?.user?.email) throw new Error("يجب تسجيل الدخول أولاً");

  await connectToDB();
  const user = await User.findOne({ email: session.user.email });
  if (!user) throw new Error("المستخدم غير موجود");

  // تبديل الدور
  user.role = user.role === "admin" ? "user" : "admin";
  
  // إذا أصبح أدمن، نتأكد أنه يملك صلاحيات بائع أيضاً ليتمكن من إضافة منتجات
  if (user.role === "admin" && !user.sellerInfo) {
    user.sellerInfo = {
      storeName: "متجر الأدمن التجريبي",
      description: "هذا حساب لتجربة النظام",
      isVerified: true,
      rating: 5
    };
  }

  await user.save();
  
  // تحديث الواجهة بالكامل ليتغير الـ Navbar
  revalidatePath("/", "layout"); 
  return { success: true, newRole: user.role };
}

// 2. دالة توليد منتجات وهمية
export async function seedProducts(count: number) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("يجب تسجيل الدخول أولاً");

  await connectToDB();
  const user = await User.findOne({ email: session.user.email });
  if (!user) throw new Error("المستخدم غير موجود");

  // نتأكد أن المستخدم بائع أو أدمن ليتم ربط المنتجات به
  if (user.role !== "seller" && user.role !== "admin") {
    user.role = "seller";
    user.sellerInfo = { storeName: "متجر تجريبي", description: "وصف المتجر", isVerified: true, rating: 4.5 };
    await user.save();
  }

  const products = [];
  
  // كلمات عربية لتوليد أسماء منتجات عشوائية ومتغيرة
  const adjectives = ["أسود", "أبيض", "جميل", "ممتاز", "سريع", "جديد", "مستعمل", "صغير", "كبير"];
  const nouns = ["لابتوب", "هاتف", "سماعات", "شاشة", "كيبورد", "ماوس", "طابعة", "كاميرا", "ساعة"];

  for (let i = 0; i < count; i++) {
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNum = Math.floor(Math.random() * 1000);

    products.push({
      title: `منتج ${randomAdj} ${randomNoun} ${randomNum}`,
      description: "هذا منتج تم إنشاؤه تلقائياً لاختبار أداء وتصميم المتجر. يمكنك حذفه من لوحة تحكم البائع أو الأدمن.",
      price: Math.floor(Math.random() * 500) + 10, // سعر بين 10 و 510
      stock: Math.floor(Math.random() * 100) + 1,
      seller: user._id,
      category: "تجربة",
      // صورة وهمية ثابتة من موقع placeholder
      images: [`https://via.placeholder.com/300x300/0ea5e9/ffffff?text=Product+${i+1}`]
    });
  }

  // إدخال المنتجات دفعة واحدة في الداتابيز (أسرع طريقة)
  await Product.insertMany(products);

  revalidatePath("/products");
  revalidatePath("/seller");
  return { success: true, count };
}