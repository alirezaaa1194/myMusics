import { NextRequest, NextResponse } from "next/server";
import { prisma, PrismaType } from "@/lib/prisma";
import * as jose from "jose";
import { createClient } from "@supabase/supabase-js";

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
  const formData = await req.formData();
  const userToken = req.headers.get("authorization");

  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  const musicType = formData.get("musicType");
  const musicName = formData.get("musicName");
  const singerName = formData.get("singerName");
  const musicLink = formData.get("musicLink");
  const folderId = formData.get("folderId");
  const musicFile = formData.get("musicFile") as File | null;

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const verifyToken = await jose.jwtVerify(String(userToken), secret);
  const userEmail = verifyToken.payload.email;

  const user: PrismaType.User | null = await prisma.user.findUnique({
    where: { email: String(userEmail) },
  });

  if (!user) {
    return NextResponse.json({ message: "You dont have access to this route!" }, { status: 401 });
  }

  try {
    let src = "";

    if (musicType === "file" && musicFile) {
      const arrayBuffer = await musicFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filePath = `musics/${Date.now()}-${musicFile.name}`;

      const { error } = await supabase.storage.from("sabzlearn-bucket").upload(filePath, buffer, {
        contentType: musicFile.type,
      });

      if (error) {
        console.error("Upload error:", error.message);
        return NextResponse.json({ message: "File upload failed" }, { status: 500 });
      }

      const { data: publicUrlData } = supabase.storage.from("sabzlearn-bucket").getPublicUrl(filePath);
      src = publicUrlData.publicUrl;
    } else if (musicType === "link" && musicLink) {
      src = String(musicLink);
    } else {
      return NextResponse.json({ message: "Invalid music data" }, { status: 400 });
    }

    await prisma.music.create({
      data: {
        title: String(musicName),
        singerName: String(singerName),
        src,
        favorites: false,
        Folder: folderId ? { connect: { id: String(folderId) } } : undefined,
        User: { connect: { id: user.id } },
      },
    });

    return NextResponse.json({ message: "Music created successfully", src }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Unknown server internal error", err }, { status: 500 });
  }
}
