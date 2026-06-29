import { connectDB } from "@/lib/mongodb";
import User from "@/lib/userModel";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const newUser = await User.create({
      username: body.username,
      email: body.email,
      password: hashedPassword,
    });

    return Response.json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });

  } catch (error: any) {
  console.error("SIGNUP ERROR MESSAGE:", error?.message);
  console.error("SIGNUP ERROR:", error);

  return Response.json({
    success: false,
    message: error?.message || "Signup failed",
  });
}
}