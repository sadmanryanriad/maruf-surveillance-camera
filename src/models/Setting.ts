import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISetting extends Document {
  phone: string;
  email: string;
  address: string;
  hours: string;
  whatsappNumber: string;
  telegramChatIds: string[];
  updatedAt: Date;
}

const SettingSchema: Schema<ISetting> = new Schema(
  {
    phone: { type: String, default: "+880 1790-424860" },
    email: { type: String, default: "hello@maruf-security.com" },
    address: { type: String, default: "24 Watchtower Ave, Suite 300, Metro City" },
    hours: { type: String, default: "Mon-Sat · 8am-8pm" },
    whatsappNumber: { type: String, default: "8801790424860" },
    telegramChatIds: {
      type: [String],
      default: ["1240674937"],
    },
  },
  {
    timestamps: true,
  }
);

SettingSchema.index({ updatedAt: -1 });

const Setting: Model<ISetting> = mongoose.models.Setting || mongoose.model<ISetting>("Setting", SettingSchema);

export default Setting;
