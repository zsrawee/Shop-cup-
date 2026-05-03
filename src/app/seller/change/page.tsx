import { auth } from "@/auth";
import { connectToDB } from "@/lib/db";
import { User } from "@/models/User";
import { redirect } from "next/navigation";
import SellerChangeForm from "@/components/SellerChangeForm";

export default async function SellerChangePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  await connectToDB();
  const user = await User.findOne({ email: session.user.email }).lean();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-6 text-center">إدارة رتبة البائع</h1>
        
        {/* نمرر الـ ID والدور الحالي من قاعدة البيانات */}
        <SellerChangeForm 
          currentRole={user.role} 
        />
      </div>
    </div>
  );
}