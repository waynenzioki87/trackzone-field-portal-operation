require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const password = await bcrypt.hash("12345", 10);
  const accounts = [
    { email: "waynenzioki87@gmail.com", role: "Owner" },
    { email: "waynenzikoi87@gmail.com", role: "Admin" },
    { email: "technician@trackzone.com", role: "Technician", name: "TrackZone Technician" },
  ];
  for (const account of accounts) {
    const { email, role, name = "Wayne" } = account;
    await User.findOneAndUpdate(
      { email }, 
      {
        $set: { name, email, password, role, isEmailVerified: true },
        $unset: { emailVerificationTokenHash: "", emailVerificationExpires: "" },
      },
      { upsert: true, new: true, runValidators: true }
    );
  }
  console.log("Presentation accounts ready for 12345");
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
