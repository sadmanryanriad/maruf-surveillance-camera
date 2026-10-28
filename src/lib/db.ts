import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };
if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is missing.");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      maxPoolSize: 10,
      autoIndex: true,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
    await seedDefaultAdmin();
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

async function seedDefaultAdmin() {
  try {
    const User = (await import("@/models/User")).default;
    const adminCount = await User.countDocuments();
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash("Changeme123", 10);
      await User.create({
        email: "admin@silhouettesecuritysolutions.co.uk",
        password: hashedPassword,
        name: "Admin",
        role: "admin",
        telegramChatId: "1240674937",
      });
      console.log("✅ Seeded default admin user: admin@silhouettesecuritysolutions.co.uk");
    }

    const Setting = (await import("@/models/Setting")).default;
    const setting = await Setting.findOne();
    if (!setting) {
      await Setting.create({
        phone: "+44 1903 905120",
        email: "info@silhouettesecuritysolutions.co.uk",
        address: "Worthing, West Sussex",
        hours: "Mon-Sat · 8am-8pm",
        whatsappNumber: "441903905120",
        telegramChatIds: ["1240674937"],
      });
      console.log("✅ Seeded default site settings and Telegram Chat ID");
    } else {
      let updated = false;
      if (!setting.phone || setting.phone.includes("01760") || setting.phone.includes("880")) { setting.phone = "+44 1903 905120"; updated = true; }
      if (!setting.email || setting.email.includes("maruf")) { setting.email = "info@silhouettesecuritysolutions.co.uk"; updated = true; }
      if (!setting.address || setting.address.includes("Watchtower") || setting.address.includes("Local to you")) { setting.address = "Worthing, West Sussex"; updated = true; }
      if (!setting.hours) { setting.hours = "Mon-Sat · 8am-8pm"; updated = true; }
      if (!setting.whatsappNumber || setting.whatsappNumber.includes("880")) { setting.whatsappNumber = "441903905120"; updated = true; }
      if (updated) await setting.save();
    }
  } catch (err) {
    console.error("Error seeding default admin / settings:", err);
  }
}
