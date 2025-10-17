"use client";
import { PrismaType } from "@/lib/prisma";
import MusicItemComp from "./musicItem/musicItem";
import { use } from "react";
import GlobalContext from "@/contexts/globalContent";
import { useSort } from "@/hooks/useMusic";
import { useSearchStore } from "@/store/store";
import { useQuery } from "@tanstack/react-query";
import { folderMusicOption } from "@/utils/options";
import { useParams } from "next/navigation";
import SkeletonListComp from "./skeletonList";

function FolderMusicsComp() {
  const globalContext = use(GlobalContext);
  const params = useParams();
  const { data, isPending } = useQuery(folderMusicOption(String(globalContext?.token), String(params.slug)));
  const sortHandler = useSort();

  const search = useSearchStore((state) => state.search);
  const desktopFilteredMusics: PrismaType.Music[] = data?.musics?.filter((musics: PrismaType.Music) => musics.title.toLowerCase().includes(String(search.toLowerCase())) || musics.singerName.toLowerCase().includes(String(search.toLowerCase())));
  const mobileFilteredMusics: PrismaType.Music[] = data?.musics;
  sortHandler(desktopFilteredMusics || []);
  sortHandler(mobileFilteredMusics || []);

  return (
    <>
      <div className="hidden lg:flex flex-col gap-2">{isPending ? <SkeletonListComp /> : desktopFilteredMusics?.length ? desktopFilteredMusics?.map((music) => <MusicItemComp key={music.id + "desktop"} music={music} />) : <h5 className="text-secondary2 mx-auto mt-16">No music was found</h5>}</div>
      <div className="flex lg:hidden flex-col gap-2">{isPending ? <SkeletonListComp /> : desktopFilteredMusics?.length ? mobileFilteredMusics?.map((music) => <MusicItemComp key={music.id + "mobile"} music={music} />) : <h5 className="text-secondary2 mx-auto mt-16">No music was found</h5>}</div>
    </>
  );
}

export default FolderMusicsComp;
