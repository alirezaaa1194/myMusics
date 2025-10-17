import { prisma, PrismaType } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";
import { createClient } from "@supabase/supabase-js";

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

// export async function PUT(req: NextRequest, ctx: RouteContext<"/api/music/[slug]">) {
//   const { slug } = await ctx.params;
//   const userToken = req.headers.get("authorization");
//   const reqBody = await req.json();

//   const secret = new TextEncoder().encode(process.env.JWT_SECRET);
//   const verifyToken = await jose.jwtVerify(String(userToken), secret);
//   const userEmail = verifyToken.payload.email;

//   const user: PrismaType.User | null = await prisma.user.findUnique({
//     where: { email: String(userEmail) },
//   });

//   if (!user) {
//     return NextResponse.json(
//       { message: "You dont have accees to this route!" },
//       {
//         status: 401,
//       }
//     );
//   }

//   const music = await prisma.music.findUnique({
//     where: {
//       id: slug,
//       userId: user.id,
//     },
//   });

//   if (!music) {
//     return NextResponse.json({ message: "Not found or unauthorized" }, { status: 404 });
//   }

//   try {
//     await prisma.music.update({ where: { userId: user.id, id: slug }, data: { title: reqBody.musicName, singerName: reqBody.singerName, src: reqBody.musicLink, favorites: music.favorites } });
//     return NextResponse.json({ message: `Music ${music.favorites ? "removed from" : "added to"} favorites successfully!` }, { status: 200 });
//   } catch (err) {
//     return NextResponse.json({ err }, { status: 500 });
//   }
// }

export async function PUT(req: NextRequest, ctx: RouteContext<"/api/music/[slug]">) {
  const { slug } = await ctx.params;
  const userToken = req.headers.get("authorization");

  // از FormData استفاده می‌کنیم تا فایل‌ها هم پشتیبانی شوند
  const formData = await req.formData();

  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  const musicType = formData.get("musicType");
  const musicName = formData.get("musicName");
  const singerName = formData.get("singerName");
  const musicLink = formData.get("musicLink");
  const musicFile = formData.get("musicFile") as File | null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const verifyToken = await jose.jwtVerify(String(userToken), secret);
    const userEmail = verifyToken.payload.email;

    const user: PrismaType.User | null = await prisma.user.findUnique({
      where: { email: String(userEmail) },
    });

    if (!user) {
      return NextResponse.json({ message: "You dont have access to this route!" }, { status: 401 });
    }

    const music = await prisma.music.findUnique({
      where: { id: slug },
    });

    if (!music || music.userId !== user.id) {
      return NextResponse.json({ message: "Not found or unauthorized" }, { status: 404 });
    }

    // مدیریت آپلود فایل در صورت انتخاب نوع file
    let src = music.src; // پیش فرض src همان src قبلی
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
    }

    await prisma.music.update({
      where: { id: slug },
      data: {
        title: String(musicName),
        singerName: String(singerName),
        src,
        favorites: music.favorites,
      },
    });

    return NextResponse.json({ message: "Music updated successfully", src }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Unknown server internal error", err }, { status: 500 });
  }
}
