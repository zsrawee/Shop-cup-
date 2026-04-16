import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  // إذا سجل دخول، نرسله لبروفايله فوراً
  if (session?.user) {
    // يفضل استخدام الـ username المخزن في القاعدة
    redirect(`/profile/${session.user.username}`);
  }

  // إذا لم يسجل دخول، نعرض له صفحة ترحيبية بدلاً من الخطأ
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">مرحباً بك في منصتنا 🚀</h1>
      <p className="text-gray-600 mb-8 text-lg">أنت لست مسجل دخول حالياً، انضم إلينا الآن.</p>
      
      <div className="flex gap-4">
        <Link href="/login" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
          تسجيل الدخول
        </Link>
        <Link href="/register" className="bg-white border border-gray-200 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition">
          إنشاء حساب
        </Link>
      </div>
    </div>
  );
}