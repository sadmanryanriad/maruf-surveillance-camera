import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
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
        email: "maruf@gmail.com",
        password: hashedPassword,
        name: "Maruf Admin",
        role: "admin",
        telegramChatId: "1240674937",
      });
      console.log("✅ Seeded default admin user: maruf@gmail.com");
    }

    const Setting = (await import("@/models/Setting")).default;
    const setting = await Setting.findOne();
    if (!setting) {
      await Setting.create({
        phone: "+880 1760-345435",
        email: "hello@maruf-security.com",
        address: "24 Watchtower Ave, Suite 300, Metro City",
        hours: "Mon-Sat · 8am-8pm",
        telegramChatIds: ["1240674937"],
      });
      console.log("✅ Seeded default site settings and Telegram Chat ID");
    } else {
      let updated = false;
      if (!setting.phone) { setting.phone = "+880 1760-345435"; updated = true; }
      if (!setting.email) { setting.email = "hello@maruf-security.com"; updated = true; }
      if (!setting.address) { setting.address = "24 Watchtower Ave, Suite 300, Metro City"; updated = true; }
      if (!setting.hours) { setting.hours = "Mon-Sat · 8am-8pm"; updated = true; }
      if (updated) await setting.save();
    }
  } catch (err) {
    console.error("Error seeding default admin / settings:", err);
  }
}
