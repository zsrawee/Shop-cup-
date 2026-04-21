import { connectToDB } from "@/lib/db";
import {User} from "@/models/User";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { RegisterSchema } from "@/lib/validations";

export default function RegisterPage() {
  
  // دالة التعامل مع التسجيل (Server Action)
  async function handleRegister(formData: FormData) {
    "use server";

    // 1. تحويل البيانات وفحصها بـ Zod
    const data = Object.fromEntries(formData.entries());
    const result = RegisterSchema.safeParse(data);

    if (!result.success) {
      // إذا فشل الفحص (مثلاً الباسورد قصير)
      console.log("خطأ في المدخلات:", result.error.flatten().fieldErrors);
      return; 
    }

    const { name, email, password } = result.data;

    try {
      await connectToDB();

      // 2. التحقق من وجود المستخدم مسبقاً
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log("الإيميل مسجل مسبقاً");
        return;
      }

      // 3. تشفير كلمة المرور
      const hashedPassword = await bcrypt.hash(password, 10);


      // دالة تحويل الاسم لرابط (Slug)
// 1. تعريف الدالة بشكل كامل
const generateUsername = (name: string) => {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '') // إزالة المسافات
    .replace(/[^\w]/g, ''); // إزالة الرموز
}; // تأكد من إغلاق القوس هنا

// 2. الآن استدعاء الدالة واستخدامها (يجب أن يكون داخل handleRegister)
const baseUsername = generateUsername(name);

const isTaken = await User.findOne({ username: baseUsername });
const finalUsername = isTaken 
  ? `${baseUsername}${Math.floor(Math.random() * 1000)}` 
  : baseUsername;

// 3. الإنشاء الفعلي
await User.create({
  name,
  email,
  username: finalUsername,
  password: hashedPassword,
});

      console.log("✅ تم إنشاء الحساب بنجاح");

    } catch (error) {
      console.error("حدث خطأ أثناء التسجيل:", error);
      return;
    }

    // 5. التوجيه لصفحة تسجيل الدخول بعد النجاح
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 font-sans" dir="rtl">
      <form
        action={handleRegister}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl transition-all duration-300"
      >
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          إنشاء حساب جديد
        </h2>

        <div className="flex flex-col gap-5">
          {/* حقل الاسم */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600 mr-1">الاسم الكامل</label>
            <input
              name="name"
              type="text"
              placeholder="أدخل اسمك الثلاثي"
              className="w-full rounded-lg border border-gray-300 p-3 text-right text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>

          {/* حقل الإيميل */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600 mr-1">البريد الإلكتروني</label>
            <input
              name="email"
              type="email"
              placeholder="example@mail.com"
              className="w-full rounded-lg border border-gray-300 p-3 text-right text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>

          {/* حقل كلمة المرور */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600 mr-1">كلمة المرور</label>
            <input
              name="password"
              type="password"
              placeholder="********"
              className="w-full rounded-lg border border-gray-300 p-3 text-right text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              required
            />
            <p className="text-[10px] text-gray-400 mt-1">يجب أن تكون 8 رموز على الأقل</p>
          </div>

          {/* زر الإرسال */}
          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.98]"
          >
            إنشاء الحساب
          </button>
        </div>

        {/* رابط التوجيه */}
        <p className="mt-6 text-center text-sm text-gray-500">
          لديك حساب بالفعل؟{" "}
          <a href="/login" className="text-blue-600 font-bold hover:underline">
            تسجيل الدخول
          </a>
        </p>
      </form>
    </div>
  );
}