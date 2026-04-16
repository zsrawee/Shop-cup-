import { signIn } from "@/auth";
import { LoginSchema } from "@/lib/validations";
import { AuthError } from "next-auth";

export default function LoginPage() {
  
  async function handleLogin(formData: FormData) {
    "use server";

    // 1. تحويل البيانات وفحصها بـ Zod
    const data = Object.fromEntries(formData.entries());
    const result = LoginSchema.safeParse(data);

    if (!result.success) {
      console.log("بيانات الدخول غير مكتملة");
      return;
    }

    const { email, password } = result.data;
    try {
      // 2. محاولة تسجيل الدخول باستخدام NextAuth
      // نستخدم "credentials" لأننا عرفناها في ملف auth.ts
      await signIn("credentials", {
        email,
        password,
        redirectTo: `/profile `, // الوجهة بعد النجاح
      });

    } catch (error) {
      // 3. معالجة الأخطاء (إذا كان الباسورد غلط أو المستخدم غير موجود)
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            console.log("الإيميل أو كلمة المرور غير صحيحة");
            return;
          default:
            console.log("حدث خطأ ما في تسجيل الدخول");
            return;
        }
      }
      
      // ملاحظة: Next.js يحتاج عمل throw للـ redirect خارج الـ try/catch
      throw error; 
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 font-sans" dir="rtl">
      <form
        action={handleLogin}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl transition-all duration-300"
      >
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          تسجيل الدخول
        </h2>

        <div className="flex flex-col gap-5">
          {/* البريد الإلكتروني */}
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

          {/* كلمة المرور */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600 mr-1">كلمة المرور</label>
            <input
              name="password"
              type="password"
              placeholder="********"
              className="w-full rounded-lg border border-gray-300 p-3 text-right text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>

          {/* زر الدخول */}
          <button
            type="submit"
            className="mt-2 w-full h-full rounded-lg bg-green-600 py-3 font-semibold text-green-900 transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 "
          >
            دخول
          </button>
        </div>

        {/* روابط إضافية */}
        <p className="mt-6 text-center text-sm text-gray-500">
          ليس لديك حساب؟{" "}
          <a href="/register" className="text-blue-600 font-bold hover:underline">
            أنشئ حساباً الآن
          </a>
        </p>
      </form>
    </div>
  );
}