import mongoose, { Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { DefaultUser } from 'next-auth/core/types';

export interface IUser extends DefaultUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  plainTextPassword?: string;
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword?: (password: string) => Promise<boolean>;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);