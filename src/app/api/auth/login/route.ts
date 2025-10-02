import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const user = await prisma.user.findUnique({ where: { email: body.email } });

  if (!user) {
    return NextResponse.json({ message: "User not found. please signup!" }, { status: 404 });
  }

  const isPasswordCorrect = await bcrypt.compare(body.password, String(user.password));

  if (!isPasswordCorrect) {
    return NextResponse.json({ message: "username or password is not true!" }, { status: 401 });
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const token = await new jose.SignJWT({ email: String(user?.email) }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("365d").sign(secret);

  try {
    return NextResponse.json({ message: "You are logged in successfully!", accessToken: token }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Unknown internal server error!", err });
  }
}
