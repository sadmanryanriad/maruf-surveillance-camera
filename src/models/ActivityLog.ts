import mongoose, { Schema, Document, Model } from "mongoose";

export interface IActivityLog extends Document {
  userEmail: string;
  userName: string;
  userRole: "admin" | "viewer";
  action: string;
  details: string;
  createdAt: Date;
}

const ActivityLogSchema: Schema<IActivityLog> = new Schema(
  {
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    userRole: { type: String, enum: ["admin", "viewer"], required: true, index: true },
    action: { type: String, required: true },
    details: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// High-Performance Indexes for Audit Logs
ActivityLogSchema.index({ createdAt: -1 });
ActivityLogSchema.index({ userRole: 1, createdAt: -1 });

const ActivityLog: Model<IActivityLog> =
  mongoose.models.ActivityLog || mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);

export default ActivityLog;

export async function logActivity(
  user: { email: string; name: string; role: "admin" | "viewer" },
  action: string,
  details: string
): Promise<void> {
  try {
    const { connectToDatabase } = await import("@/lib/db");
    await connectToDatabase();
    await ActivityLog.create({
      userEmail: user.email,
      userName: user.name,
      userRole: user.role,
      action,
      details,
    });
  } catch (err) {
    console.error("Error writing activity log:", err);
  }
}
