import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  role: { 
    type: String, 
    enum: ['user', 'seller', 'admin'], 
    default: 'user' 
  },
  // بيانات إضافية تملأ فقط إذا كان بائعاً
  sellerInfo: {
    storeName: String,
    description: String,
    isVerified: { type: Boolean, default: false },
    rating: { type: Number, default: 0 }
  },
  avatar: String,
  createdAt: { type: Date, default: Date.now }
});

// إذا أردت أن ترى منتجات البائع داخل كائن المستخدم برمجياً
UserSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'seller'
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);