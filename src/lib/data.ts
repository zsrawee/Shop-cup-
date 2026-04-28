import { connectToDB } from "@/lib/db";
import { Product } from "@/models/Product";

export async function getSellerProducts(sellerId: string) {
  await connectToDB();
  
  // نجلب المنتجات ونرتبها من الأحدث للأقدم
  const products = await Product.find({ seller: sellerId })
    .sort({ createdAt: -1 })
    .lean(); // .lean() يحولها لكائنات JavaScript عادية لزيادة السرعة
    
  return products;
}