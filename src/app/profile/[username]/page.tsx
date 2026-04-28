import { auth } from "@/auth";
import { connectToDB } from "@/lib/db";
import { User } from "@/models/User";
import { getSellerProducts } from "@/lib/data"; // ✅ دالة جلب المنتجات
import { notFound } from "next/navigation";
import Link from "next/link";
import ProfileEditor from "@/components/ProfileEditor"; // ✅ مكون التعديل
import ProductList from "@/components/ProductList"; // ✅ مكنون عرض المنتجات

export default async function PublicProfile({ params }: { params: { username: string } }) {
  // في إصدارات Next.js الحديثة، يجب استخراج الباراميتر بهذا الشكل
  const { username } = await params; 

  await connectToDB();
  
  // 1. نبحث عن المستخدم في القاعدة بناءً على الاسم في الرابط
  // نستخدم lean() لزيادة سرعة الاستعلام وتحويل الكائن لكائن عادي
  const userProfile = await User.findOne({ username }).lean();

  // إذا لم نجد المستخدم، نظهر صفحة 404
  if (!userProfile) {
    notFound();
  }

  // 2. نتحقق من الشخص "اللي فاتح المتصفح الآن" عبر الكوكيز
  const session = await auth();
  
  // هل الشخص اللي يشوف الصفحة هو نفسه صاحب البروفايل؟
  const isOwner = session?.user?.email === userProfile.email;

  // 3. جلب المنتجات إذا كان المستخدم بائعاً باستخدام الدالة المخصصة
  let sellerProducts = [];
  if (userProfile.role === 'seller') {
    sellerProducts = await getSellerProducts(userProfile._id.toString());
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center" dir="rtl">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
        
        {/* === قسم رأس الملف الشخصي === */}
        <div className="flex items-center gap-6 mb-6">
          {/* الصورة الرمزية أو الحرف الأول */}
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-3xl text-white font-bold overflow-hidden border-4 border-white shadow-md flex-shrink-0">
            {userProfile.avatar ? (
              <img src={userProfile.avatar} alt={userProfile.name} className="w-full h-full object-cover" />
            ) : (
              userProfile.name.charAt(0).toUpperCase()
            )}
          </div>
          
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">{userProfile.name}</h1>
            <p className="text-gray-500 text-sm">عضو منذ {new Date(userProfile.createdAt).toLocaleDateString('ar-EG')}</p>
            {/* شارة البائع */}
            {userProfile.role === 'seller' && (
              <span className="mt-1 inline-block bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                بائع موثوق {userProfile.sellerInfo?.isVerified ? '✅' : ''}
              </span>
            )}
          </div>
        </div>

        {/* === قسم معلومات المتجر (للبائع فقط) === */}
        {userProfile.role === 'seller' && (userProfile.sellerInfo?.storeName || userProfile.sellerInfo?.description) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {userProfile.sellerInfo?.storeName && (
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <h3 className="text-sm text-blue-500 mb-1">اسم المتجر</h3>
                <p className="font-bold text-blue-900">{userProfile.sellerInfo.storeName}</p>
              </div>
            )}
            {userProfile.sellerInfo?.description && (
              <div className="p-4 bg-gray-50 rounded-2xl md:col-span-2">
                <h3 className="text-sm text-gray-500 mb-1">نبذة عن المتجر</h3>
                <p className="text-gray-700 text-sm">{userProfile.sellerInfo.description}</p>
              </div>
            )}
          </div>
        )}

        {/* === أداة التعديل (تظهر فقط لصاحب الحساب) === */}
        {isOwner && (
          // نستخدم JSON.parse(JSON.stringify()) لأن كائنات Mongoose لا تُمرر مباشرة للـ Client Components
          <ProfileEditor user={JSON.parse(JSON.stringify(userProfile))} />
        )}

        {/* === قسم المنتجات (يظهر فقط إذا كان بائعاً) === */}
        {userProfile.role === 'seller' && (
          <div className="mt-8 border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">المنتجات ({sellerProducts.length})</h2>
              
              {/* زر إضافة منتج يظهر لصاحب المتجر فقط */}
              {isOwner && (
                <Link 
                  href="/product/add" 
                  className="text-sm bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
                >
                  إضافة منتج ➕
                </Link>
              )}
            </div>

            {/* التحقق من وجود منتجات */}
            {sellerProducts.length === 0 ? (
              // حالة المتجر الفارغ
              <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <div className="text-4xl mb-3">📦</div>
                <p className="text-gray-500 mb-5">لم يتم إضافة منتجات بعد</p>
                
                {/* رسالة تحفيزية لصاحب المتجر */}
                {isOwner && (
                  <Link 
                    href="/product/add" 
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition inline-block"
                  >
                    أضف منتجك الأول الآن 🚀
                  </Link>
                )}
              </div>
            ) : (
              // عرض المنتجات باستخدام المكون الجاهز
              <ProductList products={JSON.parse(JSON.stringify(sellerProducts))} />
            )}
          </div>
        )}

        {/* === رسالة للزائر === */}
        {!isOwner && userProfile.role !== 'seller' && (
          <p className="mt-6 text-center text-sm text-gray-400">
            أنت تشاهد ملف {userProfile.name} كزائر.
          </p>
        )}
      </div>
    </div>
  );
}