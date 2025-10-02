"use client";
import { PrismaType } from "@/lib/prisma";
import MusicItemComp from "./musicItem/musicItem";
import { useGetFavoritesMusics, useSort } from "@/hooks/useMusic";
import { useSearchStore } from "@/store/store";

function FavoritesComp() {
  const { data, isPending } = useGetFavoritesMusics();
  const sortHandler = useSort();

  const search = useSearchStore((state) => state.search);
  const desktopFilteredMusics: PrismaType.Music[] = (data?.musics || [])?.filter((musics: PrismaType.Music) => musics.title.toLowerCase().includes(String(search.toLowerCase())) || musics.singerName.toLowerCase().includes(String(search.toLowerCase())));
  const mobileFilteredMusics: PrismaType.Music[] = data?.musics;
  sortHandler(desktopFilteredMusics || []);
  sortHandler(mobileFilteredMusics || []);

  return (
    <>
      <div className="hidden lg:flex flex-col gap-2">{isPending ? "loading..." : desktopFilteredMusics?.length ? desktopFilteredMusics?.map((music) => <MusicItemComp key={music.id} music={music} />) : <h5 className="text-secondary2 mx-auto mt-16">No music was found</h5>}</div>
      <div className="flex lg:hidden flex-col gap-2">{isPending ? "loading..." : mobileFilteredMusics?.length ? mobileFilteredMusics?.map((music) => <MusicItemComp key={music.id} music={music} />) : <h5 className="text-secondary2 mx-auto mt-16">No music was found</h5>}</div>
    </>
  );
}

export default FavoritesComp;
