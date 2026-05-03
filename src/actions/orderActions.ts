"use server";

import { auth } from "@/auth";
import { connectToDB } from "@/lib/db";
import { User } from "@/models/User";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createOrderAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("يجب تسجيل الدخول أولاً");

  const shippingAddress = formData.get("shippingAddress") as string;
  if (!shippingAddress || shippingAddress.trim() === "") {
    throw new Error("عنوان الشحن مطلوب");
  }

  await connectToDB();

  // 1. نجلب المستخدم مع منتجات السلة
  const user = await User.findOne({ email: session.user.email }).populate("cart.product");

  if (!user || user.cart.length === 0) {
    throw new Error("سلتك فارغة، لا يمكن إتمام الطلب");
  }

  // 2. نحسب الإجمالي ونجهز عناصر الطلب مع التحقق من المخزون
  let totalAmount = 0;
  const orderItems = [];

  for (const item of user.cart) {
    const product = item.product as any; // Cast populated product

    if (!product) {
      throw new Error("بعض المنتجات في سلتك محذوفة أو لم تعد متوفرة");
    }

    if (product.stock < item.quantity) {
      throw new Error(`الكمية المطلوبة من ${product.title} غير متوفرة في المخزون (${product.stock} المتاح فقط)`);
    }

    const itemPrice = product.price; 
    totalAmount += itemPrice * item.quantity;
    
    orderItems.push({
      product: product._id,
      quantity: item.quantity,
      price: itemPrice,
    });
  }

  // 3. إنشاء الطلب في قاعدة البيانات
  await Order.create({
    customer: user._id,
    items: orderItems,
    totalAmount,
    shippingAddress,
    status: 'pending', // قيد الانتظار
    paymentStatus: 'unpaid' // غير مدفوع (افتراض الدفع عند الاستلام)
  });

  // 4. تحديث المخزون (إنقاص الكمية المباعة)
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
  }

  // 5. تفريغ سلة المستخدم بعد الشراء
  user.cart = [];
  await user.save();

  // 6. تحديث الكاش وتوجيه المستخدم لصفحة الطلبات
  revalidatePath("/cart");
  revalidatePath("/orders");
  redirect("/orders");
}