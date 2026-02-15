import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const message = await prisma.message.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, image: true },
        },
        reflection: true,
      },
    });

    if (!message) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const isOwner = message.userId === session.user.id;
    const isUnlocked = new Date(message.revealAt) <= new Date();

    if (!isOwner && (!message.isPublic || !isUnlocked)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    let content = "LOCKED";
    if (isUnlocked) {
      try {
        content = decrypt({ content: message.content, iv: message.iv });
      } catch (e) {
        content = "Error decrypting content";
      }
    }

    return NextResponse.json({
      id: message.id,
      content,
      revealAt: message.revealAt,
      isPublic: message.isPublic,
      createdAt: message.createdAt,
      author: message.user.name || "Anonymous",
      authorImage: message.user.image,
      isUnlocked,
      isOwner,
      reflection: message.reflection,
    });
  } catch (error) {
    console.error("[MESSAGE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const message = await prisma.message.findUnique({
      where: { id },
    });

    if (!message) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (message.userId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await prisma.message.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[MESSAGE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
