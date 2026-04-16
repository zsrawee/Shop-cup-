import { auth } from "@/auth";
import { connectToDB } from "@/lib/db";
import {User} from "@/models/User";
import { notFound } from "next/navigation";

export default async function PublicProfile({ params }: { params: { username: string } }) {
  const { username } = await params ; // نجلب الاسم من الرابط
 
  await connectToDB();
  
  // 1. نبحث عن المستخدم في القاعدة بناءً على الاسم في الرابط
  const userProfile = await User.findOne({ username: username });

  // إذا لم نجد المستخدم، نظهر صفحة 404
  if (!userProfile) {
    notFound();
  }

  // 2. نتحقق من الشخص "اللي فاتح المتصفح الآن" عبر الكوكيز
  const session = await auth();
  
  // هل الشخص اللي يشوف الصفحة هو نفسه صاحب البروفايل؟
  const isOwner = session?.user?.email === userProfile.email;

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center" dir="rtl">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
        
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-3xl text-white font-bold">
            {userProfile.name.charAt(0).toUpperCase()}
          </div>
          
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">{userProfile.name}</h1>
            <p className="text-gray-500">عضو منذ {new Date(userProfile.createdAt).toLocaleDateString('ar-EG')}</p>
          </div>

          {/* 3. لا يظهر هذا الزر إلا لصاحب الحساب فقط! */}
          {isOwner && (
            <button className="mr-auto bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition">
              تعديل البروفايل ✏️
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 bg-gray-50 rounded-2xl">
            <h3 className="text-sm text-gray-500 mb-1">البريد الإلكتروني (عام)</h3>
            <p className="font-medium">{userProfile.email}</p>
          </div>
          
          {/* هنا تضع ميزات الـ SaaS الخاصة بالمستخدم */}
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <p className="text-blue-700 text-sm">هذا الملف الشخصي متاح للعامة للزيارة.</p>
          </div>
        </div>

        {!isOwner && (
          <p className="mt-6 text-center text-sm text-gray-400">
            أنت تشاهد ملف {userProfile.name} كزائر.
          </p>
        )}
      </div>
    </div>
  );
}