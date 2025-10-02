import { NextRequest, NextResponse } from "next/server";
import { prisma, PrismaType } from "@/lib/prisma";
import * as jose from "jose";

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
    const userMusics = await prisma.music.findMany({ where: { userId: user?.id } });
    return NextResponse.json({ musics: userMusics });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
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
    await prisma.music.create({
      data: {
        title: reqBody.musicName,
        singerName: reqBody.singerName,
        src: reqBody.musicLink,
        favorites: false,
        Folder: reqBody.folderId ? { connect: { id: reqBody.folderId } } : undefined,
        User: { connect: { id: user?.id } },
      },
    });
    return NextResponse.json({ message: "Music created successfully" }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Unknown server internal error", err }, { status: 500 });
  }
}
