import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { encrypt, decrypt } from "@/lib/encryption";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email"; // Import email service

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { content, revealAt, isPublic } = body;

    if (!content || !revealAt) {
      return new NextResponse("Missing content or reveal date", { status: 400 });
    }

    const encrypted = encrypt(content);
    const revealDate = new Date(revealAt);

    const message = await prisma.message.create({
      data: {
        content: encrypted.content,
        iv: encrypted.iv,
        revealAt: revealDate,
        isPublic: isPublic || false,
        userId: session.user.id,
      },
    });

    // Send confirmation email
    await sendEmail(
      session.user.email,
      "Your Time Capsule is Sealed",
      `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <h1 style="color: #000;">Time Capsule Sealed</h1>
          <p>Your message to the future has been successfully stored.</p>
          <p>It will unlock on <strong>${revealDate.toLocaleDateString()} at ${revealDate.toLocaleTimeString()}</strong>.</p>
          <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          <p style="color: #666; font-size: 12px;">MsgFuture - Sending messages through time.</p>
        </div>
      `
    );

    return NextResponse.json(message);
  } catch (error) {
    console.error("[MESSAGES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const messages = await prisma.message.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const now = new Date();

    const formattedMessages = messages.map((msg) => {
      const isUnlocked = new Date(msg.revealAt) <= now;
      let content = "LOCKED";

      if (isUnlocked) {
        try {
          content = decrypt({ content: msg.content, iv: msg.iv });
        } catch (e) {
          content = "Error decrypting message";
        }
      }

      return {
        ...msg,
        content,
        isUnlocked,
      };
    });

    return NextResponse.json(formattedMessages);
  } catch (error) {
    console.error("[MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
