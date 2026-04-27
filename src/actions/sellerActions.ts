"use server";

import { connectToDB } from "@/lib/db";
import { User } from "@/models/User";
import { Product } from "@/models/Product";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

// ترقية المستخدم إلى بائع
export async function becomeSeller(userId: string) {
  await connectToDB();

  await User.findByIdAndUpdate(userId, {
    role: "seller",
    sellerInfo: {
      storeName: "متجري الجديد",
      description: "",
      isVerified: false,
      rating: 0,
    },
  });

  revalidatePath("/seller/change");
  revalidatePath("/profile");
  return { success: true };
}

// التخلي عن رتبة البائع (يتطلب كلمة المرور)
export async function abandonSellerRole(userId: string, plainPassword: string) {
  await connectToDB();

  const user = await User.findById(userId);
  if (!user) return { error: "المستخدم غير موجود" };

  // التحقق من كلمة المرور
  const isMatch = await bcrypt.compare(plainPassword, user.password);
  if (!isMatch) {
    return { error: "كلمة المرور غير صحيحة!" };
  }

  // إعادة الدور إلى مستخدم عادي وحذف معلومات المتجر
  await User.findByIdAndUpdate(userId, {
    role: "user",
    $unset: { sellerInfo: "" }, 
  });

  // حذف جميع منتجات البائع من قاعدة البيانات
  await Product.deleteMany({ seller: userId });

  revalidatePath("/seller/change");
  revalidatePath("/profile");
  return { success: true };
}