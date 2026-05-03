"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar({ 
  isLoggedIn, 
  username, 
  role 
}: { 
  isLoggedIn: boolean; 
  username: string; 
  role: string; 
}) {
  const { cartCount, wishlistCount } = useApp();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname();

  // ✅ روابط المتجر الأساسية (تظهر للجميع)
  const storeLinks = [
    { href: "/products", label: "المنتجات", icon: "🛍️" },
    { href: "/cart", label: "السلة", icon: "🛒", badge: cartCount },
    { href: "/orders", label: "طلباتي", icon: "📦" },
    { href: "/aaa", label: "teast", icon: "🅰️" }, // الرابط الإضافي
  ];

  // ✅ روابط المستخدم (تتغير بناءً على تسجيل الدخول والدور)
  const authLinks = isLoggedIn
    ? [
        { href: `/profile/${username}`, label: "البروفايل", icon: "👤" },
        { href: "/seller/change", label: "البائعين", icon: "🏪" },
        // يظهر رابط الأدمن فقط إذا كان الدور أدمن
        ...(role === 'admin' ? [{ href: "/admin", label: "لوحة التحكم", icon: "🛡️" }] : []),
      ]
    : [
        { href: "/login", label: "تسجيل الدخول", icon: "🔑" },
      ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16" dir="rtl">
          
          {/* اللوغو */}
          <Link href="/" className="text-xl font-extrabold text-blue-600">
            Shop-cup 🚀
          </Link>

          {/* روابط الكمبيوتر (مخفية في الجوال) */}
          <div className="hidden md:flex items-center gap-5">
            {storeLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-1 text-sm font-semibold transition ${
                  isActive(link.href) ? "text-blue-600" : "text-gray-600 hover:text-blue-500"
                }`}
              >
                <span>{link.icon}</span> {link.label}
                {/* شارة العدد (للسلة والمفضلة) */}
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="absolute -top-2 -left-3 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}

            {/* فاصل بين روابط المتجر وروابط المستخدم */}
            <div className="w-px h-6 bg-gray-200"></div>

            {/* روابط المستخدم (البروفايل/الدخول/الأدمن) */}
            {authLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1 text-sm font-semibold transition ${
                  isActive(link.href) ? "text-blue-600" : "text-gray-600 hover:text-blue-500"
                }`}
              >
                <span>{link.icon}</span> {link.label}
              </Link>
            ))}
          </div>

          {/* زر القائمة الجانبية (يظهر فقط في الجوال) */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="md:hidden text-gray-600 text-2xl"
          >
            ☰
          </button>
        </div>
      </div>

      {/* === القائمة الجانبية (Drawer) للجوال === */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden" dir="rtl">
          {/* خلفية معتمة */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsDrawerOpen(false)}></div>
          
          {/* محتوى القائمة المنزلقة من اليمين */}
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl p-6 flex flex-col gap-2 transform transition-transform duration-300">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h2 className="text-xl font-bold text-blue-600">القائمة</h2>
              <button onClick={() => setIsDrawerOpen(false)} className="text-2xl text-gray-500">✕</button>
            </div>
            
            {/* روابط المتجر في الجوال */}
            {storeLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsDrawerOpen(false)} // إغلاق القائمة عند الضغط
                className={`flex items-center gap-3 p-3 rounded-xl transition ${
                  isActive(link.href) ? "bg-blue-50 text-blue-600 font-bold" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="text-xl">{link.icon}</span>
                <span className="font-semibold">{link.label}</span>
                {/* شارة العدد في الجوال */}
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="mr-auto bg-red-500 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}

            {/* فاصل في الجوال */}
            <hr className="my-3"/>

            {/* روابط المستخدم في الجوال */}
            {authLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsDrawerOpen(false)} // إغلاق القائمة عند الضغط
                className={`flex items-center gap-3 p-3 rounded-xl transition ${
                  isActive(link.href) ? "bg-blue-50 text-blue-600 font-bold" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="text-xl">{link.icon}</span>
                <span className="font-semibold">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}