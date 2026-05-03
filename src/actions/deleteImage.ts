"use server";

import fs from "fs/promises";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

export async function deleteImageFromServer(imageUrl: string) {
  if (!imageUrl) return { success: false, message: "لا يوجد رابط" };

  try {
    // 1. إذا كانت الصورة من Cloudinary ☁️
    if (imageUrl.includes("cloudinary.com")) {
      const parts = imageUrl.split("/upload/");
      if (parts.length >= 2) {
        let pathPart = parts[1];
        if (pathPart.match(/^v\d+\//)) {
          pathPart = pathPart.replace(/^v\d+\//, "");
        }
        const publicId = pathPart.split(".")[0];
        
        await cloudinary.uploader.destroy(publicId);
        return { success: true };
      }
    }

    // 2. إذا كانت الصورة محلية (مسار قديم يبدأ بـ /imag/)
    if (imageUrl.startsWith("/imag/")) {
      const absolutePath = path.join(process.cwd(), "public", imageUrl);
      
      try {
        await fs.unlink(absolutePath);
        return { success: true };
      } catch (error: any) {
        if (error.code === "ENOENT") {
          return { success: true, message: "Цالصورة غير موجودة أصلاً" };
        }
        throw error;
      }
    }

    return { success: false, message: "رابط الصورة غير مدعوم" };
  } catch (error) {
    console.error("خطأ أثناء حذف الصورة:", error);
    return { success: false, message: "فشل حذف الصورة" };
  }
}