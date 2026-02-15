import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const messages = await prisma.message.findMany({
      where: {
        isPublic: true,
        revealAt: {
          lte: new Date(),
        },
      },
      orderBy: {
        revealAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      take: 20,
    });

    const formattedMessages = messages.map((msg) => {
      let content = "LOCKED";
      try {
        content = decrypt({ content: msg.content, iv: msg.iv });
      } catch (e) {
        content = "Error decrypting message";
      }

      return {
        id: msg.id,
        content,
        createdAt: msg.createdAt,
        revealAt: msg.revealAt,
        author: msg.user.name || "Anonymous",
        authorImage: msg.user.image,
      };
    });

    return NextResponse.json(formattedMessages);
  } catch (error) {
    console.error("[PUBLIC_MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
