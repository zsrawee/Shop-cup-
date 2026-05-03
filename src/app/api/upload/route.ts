import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "لم يتم إرسال أي ملف" }, { status: 400 });
    }

    // تحويل الملف إلى Buffer لحفظه
    const buffer = Buffer.from(await file.arrayBuffer());

    // الرفع عبر Stream إلى Cloudinary
    const imageUrl = await new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "shop_cup" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result!.secure_url);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({ url: imageUrl });

  } catch (error) {
    console.error("خطأ في رفع الملف:", error);
    return NextResponse.json({ error: "فشل حفظ الصورة" }, { status: 500 });
  }
}