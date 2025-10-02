import { prisma, PrismaType } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

export async function DELETE(req: NextRequest, ctx: RouteContext<"/api/folder/[slug]/musics">) {
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
    await prisma.music.update({ where: { id: music.id, userId: user.id }, data: { folderId: null } });
    return NextResponse.json({ message: "Folder deleted successfully!" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
