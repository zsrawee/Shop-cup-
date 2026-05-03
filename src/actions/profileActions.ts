"use server";

import { connectToDB } from "@/lib/db";
import { User } from "@/models/User";
import { revalidatePath } from "next/cache";
import { deleteImageFromServer } from "./deleteImage";
import { auth } from "@/auth";

export async function changeName(newName: string) {
  if (!newName || newName.trim() === "") throw new Error("الاسم مطلوب");
  
  const session = await auth();
  if (!session?.user?.email) throw new Error("غير مصرح لك");
  
  await connectToDB();
  const user = await User.findOne({ email: session.user.email });
  if (!user) throw new Error("المستخدم غير موجود");

  await User.findByIdAndUpdate(user._id, { name: newName.trim() });
  revalidatePath("/profile"); // تحديث صفحات البروفايل
}

export async function changeDesc(newDesc: string) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("غير مصرح لك");

  await connectToDB();
  const user = await User.findOne({ email: session.user.email });
  if (!user) throw new Error("المستخدم غير موجود");

  // تحديث حقل الوصف داخل كائن sellerInfo
  await User.findByIdAndUpdate(user._id, { "sellerInfo.description": newDesc.trim() });
  revalidatePath("/profile");
}
export async function changeImage(newImageUrl: string) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("غير مصرح لك");

  await connectToDB();
  const user = await User.findOne({ email: session.user.email });
  if (!user) throw new Error("المستخدم غير موجود");
  
  // ✅ إذا كان لديه صورة قديمة، احذفها من المجلد أولاً
  if (user && user.avatar && user.avatar.startsWith("/imag/")) {
    await deleteImageFromServer(user.avatar);
  }

  // ثم احفظ الرابط الجديد
  await User.findByIdAndUpdate(user._id, { avatar: newImageUrl });
  revalidatePath("/profile");
}