"use server";
// أضف هذا في أعلى الملف إذا لم يكن موجوداً
import { deleteImageFromServer } from "./deleteImage"; 
import { auth } from "@/auth";
import { connectToDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { User } from "@/models/User";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addProduct(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("غير مصرح لك");

  await connectToDB();
  const user = await User.findOne({ email: session.user.email });
  if (!user || (user.role !== "seller" && user.role !== "admin")) {
    throw new Error("يجب أن تكون بائعاً لإضافة منتجات");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);

  if (!title || isNaN(price)) {
    throw new Error("الاسم والسعر صحيح مطلوبين");
  }

  // 2. ✅ استخراج الصور (التعديل الجديد)
  // نستخدم getAll لأننا نرسل عدة روابط بنفس الاسم "images" من الـ Client
  const images = formData.getAll("images") as string[];

  // 3. حفظ المنتج في قاعدة البيانات
  await connectToDB();
  
  await Product.create({
    title,
    description,
    price,
    stock: isNaN(stock) ? 1 : stock,
    images,
    seller: user._id, 
  });

  redirect(`/profile/${user.username}`);
}


// ✅ دالة حذف منتج مع صوره
export async function deleteProduct(productId: string) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("غير مصرح لك");

  await connectToDB();

  // 1. نجلب المنتج للتأكد أنه يخص هذا البائع ولحذف صوره
  const product = await Product.findById(productId).populate("seller");
  
  if (!product) throw new Error("المنتج غير موجود");
  
  // أمان: نتأكد أن من يحذف هو صاحب المنتج نفسه
  if ((product.seller as any).email !== session.user.email) {
    throw new Error("لا يمكنك حذف منتج لا يخصك");
  }

  // 2. حذف الصور من السيرفر المحلي
  if (product.images && product.images.length > 0) {
    for (const imgUrl of product.images) {
      await deleteImageFromServer(imgUrl);
    }
  }

  // 3. حذف المنتج من قاعدة البيانات
  await Product.findByIdAndDelete(productId);

  // 4. تنظيف سلة ومفضلة المستخدمين
  await User.updateMany(
    {},
    { 
      $pull: { 
        cart: { product: productId }, 
        wishlist: productId 
      } 
    }
  );

  revalidatePath("/seller");
  revalidatePath("/profile");
  return { success: true };
}