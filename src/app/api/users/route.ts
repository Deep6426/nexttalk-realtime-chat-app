import { NextResponse } from "next/server";
import Message from "@/lib/messageModel";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/userModel";

export async function GET() {
  try {
    await connectDB();

    const users = await User.find().select("-password");

const latestMessages = await Message.find()
  .sort({ createdAt: -1 });

const orderedUsers = [];
const added = new Set();

for (const msg of latestMessages) {
  if (!added.has(msg.username)) {
    const user = users.find(
      (u) => u.username === msg.username
    );

    if (user) {
      orderedUsers.push(user);
      added.add(msg.username);
    }
  }

  if (!added.has(msg.receiver)) {
    const user = users.find(
      (u) => u.username === msg.receiver
    );

    if (user) {
      orderedUsers.push(user);
      added.add(msg.receiver);
    }
  }
}

for (const user of users) {
  if (!added.has(user.username)) {
    orderedUsers.push(user);
  }
}

    return NextResponse.json(orderedUsers);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}