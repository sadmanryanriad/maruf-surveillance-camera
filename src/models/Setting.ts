import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISetting extends Document {
  telegramChatIds: string[];
  updatedAt: Date;
}

const SettingSchema: Schema<ISetting> = new Schema(
  {
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
