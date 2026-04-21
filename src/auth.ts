import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectToDB } from "@/lib/db";
import {User } from "@/models/User";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      async authorize(credentials) {
        await connectToDB();
        
        // 1. البحث عن المستخدم بالإيميل
        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("المستخدم غير موجود");

        // 2. التحقق من الباسورد (مقارنة المشفر)
        const isMatch = await bcrypt.compare(credentials.password as string, user.password);
        if (!isMatch) throw new Error("كلمة المرور خطأ");

        return user; // إذا كل شيء تمام، رجع بيانات المستخدم
      },
    }),
  ],callbacks: {
    async session({ session, token }) {
      // هنا نضيف الـ username للجلسة ليكون متاحاً في كل مكان
      if (token.username) {
        session.user.username = token.username as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      // عند أول تسجيل دخول، نأخذ الـ username من قاعدة البيانات ونضعه في الـ Token
      if (user) {
        token.username = user.username; 
      }
      return token;
    },
  },
  pages: {
    signIn: "/login", // الصفحة اللي بنسويها بعد شوي
  },
});