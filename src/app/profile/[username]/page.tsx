import { auth } from "@/auth";
import { connectToDB } from "@/lib/db";
import { User } from "@/models/User";
import { Product } from "@/models/Product"; // لا تنس استيراده لعرض المنتجات لاحقاً
import { notFound } from "next/navigation";
import ProfileEditor from "@/components/ProfileEditor"; // استيراد مكون التعديل
import Link from "next/link";


export default async function PublicProfile({ params }: { params: { username: string } }) {
  const { username } = await params; 
 
  await connectToDB();
  
  const userProfile = await User.findOne({ username }).lean();
  if (!userProfile) notFound();

  const session = await auth();  
  const isOwner = session?.user?.email === userProfile.email;

  // جلب المنتجات إذا كان بائعاً
  let products: any[] = [];
  if (userProfile.role === 'seller') {
    products = await Product.find({ seller: userProfile._id }).lean();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center" dir="rtl">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
        
        {/* رأس الملف الشخصي */}
        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-3xl text-white font-bold overflow-hidden border-4 border-white shadow">
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
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">بائع ✅</span>
            )}
          </div>
        </div>

        {/* الوصف */}
        {userProfile.sellerInfo?.description && (
          <div className="mb-6 p-4 bg-gray-50 rounded-2xl text-gray-700 text-sm">
            {userProfile.sellerInfo.description}
          </div>
        )}

        {/* أداة التعديل تظهر فقط لصاحب الحساب */}
        {isOwner && <ProfileEditor user={JSON.parse(JSON.stringify(userProfile))} />}

        {/* قسم المنتجات للبائع */}
        {/* قسم المنتجات للبائع */}
        {userProfile.role === 'seller' && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-bold mb-4">منتجاتي ({products.length})</h2>
            
            {products.length === 0 ? (
              // ✅ حالة المتجر الفارغ
              <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <div className="text-4xl mb-3">📦</div>
                <p className="text-gray-500 mb-5">لم {isOwner ? 'تقم' : 'يقوم'} بإضافة أي منتجات بعد</p>
                
                {/* الزر يظهر فقط لصاحب المتجر */}
                {isOwner && (
                  <Link 
                    href="/products/add" 
                    className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-green-700 transition inline-block"
                  >
                    إضافة منتجات ➕
                  </Link>
                )}
              </div>
            ) : (
              // ✅ حالة وجود منتجات
              <div className="grid grid-cols-2 gap-4">
                {products.map(p => (
                  <div key={p._id.toString()} className="border rounded-xl p-3 bg-gray-50 hover:shadow-md transition">
                    <h3 className="font-bold text-sm truncate">{p.title}</h3>
                    <p className="text-blue-600 font-extrabold mt-1">${p.price}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}