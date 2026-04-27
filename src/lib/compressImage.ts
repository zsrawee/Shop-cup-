import imageCompression from 'browser-image-compression';

export async function compressImage(imageFile: File): Promise<File> {
  const options = {
    maxSizeMB: 1, // أقصى حجم للصورة بعد الضغط (1 ميجابايت)
    maxWidthOrHeight: 1920, // أقصى عرض أو ارتفاع (بيصغر الصور الكبيرة)
    useWebWorker: true, // يستخدم خيط جانبي عشان ما يعلق المتصفح
  };

  try {
    const compressedFile = await imageCompression(imageFile, options);
    return compressedFile;
  } catch (error) {
    console.error("خطأ أثناء ضغط الصورة:", error);
    return imageFile; // إذا فشل الضغط، يرجع الصورة الأصلية
  }
}