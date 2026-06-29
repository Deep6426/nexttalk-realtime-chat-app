import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Message from "@/lib/messageModel";

export async function GET() {
  try {
    console.log("STEP 1");

    await connectDB();

    console.log("STEP 2");

    console.log("Message model:", Message);

    const messages = await Message.find();

    console.log("STEP 3", messages);

    return NextResponse.json(messages);
  } catch (error) {
    console.log("FULL ERROR:");
    console.dir(error, { depth: null });

    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}