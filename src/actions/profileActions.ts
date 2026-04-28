"use server";

import { connectToDB } from "@/lib/db";
import { User } from "@/models/User";
import { revalidatePath } from "next/cache";
import { deleteImageFromServer } from "./deleteImage"; // ✅ استيراد دالة الحذف

export async function changeName(userId: string, newName: string) {
  if (!newName || newName.trim() === "") throw new Error("الاسم مطلوب");
  await connectToDB();
  await User.findByIdAndUpdate(userId, { name: newName.trim() });
  revalidatePath("/profile"); // تحديث صفحات البروفايل
}

export async function changeDesc(userId: string, newDesc: string) {
  await connectToDB();
  // تحديث حقل الوصف داخل كائن sellerInfo
  await User.findByIdAndUpdate(userId, { "sellerInfo.description": newDesc.trim() });
  revalidatePath("/profile");
}
export async function changeImage(userId: string, newImageUrl: string) {
  await connectToDB();
  
  const user = await User.findById(userId);
  
  // ✅ إذا كان لديه صورة قديمة، احذفها من المجلد أولاً
  if (user.avatar && user.avatar.startsWith("/imag/")) {
    await deleteImageFromServer(user.avatar);
  }

  // ثم احفظ الرابط الجديد
  await User.findByIdAndUpdate(userId, { avatar: newImageUrl });
  revalidatePath("/profile");
}