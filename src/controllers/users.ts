import mongoose, { Schema, Document } from 'mongoose';

export interface IUserDetail extends Document {
    email: string;
    name: string;
}

const UserDetail: Schema = new Schema({
    emailId: { type: String, required: true },
    name: { type: String, require: true }
    },
    {
    timestamps: true
  });

const User = mongoose.model<IUserDetail>('User', UserDetail);

export default User;
