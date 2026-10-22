import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

const [email, newPassword] = process.argv.slice(2);

await mongoose.connect(process.env.MONGO_URI);
const hashed = await bcrypt.hash(newPassword, 10);
const r = await User.updateOne({ email }, { $set: { password: hashed } });
console.log(r.matchedCount ? "Password reset" : "No user with that email");
process.exit();