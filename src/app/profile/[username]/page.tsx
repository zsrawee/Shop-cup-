import { auth } from "@/auth";
import { connectToDB } from "@/lib/db";
import { User } from "@/models/User";
import { getSellerProducts } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProfileEditor from "@/components/ProfileEditor";
import ProductList from "@/components/ProductList";

export default async function PublicProfile({ params }: { params: { username: string } }) {
  const { username } = await params; 

  await connectToDB();
  
  const userProfile = await User.findOne({ username }).lean();

  if (!userProfile) {
    notFound();
  }

  const session = await auth();
  const isOwner = session?.user?.email === userProfile.email;

  let sellerProducts: any[] = [];
  if (userProfile.role === 'seller') {
    sellerProducts = await getSellerProducts(userProfile._id.toString());
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center" dir="rtl">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
        
        {/* === قسم رأس الملف الشخصي === */}
        <div className="flex items-center gap-6 mb-6">
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
            {userProfile.role === 'seller' && (
              <span className="mt-1 inline-block bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                بائع موثوق {userProfile.sellerInfo?.isVerified ? '✅' : ''}
              </span>
            )}
          </div>
        </div>

        {/* === معلومات المتجر === */}
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

        {/* === أداة التعديل === */}
        {isOwner && (
          <ProfileEditor user={JSON.parse(JSON.stringify(userProfile))} />
        )}

        {/* === قسم المنتجات === */}
        {userProfile.role === 'seller' && (
          <div className="mt-8 border-t pt-6">
            
            {/* ✅✅ التعديل هنا: أضفنا زر لوحة التحكم بجانب زر الإضافة ✅✅ */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">المنتجات ({sellerProducts.length})</h2>
              
              {isOwner && (
                <div className="flex gap-2">
                  {/* الزر الجديد: يوديه لصفحة الحذف والإدارة */}
                  <Link 
                    href="/seller" 
                    className="text-sm bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition flex items-center gap-1"
                  >
                    إدارة المنتجات 📊
                  </Link>
                  {/* زر الإضافة السابق */}
                  <Link 
                    href="/product/add" 
                    className="text-sm bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition flex items-center gap-1"
                  >
                    إضافة منتج ➕
                  </Link>
                </div>
              )}
            </div>
            {/* ✅✅ نهاية التعديل ✅✅ */}

            {sellerProducts.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <div className="text-4xl mb-3">📦</div>
                <p className="text-gray-500 mb-5">لم يتم إضافة منتجات بعد</p>
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
              <ProductList products={JSON.parse(JSON.stringify(sellerProducts))} />
            )}
          </div>
        )}

        {!isOwner && userProfile.role !== 'seller' && (
          <p className="mt-6 text-center text-sm text-gray-400">
            أنت تشاهد ملف {userProfile.name} كزائر.
          </p>
        )}
      </div>
    </div>
  );
}