import { connectToDB } from "@/lib/db";
import Link from "next/link";

export default async function Home() {
  await connectToDB();
  
  return (
    <main className="min-h-[calc(100vh-64px)] overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" dir="rtl">
      {/* Hero Section */}
      <div className="relative pt-20 pb-32 lg:pt-32 lg:pb-48 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        
        {/* Background decorative shapes */}
        <div className="absolute top-20 right-0 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob dark:opacity-10 dark:bg-blue-600"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 dark:opacity-10 dark:bg-purple-600"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 dark:opacity-10 dark:bg-pink-600"></div>

        {/* Text Content */}
        <div className="relative z-10 flex-1 text-center lg:text-right">
          <h1 className="text-5xl lg:text-7xl font-extrabold text-foreground tracking-tight mb-6">
            اكتشف أحدث <br />
            <span className="text-gradient">المنتجات الرائعة</span>
          </h1>
          <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            منصتك الأولى للتسوق الإلكتروني. تسوق من أفضل البائعين أو ابدأ متجرك الخاص بكل سهولة وسرعة، وتمتع بتجربة شراء لا تُنسى.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link 
              href="/products" 
              className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/30 transform transition hover:-translate-y-1"
            >
              تسوق الآن 🛍️
            </Link>
            <Link 
              href="/seller/change" 
              className="w-full sm:w-auto px-8 py-4 glass text-foreground rounded-2xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              كن بائعاً 🏪
            </Link>
          </div>
        </div>

        {/* Image/Visual Content */}
        <div className="relative z-10 flex-1 w-full max-w-lg lg:max-w-none">
          <div className="relative w-full aspect-square rounded-3xl overflow-hidden glass p-4 flex items-center justify-center animate-float shadow-2xl border border-white/40 dark:border-slate-700/50">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl -z-10"></div>
            {/* Visual placeholder since we don't have actual hero image */}
            <div className="text-center">
              <span className="text-9xl block mb-4">✨</span>
              <h3 className="text-2xl font-bold text-foreground">الجودة أولاً</h3>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}