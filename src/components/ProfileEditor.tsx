"use client";

import { useState, useTransition } from "react";
import { changeName, changeDesc, changeImage } from "@/actions/profileActions";
import Link from "next/link";
export default function ProfileEditor({ user }: { user: any }) {
  const [isPending, startTransition] = useTransition();
  
  const [name, setName] = useState(user.name);
  const [desc, setDesc] = useState(user.sellerInfo?.description || "");
  const [avatar, setAvatar] = useState(user.avatar || "");
  
  const [editingField, setEditingField] = useState<string | null>(null);

  const handleSave = (action: (id: string, value: string) => Promise<void>, value: string) => {
    startTransition(async () => {
      await action(user._id.toString(), value);
      setEditingField(null);
    });
  };

  return (
    <div className="space-y-4 border-t pt-6 mt-6">
      <h3 className="text-lg font-bold text-gray-800">إعدادات الملف الشخصي</h3>

      {/* تعديل الصورة */}
      <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
        <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold overflow-hidden">
          {avatar ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" /> : name.charAt(0)}
        </div>
        {editingField === "image" ? (
          <div className="flex gap-2 flex-1">
            <input 
              type="text" 
              value={avatar} 
              onChange={(e) => setAvatar(e.target.value)} 
              placeholder="رابط الصورة الجديد" 
              // ⬇️ الحل هنا: إضافة خلفية بيضاء ولون خط غامق
              className="flex-1 border border-gray-300 p-2 rounded-lg text-sm bg-white text-gray-900 placeholder:text-gray-400"
            />
            <button onClick={() => handleSave(changeImage, avatar)} disabled={isPending} className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm">
              {isPending ? "جاري..." : "حفظ"}
            </button>
          </div>
        ) : (
          <button onClick={() => setEditingField("image")} className="text-blue-600 text-sm font-semibold mr-auto">تغيير الصورة 📷</button>
        )}
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
              // ⬇️ الحل هنا: إضافة خلفية بيضاء ولون خط غامق
              className="flex-1 border border-gray-300 p-2 rounded-lg text-sm bg-white text-gray-900 placeholder:text-gray-400"
            />
            <button onClick={() => handleSave(changeName, name)} disabled={isPending} className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm">
              {isPending ? "جاري..." : "حفظ"}
            </button>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <p className="font-medium">{name}</p>
            <button onClick={() => setEditingField("name")} className="text-blue-600 text-sm font-semibold">تعديل الاسم ✏️</button>
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
              // ⬇️ الحل هنا: إضافة خلفية بيضاء ولون خط غامق
              className="flex-1 border border-gray-300 p-2 rounded-lg text-sm bg-white text-gray-900 placeholder:text-gray-400"
              rows={2}
            />
            <button onClick={() => handleSave(changeDesc, desc)} disabled={isPending} className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm h-fit">
              {isPending ? "جاري..." : "حفظ"}
            </button>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <p className="text-gray-600 text-sm">{desc || "لا يوجد وصف بعد..."}</p>
            <button onClick={() => setEditingField("desc")} className="text-blue-600 text-sm font-semibold">تعديل الوصف 📝</button>
          </div>
        )}
      </div>
    </div>
  );
}