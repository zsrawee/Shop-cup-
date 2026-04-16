import { z } from "zod";

// قواعد تسجيل حساب جديد
export const RegisterSchema = z.object({
  name: z.string().min(3, "الاسم يجب أن يكون 3 حروف على الأقل"),
  email: z.string().email("يرجى إدخال إيميل صحيح"),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 رموز على الأقل"),
});

// قواعد تسجيل الدخول
export const LoginSchema = z.object({
  email: z.string().email("إيميل غير صالح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});