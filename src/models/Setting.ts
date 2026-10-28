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
    phone: { type: String, default: "+44 1903 905120" },
    email: { type: String, default: "info@silhouettesecuritysolutions.co.uk" },
    address: { type: String, default: "Worthing, West Sussex" },
    hours: { type: String, default: "Mon-Sat · 8am-8pm" },
    whatsappNumber: { type: String, default: "441903905120" },
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
