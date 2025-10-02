import { prisma, PrismaType } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

export async function GET(req: NextRequest, ctx: RouteContext<"/api/folder/[slug]">) {
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

  const folder = await prisma.folder.findUnique({
    where: {
      id: slug,
      userId: user.id,
    },
    include: {
      Music: true,
    },
  });

  if (!folder) {
    return NextResponse.json({ message: "Not folder found or unauthorized" }, { status: 404 });
  }
  try {
    return NextResponse.json({ folder }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export async function POST(req: NextRequest, ctx: RouteContext<"/api/folder/[slug]">) {
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

  const folder = await prisma.folder.findUnique({
    where: {
      id: slug,
      userId: user.id,
    },
  });

  if (!folder) {
    return NextResponse.json({ message: "Not folder found or unauthorized" }, { status: 404 });
  }

  try {
    await prisma.music.update({ where: { userId: user.id, id: reqBody.musicId }, data: { Folder: { connect: { id: slug } } } });
    return NextResponse.json({ message: "Music added to Folder successfully!" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, ctx: RouteContext<"/api/folder/[slug]">) {
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

  const folder = await prisma.folder.findUnique({
    where: {
      id: slug,
      userId: user.id,
    },
  });

  if (!folder) {
    return NextResponse.json({ message: "Not found or unauthorized" }, { status: 404 });
  }

  try {
    await prisma.folder.update({ where: { userId: user.id, id: slug }, data: { title: reqBody.title } });
    return NextResponse.json({ message: "Folder name updated successfully!" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, ctx: RouteContext<"/api/folder/[slug]">) {
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

  const folder = await prisma.folder.findUnique({
    where: {
      id: slug,
      userId: user.id,
    },
  });

  if (!folder) {
    return NextResponse.json({ message: "Not found or unauthorized" }, { status: 404 });
  }

  try {
    await prisma.music.updateMany({ where: { userId: user.id, folderId: folder.id }, data: { folderId: null } });
    await prisma.folder.delete({ where: { userId: user.id, id: slug } });
    return NextResponse.json({ message: "Folder deleted successfully!" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
