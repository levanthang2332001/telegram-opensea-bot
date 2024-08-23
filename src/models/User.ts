import mongoose from "mongoose";
import { IUser } from "../interface/index";

const userSchema = new mongoose.Schema<IUser>({
    userId: { type: Number, required: true, unique: true },
    username: { type: String, required: true },
    nft: [
        {
            collection: { type: String, required: true },
            address: { type: String, required: true },
            chain: { type: String, required: true },
            targetPrice: { type: Number },
            currency: { type: String }
        }
    ]
});

const User =
  (mongoose.models.User as mongoose.Model<
    IUser,
    {},
    {},
    {},
    mongoose.Document<unknown, {}, IUser> &
      Omit<
        IUser & {
          _id: mongoose.Types.ObjectId;
        },
        never
      >,
    any
  >) || mongoose.model<IUser>('User', userSchema);

export default User;
