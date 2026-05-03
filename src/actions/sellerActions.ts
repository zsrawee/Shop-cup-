"use server";

import { connectToDB } from "@/lib/db";
import { User } from "@/models/User";
import { Product } from "@/models/Product";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { deleteImageFromServer } from "./deleteImage";

// ترقية المستخدم إلى بائع
export async function becomeSeller() {
  const session = await auth();
  if (!session?.user?.email) return { error: "غير مصرح لك" };

  await connectToDB();
  const user = await User.findOne({ email: session.user.email });
  if (!user) return { error: "المستخدم غير موجود" };

  const updateData: any = { role: "seller" };
  
  if (!user.sellerInfo || !user.sellerInfo.storeName) {
    updateData.sellerInfo = {
      storeName: "متجري الجديد",
      description: "",
      isVerified: false,
      rating: 0,
    };
  }

  await User.findByIdAndUpdate(user._id, updateData);

  revalidatePath("/seller/change");
  revalidatePath("/profile");
  return { success: true };
}

// التخلي عن رتبة البائع (يتطلب كلمة المرور)
export async function abandonSellerRole(plainPassword: string) {
  const session = await auth();
  if (!session?.user?.email) return { error: "غير مصرح لك" };

  await connectToDB();

  const user = await User.findOne({ email: session.user.email });
  if (!user) return { error: "المستخدم غير موجود" };

  const isMatch = await bcrypt.compare(plainPassword, user.password);
  if (!isMatch) {
    return { error: "كلمة المرور غير صحيحة!" };
  }

  // ✅✅ الخطوة الجديدة: جلب كل منتجات البائع لحذف صورها أولاً
  const sellerProducts = await Product.find({ seller: user._id });
  
  for (const product of sellerProducts) {
    if (product.images && product.images.length > 0) {
      for (const imgUrl of product.images) {
        // حذف كل صورة من السيرفر
        await deleteImageFromServer(imgUrl);
      }
    }
  }

  // الآن نحذف المنتجات من قاعدة البيانات بعد تنظيف الصور
  await Product.deleteMany({ seller: user._id });

  // إعادة الدور إلى مستخدم عادي وحذف معلومات المتجر
  await User.findByIdAndUpdate(user._id, {
    role: "user",
    $unset: { sellerInfo: "" }, 
  });

  revalidatePath("/seller/change");
  revalidatePath("/profile");
  return { success: true };
}