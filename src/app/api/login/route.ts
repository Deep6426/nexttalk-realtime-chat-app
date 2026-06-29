import { connectDB } from "@/lib/mongodb";
import User from "@/lib/userModel";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
   try {
      await connectDB();

      const body = await request.json();

      const user = await User.findOne({
         email: body.email,
      });

      if (!user) {
         return Response.json({
            success: false,
            message: "User not found",
         });
      }

      const isPasswordCorrect = await bcrypt.compare(
         body.password,
         user.password
      );

      if (!isPasswordCorrect) {
         return Response.json({
            success: false,
            message: "Invalid password",
         });
      }

      return Response.json({
         success: true,
         message: "Login successful",
         user,
      });

   } catch (error) {
      return Response.json({
         success: false,
         message: "Login failed",
         error,
      });
   }
}