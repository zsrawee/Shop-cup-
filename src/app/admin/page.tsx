import { auth } from "@/auth";
import { connectToDB } from "@/lib/db";
import { User } from "@/models/User";
import { redirect } from "next/navigation";
import AdminActionsForm from "@/components/AdminActionsForm";

export default async function AdminPage() {
  const session = await auth();

  // حماية الصفحة (إذا دخل شخص عادي للرابط يدوياً يطرده)
  if (!session?.user?.email) redirect("/login");
  
  await connectToDB();
  const user = await User.findOne({ email: session.user.email }).lean();

  if (!user || user.role !== "admin") {
    redirect("/"); // يرجعه للرئيسية إذا لم يكن أدمن
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">لوحة تحكم الأدمن 🛡️</h1>
          <p className="text-gray-500 mt-2">يمكنك إدارة النظام وحذف المحتوى المخالف من هنا.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">أدوات الحذف السريع</h2>
          <p className="text-gray-500 text-sm mb-6">
            قم بنسخ رابط البروفايل أو رابط المنتج من المتجر، والصقه هنا لحذفه فوراً.
          </p>
          
          <AdminActionsForm />
        </div>

      </div>
    </div>
  );
}