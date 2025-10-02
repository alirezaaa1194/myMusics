import { prisma, PrismaType } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

export async function GET(req: NextRequest, ctx: RouteContext<"/api/folder/[slug]/musics">) {
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
    return NextResponse.json({ musics: folder.Music }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

