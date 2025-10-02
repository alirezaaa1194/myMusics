import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";
import { prisma, PrismaType } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const userToken = req.headers.get("authorization");

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const verifyToken = await jose.jwtVerify(String(userToken), secret);
  const userEmail = verifyToken.payload.email;

  const user: PrismaType.User | null = await prisma.user.findUnique({
    where: { email: String(userEmail) },
  });

  if (!user) {
    return NextResponse.json(
      { message: "You dont have accees to this route!" },
      {
        status: 401,
      }
    );
  }

  try {
    const folders = await prisma.folder.findMany({
      where: {
        userId: user.id,
      },
    });
    return NextResponse.json({ folders }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Unknown server internal error", err }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const reqBody = await req.json();
  const userToken = req.headers.get("authorization");

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const verifyToken = await jose.jwtVerify(String(userToken), secret);
  const userEmail = verifyToken.payload.email;

  const user: PrismaType.User | null = await prisma.user.findUnique({
    where: { email: String(userEmail) },
  });

  if (!user) {
    return NextResponse.json(
      { message: "You dont have accees to this route!" },
      {
        status: 401,
      }
    );
  }

  try {
    await prisma.folder.create({
      data: {
        title: reqBody.title,
        User: { connect: { id: user?.id } },
      },
    });
    return NextResponse.json({ message: "folder created successfully" }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Unknown server internal error", err }, { status: 500 });
  }
}
