import { auth } from "@/auth";
import { connectToDB } from "@/lib/db";
import { User } from "@/models/User";
import { Product } from "@/models/Product";
import { notFound } from "next/navigation";
import ProfileEditor from "@/components/ProfileEditor";
import Link from "next/link";

// تعريف مبسط لنوع المستخدم ليتوافق مع lean() (كائن عادي)
type LeanUser = {
  _id: { toString(): string };
  username: string;
  name: string;
  email: string;
  avatar?: string | null;
  role: "user" | "seller";
  sellerInfo?: {
    description?: string;
  } | null;
  createdAt: Date | string;
};

type LeanProduct = {
  _id: { toString(): string };
  title: string;
  price: number;
  seller: unknown;
};

// في Next.js 15، params أصبح Promise
interface PublicProfileProps {
  params: Promise<{ username: string }>;
}

export default async function PublicProfile({ params }: PublicProfileProps) {
  const { username } = await params;

  await connectToDB();

  const userProfile = (await User.findOne({ username }).lean()) as LeanUser | null;
  if (!userProfile) notFound();

  const session = await auth();
  const isOwner = session?.user?.email === userProfile.email;

  // جلب المنتجات إذا كان بائعاً
  let products: LeanProduct[] = [];
  if (userProfile.role === "seller") {
    products = (await Product.find({ seller: userProfile._id }).lean()) as LeanProduct[];
  }

  // تحويل createdAt إلى string للتأكد من أنه يمكن تمريره إلى toLocaleDateString
  const createdAtDate =
    typeof userProfile.createdAt === "string"
      ? new Date(userProfile.createdAt)
      : userProfile.createdAt;

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center" dir="rtl">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
        {/* رأس الملف الشخصي */}
        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-3xl text-white font-bold overflow-hidden border-4 border-white shadow">
            {userProfile.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={userProfile.avatar} alt={userProfile.name} className="w-full h-full object-cover" />
            ) : (
              userProfile.name.charAt(0).toUpperCase()
            )}
          </div>

          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">{userProfile.name}</h1>
            <p className="text-gray-500 text-sm">
              عضو منذ {createdAtDate.toLocaleDateString("ar-EG")}
            </p>
            {userProfile.role === "seller" && (
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
        {isOwner && (
          <ProfileEditor
            user={{
              ...userProfile,
              _id: userProfile._id.toString(), // تأكد من تحويل _id إلى string للمكون
              createdAt: userProfile.createdAt,
            }}
          />
        )}

        {/* قسم المنتجات للبائع */}
        {userProfile.role === "seller" && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-bold mb-4">منتجاتي ({products.length})</h2>

            {products.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <div className="text-4xl mb-3">📦</div>
                <p className="text-gray-500 mb-5">
                  لم {isOwner ? "تقم" : "يقم"} بإضافة أي منتجات بعد
                </p>
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
              <div className="grid grid-cols-2 gap-4">
                {products.map((p) => (
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