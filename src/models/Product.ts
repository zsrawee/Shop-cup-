
import mongoose from 'mongoose';

interface IProductDocument extends mongoose.Document {
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  seller: mongoose.Types.ObjectId;
  ratings: Array<{
    userId: mongoose.Types.ObjectId;
    userName: string;
    rating: number;
    comment: string;
    createdAt: Date;
  }>;
  averageRating: number;
  numberOfReviews: number;
  createdAt: Date;
}

interface IProductModel extends mongoose.Model<IProductDocument> {
  calculateAverage(productId: string): Promise<void>;
}



const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [String], // مصفوفة لروابط الصور
  category: String,
  stock: { type: Number, default: 0 },
  
  // الربط بالبائع (هذا هو الجسر)
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
// نظام التقييمات
  ratings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      userName: String, // تخزين الاسم هنا يقلل من الـ populate ويسرع العرض
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  
  // حقول مخزنة لسرعة الاستعلام (Denormalization)
  averageRating: { type: Number, default: 0 }, // متوسط النجوم (مثلاً 4.5)
  numberOfReviews: { type: Number, default: 0 }, // إجمالي عدد الأشخاص اللي قيموا

  createdAt: { type: Date, default: Date.now }
});

// تعريف الدالة داخل الـ Statics في Schema الخاص بك
ProductSchema.statics.calculateAverage = async function(productId: string) {
  const product = await this.findById(productId);

  if (product && product.ratings.length > 0) {
    const total = product.ratings.reduce((acc: number, item: { rating: number }) => item.rating + acc, 0);
    const averageRating = parseFloat((total / product.ratings.length).toFixed(1));
    const numberOfReviews = product.ratings.length;

    await this.findByIdAndUpdate(productId, {
      averageRating,
      numberOfReviews
    });
  } else {
    // في حال تم حذف كل التقييمات، نصفر القيم
    await this.findByIdAndUpdate(productId, {
      averageRating: 0,
      numberOfReviews: 0
    });
  }
};

ProductSchema.post('save', async function() {
 
  await (this.constructor as IProductModel).calculateAverage(this._id.toString());
});

export const Product = (mongoose.models.Product || mongoose.model('Product', ProductSchema)) as IProductModel;