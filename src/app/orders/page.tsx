import { auth } from "@/auth";
import { connectToDB } from "@/lib/db";
import { User } from "@/models/User";
import { Order } from "@/models/Order";
import { redirect } from "next/navigation";
import Link from "next/link";

// ✅ دالة لتحويل حالة الطلب إلى نص عربي ولون مميز
const getStatusStyle = (status: string) => {
  switch (status) {
    case 'pending':
      return { text: 'قيد الانتظار', style: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: '⏳' };
    case 'processing':
      return { text: 'جاري التحضير', style: 'bg-blue-100 text-blue-800 border-blue-200', icon: '📦' };
    case 'shipped':
      // ✨ الحالة المطلوبة: قادم إليك
      return { text: 'قادم إليك', style: 'bg-green-100 text-green-800 border-green-300 ring-2 ring-green-400 ring-offset-1', icon: '🚚' };
    case 'delivered':
      return { text: 'تم التوصيل', style: 'bg-gray-100 text-gray-800 border-gray-200', icon: '✅' };
    case 'cancelled':
      return { text: 'ملغي', style: 'bg-red-100 text-red-800 border-red-200', icon: '❌' };
    default:
      return { text: 'غير معروف', style: 'bg-gray-100 text-gray-800 border-gray-200', icon: '❓' };
  }
};

export default async function OrdersPage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  await connectToDB();

  // 1. نجلب الـ ID الخاص بالمستخدم
  const user = await User.findOne({ email: session.user.email }).lean();
  if (!user) redirect("/login");

  // 2. نجلب جميع طلبات هذا المستخدم ونرتبها من الأحدث للأقدم
  // ونستخدم populate لجلب تفاصيل المنتجات داخل كل طلب
  const orders = await Order.find({ customer: user._id })
    .sort({ createdAt: -1 })
    .populate({
      path: "items",
      populate: {
        path: "product",
        model: "Product"
      }
    })
    .lean();

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen" dir="rtl">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">طلباتي 📦</h1>

      {orders.length === 0 ? (
        // حالة لا توجد طلبات
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
          <p className="text-5xl mb-4">🛍️</p>
          <p className="text-gray-500 text-lg mb-6">لم تقم بأي طلبات بعد</p>
          <Link 
            href="/products" 
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
          >
            تسوق الآن 🛒
          </Link>
        </div>
      ) : (
        // قائمة الطلبات
        <div className="space-y-6">
          {orders.map((order: any) => {
            const statusInfo = getStatusStyle(order.status);
            
            return (
              <div key={order._id.toString()} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                
                {/* رأس الطلب (التاريخ، الحالة، الإجمالي) */}
                <div className="bg-gray-50 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b">
                  <div>
                    <p className="text-sm text-gray-500">
                      تاريخ الطلب: {new Date(order.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      رقم الطلب: #{order._id.toString().substring(0, 8)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-extrabold text-gray-900">${order.totalAmount}</span>
                    {/* شارة حالة الطلب */}
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${statusInfo.style}`}>
                      <span>{statusInfo.icon}</span> {statusInfo.text}
                    </span>
                  </div>
                </div>

                {/* تفاصيل المنتجات داخل الطلب */}
                <div className="p-4 divide-y divide-gray-50">
                  {order.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-4 py-3">
                      {/* صورة المنتج */}
                      <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border">
                        {item.product && item.product.images?.[0] ? (
                          <img src={item.product.images[0]} alt={item.product?.title || "Product"} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">📸</div>
                        )}
                      </div>

                      {/* معلومات المنتج */}
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-sm">
                          {item.product ? item.product.title : "منتج لم يعد متوفراً"}
                        </h3>
                        <p className="text-gray-500 text-xs mt-1">الكمية: {item.quantity}</p>
                      </div>

                      {/* سعر المنتج وقت الشراء */}
                      <div className="text-left">
                        <p className="font-bold text-gray-800 text-sm">${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* عنوان الشحن (اختياري) */}
                {order.shippingAddress && (
                  <div className="px-4 pb-4">
                    <div className="bg-blue-50 p-3 rounded-xl text-xs text-blue-800 border border-blue-100">
                      📍 عنوان الشحن: {order.shippingAddress}
                    </div>
                  </div>
                )}

                {/* تنبيه خاص إذا كان الطلب "قادم إليك" */}
                {order.status === 'shipped' && (
                  <div className="bg-green-50 p-3 border-t border-green-100 text-center">
                    <p className="text-green-700 font-bold text-sm animate-pulse">🚚 طلبك في الطريق إليك! استعد لاستلامه.</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}