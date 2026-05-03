"use server";

import fs from "fs/promises";
import path from "path";

export async function deleteImageFromServer(imageUrl: string) {
  // 1. تأكد أن الرابط يبدأ بـ /imag/ (إجراء أمني لمنع حذف ملفات النظام)
  if (!imageUrl || !imageUrl.startsWith("/imag/")) {
    console.log("تم تجاهل حذف الصورة: الرابط غير صالح أو خارج النطاق");
    return { success: false, message: "رابط الصورة غير صالح" };
  }

  try {
    // 2. تحويل الرابط النسبي إلى مسار فعلي على القرص
    const absolutePath = path.join(process.cwd(), "public", imageUrl);

    // 3. محاولة حذف الملف
    await fs.unlink(absolutePath);
    return { success: true };
  } catch (error: unknown) {
    // التحقق من وجود الخطأ "ENOENT" (الملف غير موجود)
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      console.warn("الصورة غير موجودة بالفعل:", imageUrl);
      return { success: true, message: "الصورة غير موجودة أصلاً" };
    }

    console.error("خطأ أثناء حذف الصورة:", error);
    return { success: false, message: "فشل حذف الصورة من السيرفر" };
  }
}