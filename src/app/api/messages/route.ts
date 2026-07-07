import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Message from "@/lib/messageModel";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const sender = req.nextUrl.searchParams.get("sender");
    const receiver = req.nextUrl.searchParams.get("receiver");

    if (!sender || !receiver) {
      return NextResponse.json([]);
    }

    const messages = await Message.find({
      $or: [
        { username: sender, receiver: receiver },
        { username: receiver, receiver: sender },
      ],
    }).sort({ createdAt: 1 });

    return NextResponse.json(messages);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}


export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const message = await Message.create({
      username: body.username,
      receiver: body.receiver,
      text: body.text,
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 }
    );
  }
}