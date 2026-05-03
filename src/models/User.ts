import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// === TypeScript Interfaces ===

interface IAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface ICartItem {
  product: Types.ObjectId;
  quantity: number;
}

interface ISellerInfo {
  storeName: string;
  description: string;
  isVerified: boolean;
  rating: number;
}

interface IUser {
  name: string;
  email: string;
  password: string;
  username: string;
  role: 'user' | 'seller' | 'admin';
  sellerInfo?: ISellerInfo;
  avatar?: string;
  phone?: string;
  addresses: IAddress[];
  cart: ICartItem[];
  wishlist: Types.ObjectId[];
  createdAt: Date;
}

interface IUserDocument extends IUser, Document {}

type IUserModel = Model<IUserDocument>

// === Mongoose Schema ===

const AddressSchema = new Schema<IAddress>({
  street: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
}, { _id: false });

const CartItemSchema = new Schema<ICartItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, default: 1, min: 1 }
}, { _id: false });

const SellerInfoSchema = new Schema<ISellerInfo>({
  storeName: String,
  description: String,
  isVerified: { type: Boolean, default: false },
  rating: { type: Number, default: 0 }
}, { _id: false });

const UserSchema = new Schema<IUserDocument, IUserModel>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  role: { 
    type: String, 
    enum: ['user', 'seller', 'admin'], 
    default: 'user' 
  },
  sellerInfo: SellerInfoSchema,
  avatar: String,
  phone: String,
  addresses: [AddressSchema],
  cart: [CartItemSchema],
  wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  createdAt: { type: Date, default: Date.now }
});

// إذا أردت أن ترى منتجات البائع داخل كائن المستخدم برمجياً
UserSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'seller'
});

export const User = (mongoose.models.User as IUserModel) || mongoose.model<IUserDocument, IUserModel>('User', UserSchema);