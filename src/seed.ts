import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Connect directly to the same DB as the app
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/therapy-center";

async function seedSampleUsers() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGO_URI);
  console.log("Connected!");

  // Inline User schema (minimal) to avoid TypeScript import complexity
  const userSchema = new mongoose.Schema(
    {
      name: String,
      email: { type: String, unique: true },
      passwordHash: String,
      role: {
        type: String,
        enum: ["admin", "therapist", "client"],
        default: "client",
      },
    },
    { timestamps: true },
  );

  const User = mongoose.models.User || mongoose.model("User", userSchema);

  const sampleUsers = [
    {
      name: "Dr. Priya Sharma",
      email: "therapist@gmail.com",
      password: "Therapist@123",
      role: "therapist",
    },
    {
      name: "Arjun Kumar",
      email: "client@gmail.com",
      password: "Client@123",
      role: "client",
    },
  ];

  for (const u of sampleUsers) {
    const existing = await User.findOne({ email: u.email });
    if (existing) {
      console.log(`⚠️  User already exists: ${u.email} — skipping.`);
      continue;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(u.password, salt);
    await User.create({
      name: u.name,
      email: u.email,
      passwordHash,
      role: u.role,
    });
    console.log(`✅ Created ${u.role}: ${u.email} / ${u.password}`);
  }

  await mongoose.disconnect();
  console.log("\nSeed complete! Sample credentials:");
  console.log("  Therapist: therapist@gmail.com / Therapist@123");
  console.log("  Client:    client@gmail.com    / Client@123");
  process.exit(0);
}

seedSampleUsers().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
