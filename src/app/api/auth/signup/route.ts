import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const isUserExist = await prisma.user.findUnique({ where: { email: body.email } });

  if (isUserExist) {
    return NextResponse.json({ message: "User already exist. please login!" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(body.password, 12);
  try {
    await prisma.user.create({ data: { username: body.username, email: body.email, password: hashedPassword } });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new jose.SignJWT({ email: String(body?.email) }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("365d").sign(secret);

    return NextResponse.json({ message: "You are registered successfully!", accessToken: token }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Unknown internal server error!", err });
  }
}
