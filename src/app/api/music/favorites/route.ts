import { prisma, PrismaType } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
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
    const userMusics = await prisma.music.findMany({ where: { userId: user?.id, favorites: true } });
    return NextResponse.json({ musics: userMusics });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
