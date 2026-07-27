import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISetting extends Document {
  phone: string;
  email: string;
  address: string;
  hours: string;
  telegramChatIds: string[];
  updatedAt: Date;
}

const SettingSchema: Schema<ISetting> = new Schema(
  {
    phone: { type: String, default: "+880 1760-345435" },
    email: { type: String, default: "hello@maruf-security.com" },
    address: { type: String, default: "24 Watchtower Ave, Suite 300, Metro City" },
    hours: { type: String, default: "Mon-Sat · 8am-8pm" },
    telegramChatIds: {
      type: [String],
      default: ["1240674937"],
    },
  },
  {
    timestamps: true,
  }
);

const Setting: Model<ISetting> = mongoose.models.Setting || mongoose.model<ISetting>("Setting", SettingSchema);

export default Setting;
