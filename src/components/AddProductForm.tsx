"use client";

import { addProduct } from "@/actions/productActions";
import { compressImage } from "@/lib/compressImage";
import { uploadImageToCloud } from "@/lib/uploadImage";
import { useState, useTransition } from "react";

export default function AddProductForm({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition();
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]); // تخزين روابط الصور المرفوعة

  // ✅ دالة التعامل مع رفع عدة صور
  const handleImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImages(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        // 1. ضغط كل صورة
        const compressed = await compressImage(files[i]);
        // 2. رفعها للحفظ محلياً والحصول على الرابط (/imag/...)
        const url = await uploadImageToCloud(compressed);
        uploadedUrls.push(url);
      }
      setImageUrls(uploadedUrls); // حفظ الروابط لعرضها وإرسالها
    } catch (error) {
      alert("حدث خطأ أثناء رفع أحد الصور");
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handleSubmit = (formData: FormData) => {
    // إضافة الروابط المرفوعة للـ FormData ليستقبلها الـ Server Action
    imageUrls.forEach(url => formData.append("images", url));
    
    startTransition(async () => {
      await addProduct(formData);
    });
  };

  return (
    <form action={handleSubmit} className="space-y-5">
      {/* حقل مخفي لتمرير معرف البائع */}
      <input type="hidden" name="sellerId" value={userId} />

      {/* حقل اسم المنتج */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">اسم المنتج</label>
        <input 
          type="text" 
          name="title" 
          required 
          className="w-full border border-gray-300 p-2.5 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" 
          placeholder="مثال: هاتف آيفون 15 برو"
        />
      </div>

      {/* حقل الوصف */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">الوصف</label>
        <textarea 
          name="description" 
          required
          rows={4}
          className="w-full border border-gray-300 p-2.5 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" 
          placeholder="اكتب وصفاً تفصيلياً للمنتج..."
        />
      </div>

      {/* حقل السعر والمخزون */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">السعر ($)</label>
          <input 
            type="number" 
            name="price" 
            step="0.01"
            required 
            className="w-full border border-gray-300 p-2.5 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="999.99"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">المخزون (الكمية)</label>
          <input 
            type="number" 
            name="stock" 
            required 
            defaultValue={1}
            className="w-full border border-gray-300 p-2.5 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" 
          />
        </div>
      </div>

      {/* ✅ حقل رفع الصور الجديد */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">صور المنتج</label>
        <input 
          type="file" 
          accept="image/*"
          multiple
          onChange={handleImagesChange} 
          className="w-full border border-gray-300 p-2.5 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" 
          disabled={isUploadingImages}
        />
        {isUploadingImages && <p className="text-blue-600 text-xs mt-1 animate-pulse">جاري ضغط ورفع الصور، يرجى الانتظار...</p>}
        
        {/* معاينة الصور التي تم رفعها وحفظها في المجلد المحلي */}
        {imageUrls.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {imageUrls.map((url, idx) => (
              <img key={idx} src={url} alt={`product-${idx}`} className="w-20 h-20 object-cover rounded-lg border shadow-sm" />
            ))}
          </div>
        )}
      </div>

      {/* زر الإرسال */}
      <button 
        type="submit" 
        disabled={isPending || isUploadingImages} // منع الحفظ أثناء الرفع
        className="w-full bg-green-600 text-white p-3 rounded-xl font-bold hover:bg-green-700 transition disabled:opacity-50"
      >
        {isPending ? "جاري إضافة المنتج..." : "إضافة المنتج 🚀"}
      </button>
    </form>
  );
}