import { prisma, PrismaType } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

export async function DELETE(req: NextRequest, ctx: RouteContext<"/api/music/[slug]">) {
  const { slug } = await ctx.params;
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

  const music = await prisma.music.findUnique({
    where: {
      id: slug,
      userId: user.id,
    },
  });

  if (!music) {
    return NextResponse.json({ message: "Not found or unauthorized" }, { status: 404 });
  }

  try {
    await prisma.music.delete({ where: { userId: user.id, id: slug } });
    return NextResponse.json({ message: "Music deleted successfully!" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, ctx: RouteContext<"/api/music/[slug]">) {
  const { slug } = await ctx.params;
  const userToken = req.headers.get("authorization");
  const reqBody = await req.json();

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

  const music = await prisma.music.findUnique({
    where: {
      id: slug,
      userId: user.id,
    },
  });

  if (!music) {
    return NextResponse.json({ message: "Not found or unauthorized" }, { status: 404 });
  }

  try {
    await prisma.music.update({ where: { userId: user.id, id: slug }, data: { title: reqBody.musicName, singerName: reqBody.singerName, src: reqBody.musicLink, favorites: music.favorites } });
    return NextResponse.json({ message: `Music ${music.favorites ? "removed from" : "added to"} favorites successfully!` }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
