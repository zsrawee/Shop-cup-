import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "لم يتم إرسال أي ملف" }, { status: 400 });
    }

    // تحويل الملف إلى Buffer لحفظه
    const buffer = Buffer.from(await file.arrayBuffer());

    // إنشاء اسم فريد للملف لمنع التكرار باستخدام الوقت
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + '-' + file.name.replace(/\s/g, '_');

    // تحديد المسار الفعلي داخل مجلد public/imag في المشروع
    const dirPath = path.join(process.cwd(), "public/imag");
    
    // التأكد من أن المجلد موجود، إذا لم يكن موجوداً يتم إنشاؤه
    await mkdir(dirPath, { recursive: true });

    const filePath = path.join(dirPath, filename);

    // حفظ الملف فعلياً في القرص الصلب
    await writeFile(filePath, buffer);

    // الرابط الذي سيتم حفظه في قاعدة البيانات وإرجاعه للواجهة
    const imageUrl = `/imag/${filename}`;

    return NextResponse.json({ url: imageUrl });

  } catch (error) {
    console.error("خطأ في رفع الملف:", error);
    return NextResponse.json({ error: "فشل حفظ الصورة" }, { status: 500 });
  }
}