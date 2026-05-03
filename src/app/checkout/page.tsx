import { auth } from "@/auth";
import { connectToDB } from "@/lib/db";
import { User } from "@/models/User";
import { redirect } from "next/navigation";
import Link from "next/link";
import CheckoutForm from "@/components/CheckoutForm";

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  await connectToDB();
  const user = await User.findOne({ email: session.user.email }).populate("cart.product").lean();

  if (!user || user.cart.length === 0) {
    redirect("/cart"); // إذا السلة فارغة ارجعه للسلة
  }

  // حساب الإجمالي
  const totalAmount = user.cart.reduce((acc: number, item: any) => {
    return acc + (item.product.price * item.quantity);
  }, 0);

  return (
    <div className="max-w-3xl mx-auto p-6 min-h-screen" dir="rtl">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">إتمام الشراء 💳</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* نموذج إدخال العنوان */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h2 className="text-xl font-bold mb-4">عنوان الشحن</h2>
          <CheckoutForm />
        </div>

        {/* ملخص الطلب */}
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 h-fit">
          <h2 className="text-xl font-bold mb-4">ملخص طلبك</h2>
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {user.cart.map((item: any) => (
              <div key={item.product._id.toString()} className="flex justify-between items-center text-sm">
                <span className="text-gray-700">{item.product.title} (x{item.quantity})</span>
                <span className="font-bold">${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <hr className="my-4"/>
          <div className="flex justify-between font-extrabold text-xl text-gray-900">
            <span>الإجمالي</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">الدفع عند الاستلام (COD)</p>
        </div>

      </div>
    </div>
  );
}