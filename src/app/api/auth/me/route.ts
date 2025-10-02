import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const authorizationToken = req.headers.get("authorization");
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  if (!authorizationToken) {
    return NextResponse.json({ message: "Authorization must sent" }, { status: 400 });
  }

  try {
    const verifyToken = await jose.jwtVerify(authorizationToken, secret);
    const userEmail = verifyToken.payload.email;
    const user = await prisma.user.findUnique({ where: { email: String(userEmail) } });
    if (user) {
      return NextResponse.json({ user }, { status: 200 });
    } else {
      return NextResponse.json({ message: "User was not found" }, { status: 404 });
    }
  } catch (err) {
    return NextResponse.json({ message: "Authorization token in not valid", err }, { status: 400 });
  }
}
