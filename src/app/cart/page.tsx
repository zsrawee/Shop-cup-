import { auth } from "@/auth";
import { connectToDB } from "@/lib/db";
import { User } from "@/models/User";
import { redirect } from "next/navigation";
import Link from "next/link";
import CartItemActions from "@/components/CartItemActions";

export default async function CartPage() {
  const session = await auth();
  
  // إذا لم يسجل الدخول، نوجهه لصفحة الدخول
  if (!session?.user?.email) {
    redirect("/login");
  }

  await connectToDB();

  // نجلب المستخدم، ونستخدم populate لجلب بيانات المنتجات داخل السلة
  const user = await User.findOne({ email: session.user.email })
    .populate("cart.product")
    .lean();

  if (!user) redirect("/login");

  // تصفية المنتجات المحذوفة (إذا كان منتج في السلة ولكن البائع حذفه من المتجر)
  const validCartItems = user.cart.filter((item: any) => item.product !== null);
  
  // حساب الإجمالي
  const totalAmount = validCartItems.reduce((acc: number, item: any) => {
    return acc + (item.product.price * item.quantity);
  }, 0);

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen" dir="rtl">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">سلة المشتريات 🛒</h1>

      {validCartItems.length === 0 ? (
        // حالة السلة الفارغة
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
          <p className="text-5xl mb-4">🛒</p>
          <p className="text-gray-500 text-lg mb-6">سلتك فارغة حالياً</p>
          <Link 
            href="/products" 
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
          >
            تصفح المنتجات 🛍️
          </Link>
        </div>
      ) : (
        // حالة وجود منتجات في السلة
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* قائمة المنتجات (العمود الأيمن) */}
          <div className="lg:col-span-2 space-y-4">
            {validCartItems.map((item: any) => (
              <div 
                key={item.product._id.toString()} 
                className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition"
              >
                {/* صورة المنتج */}
                <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                  <img 
                    src={item.product.images?.[0] || "/placeholder.png"} 
                    alt={item.product.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                
                {/* تفاصيل المنتج */}
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">{item.product.title}</h3>
                  <p className="text-blue-600 font-extrabold text-lg">${item.product.price}</p>
                  
                  {/* أزرار الكمية والحذف (Client Component) */}
                  <div className="mt-2">
                    <CartItemActions 
                      productId={item.product._id.toString()} 
                      quantity={item.quantity} 
                    />
                  </div>
                </div>

                {/* إجمالي سعر هذا المنتج (السعر × الكمية) */}
                <div className="text-left">
                  <p className="text-gray-400 text-xs">الإجمالي</p>
                  <p className="font-extrabold text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ملخص الطلب (العمود الأيسر) */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">ملخص الطلب</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>عدد المنتجات</span>
                  <span>{validCartItems.length}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>الإجمالي الفرعي</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>التوصيل</span>
                  <span className="text-green-600 font-semibold">مجاني</span>
                </div>
                <hr />
                <div className="flex justify-between font-extrabold text-xl text-gray-900">
                  <span>الإجمالي</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>        
            <Link 
              href="/checkout" 
              className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-md block text-center"
            >
              إتمام الشراء 💳
            </Link>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}