"use client";

import React, { useState, useTransition, ChangeEvent } from "react";
import { changeName, changeDesc, changeImage } from "@/actions/profileActions";
import { compressImage } from "@/lib/compressImage";
import { uploadImageToCloud } from "@/lib/uploadImage";

// تعريف نوع المستخدم (يجب أن يتطابق مع البيانات القادمة)
interface User {
  _id: { toString(): string } | string;
  name: string;
  avatar?: string | null;
  sellerInfo?: {
    description?: string;
  } | null;
}

// تعريف نوع دالة الإجراء
type ProfileAction = (id: string, value: string) => Promise<void>;

export default function ProfileEditor({ user }: { user: User }) {
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(user.name);
  const [desc, setDesc] = useState(user.sellerInfo?.description ?? "");
  const [avatar, setAvatar] = useState(user.avatar ?? "");
  const [isUploading, setIsUploading] = useState(false);

  const [editingField, setEditingField] = useState<string | null>(null);

  // ✅ دالة حفظ أي حقل (الاسم أو الوصف)
  const handleSave = (action: ProfileAction, value: string) => {
    startTransition(async () => {
      const userId = typeof user._id === "string" ? user._id : user._id.toString();
      await action(userId, value);
      setEditingField(null);
    });
  };

  // ✅ دالة رفع الصورة
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const compressedFile = await compressImage(file);
      const imageUrl = await uploadImageToCloud(compressedFile);
      setAvatar(imageUrl);
      const userId = typeof user._id === "string" ? user._id : user._id.toString();
      await changeImage(userId, imageUrl);
    } catch (error) {
      alert("حدث خطأ أثناء رفع الصورة");
    } finally {
      setIsUploading(false);
      setEditingField(null);
    }
  };

  return (
    <div className="space-y-4 border-t pt-6 mt-6">
      <h3 className="text-lg font-bold text-gray-800">إعدادات الملف الشخصي</h3>

      {/* تعديل الصورة */}
      <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
        <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold overflow-hidden">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            name.charAt(0)
          )}
        </div>

        <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
          {isUploading ? "جاري الضغط والرفع..." : "تغيير الصورة 📷"}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            disabled={isUploading}
          />
        </label>
      </div>

      {/* تعديل الاسم */}
      <div className="p-3 bg-gray-50 rounded-xl">
        {editingField === "name" ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="اكتب اسمك الجديد"
              className="flex-1 border border-gray-300 p-2 rounded-lg text-sm bg-white text-gray-900 placeholder:text-gray-400"
            />
            <button
              onClick={() => handleSave(changeName, name)}
              disabled={isPending}
              className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
            >
              {isPending ? "جاري..." : "حفظ"}
            </button>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <p className="font-medium">{name}</p>
            <button onClick={() => setEditingField("name")} className="text-blue-600 text-sm font-semibold">
              تعديل الاسم ✏️
            </button>
          </div>
        )}
      </div>

      {/* تعديل الوصف */}
      <div className="p-3 bg-gray-50 rounded-xl">
        {editingField === "desc" ? (
          <div className="flex gap-2">
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="اكتب وصفاً مختصراً عنك أو عن متجرك..."
              className="flex-1 border border-gray-300 p-2 rounded-lg text-sm bg-white text-gray-900 placeholder:text-gray-400"
              rows={2}
            />
            <button
              onClick={() => handleSave(changeDesc, desc)}
              disabled={isPending}
              className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm h-fit"
            >
              {isPending ? "جاري..." : "حفظ"}
            </button>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <p className="text-gray-600 text-sm">{desc || "لا يوجد وصف بعد..."}</p>
            <button onClick={() => setEditingField("desc")} className="text-blue-600 text-sm font-semibold">
              تعديل الوصف 📝
            </button>
          </div>
        )}
      </div>
    </div>
  );
}