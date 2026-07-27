import mongoose, { Schema, Document, Model } from "mongoose";

export type LeadType = "quote" | "book" | "contact";
export type LeadStatus = "new" | "contacted" | "in_progress" | "completed";

export interface ILeadNote {
  author: string;
  text: string;
  createdAt: Date;
}

export interface ILead extends Document {
  type: LeadType;
  name: string;
  email?: string;
  phone: string;
  propertyType?: string;
  cameraCount?: string;
  preferredDate?: string;
  service?: string;
  notes?: string;
  status: LeadStatus;
  isBookmarked: boolean;
  adminNotes: ILeadNote[];
  createdAt: Date;
  updatedAt: Date;
}

const LeadNoteSchema = new Schema<ILeadNote>(
  {
    author: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const LeadSchema: Schema<ILead> = new Schema(
  {
    type: {
      type: String,
      enum: ["quote", "book", "contact"],
      default: "contact",
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    propertyType: { type: String },
    cameraCount: { type: String },
    preferredDate: { type: String },
    service: { type: String },
    notes: { type: String },
    status: {
      type: String,
      enum: ["new", "contacted", "in_progress", "completed"],
      default: "new",
    },
    isBookmarked: { type: Boolean, default: false },
    adminNotes: [LeadNoteSchema],
  },
  {
    timestamps: true,
  }
);

const Lead: Model<ILead> = mongoose.models.Lead || mongoose.model<ILead>("Lead", LeadSchema);

export default Lead;
