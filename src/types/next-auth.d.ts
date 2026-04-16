import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  // تعديل واجهة الجلسة (Session)
  interface Session {
    user: {
      username?: string | null
    } & DefaultSession["user"]
  }

  // تعديل واجهة المستخدم (User)
  interface User {
    username?: string | null
  }
}

declare module "next-auth/jwt" {
  // تعديل واجهة التوكن (JWT)
  interface JWT {
    username?: string | null
  }
}