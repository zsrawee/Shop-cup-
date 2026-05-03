import { auth } from "@/auth";
import { connectToDB } from "@/lib/db";
import { User } from "@/models/User";
import { redirect } from "next/navigation";
import TestingTools from "@/components/TestingTools";

export default async function TestingPage() {
  const session = await auth();
  
  // يجب أن تكون مسجل الدخول لتستخدم صفحة التجارب
  if (!session?.user?.email) redirect("/login");

  await connectToDB();
  const user = await User.findOne({ email: session.user.email }).lean();

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-yellow-400 mb-2">🛠️ صفحة التجارب (Sandbox)</h1>
          <p className="text-gray-400">استخدم هذه الأدوات لاختبار المشروع وتوليد البيانات.</p>
          <p className="text-red-500 text-sm font-bold mt-2">⚠️ تحذير: لا تستخدم هذه الصفحة في بيئة الإنتاج الحقيقية!</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl mb-8 border border-gray-800 shadow-xl">
          <h2 className="text-xl font-bold mb-4 text-gray-300">حالتك الحالية:</h2>
          <div className="flex gap-6 text-lg">
            <p>الاسم: <span className="text-blue-400 font-bold">{user?.name}</span></p>
            <p>الدور: <span className="text-yellow-400 font-bold">{user?.role}</span></p>
          </div>
        </div>

        {/* أزرار التجارب التفاعلية */}
        <TestingTools currentRole={user?.role || "user"} />

      </div>
    </div>
  );
}