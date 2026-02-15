import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  // Next.js 15+ convention: params is now a Promise in many contexts,
  // though Next.js 14 it was not always forced.
  // The error suggests type mismatch. Let's await params.
  const { id } = await params;

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { content } = body;

    if (!content) {
      return new NextResponse("Missing content", { status: 400 });
    }

    const message = await prisma.message.findUnique({
      where: { id },
      include: { reflection: true },
    });

    if (!message) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (message.userId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const isUnlocked = new Date(message.revealAt) <= new Date();
    if (!isUnlocked) {
      return new NextResponse("Cannot reflect on locked message", { status: 400 });
    }

    if (message.reflection) {
      return new NextResponse("Reflection already exists", { status: 409 });
    }

    const reflection = await prisma.reflection.create({
      data: {
        content,
        messageId: id,
      },
    });

    return NextResponse.json(reflection);
  } catch (error) {
    console.error("[REFLECTION_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
