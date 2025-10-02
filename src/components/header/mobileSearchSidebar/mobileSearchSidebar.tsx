"use client";
import MusicItemComp from "@/components/musics/musicItem/musicItem";
import SearchBoxComp from "@/components/searchBox/searchBox";
import { Button } from "@/components/ui/button";
import GlobalContext from "@/contexts/globalContent";
import { useGetFavoritesMusics, useGetMusics, useSort } from "@/hooks/useMusic";
import { PrismaType } from "@/lib/prisma";
import { useSearchStore } from "@/store/store";
import { folderMusicOption } from "@/utils/options";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams, usePathname } from "next/navigation";
import { use, useCallback, useEffect } from "react";

function MobileSearchSidebarComp({ openSearchSidebar, setOpenSearchSidebar }: { openSearchSidebar: boolean; setOpenSearchSidebar: (value: boolean) => void }) {
  const pathname = usePathname();

  const handleSetOpen = useCallback(
    (value: boolean) => {
      setOpenSearchSidebar(value);
    },
    [setOpenSearchSidebar]
  );

  useEffect(() => {
    handleSetOpen(false);
  }, [pathname, handleSetOpen]);

  const globalContext = use(GlobalContext);
  const params = useParams();

  // const { data, isPending } = pathname === "/" ? useGetMusics() : pathname === "/favorites" ? useGetFavoritesMusics() : useSuspenseQuery(folderMusicOption(String(globalContext?.token), String(params.slug)));

  const musics = useGetMusics();
  const favorites = useGetFavoritesMusics();
  const folder = useSuspenseQuery(folderMusicOption(String(globalContext?.token), String(params.slug)));

  let data, isPending;

  if (pathname === "/") {
    data = musics.data;
    isPending = musics.isPending;
  } else if (pathname === "/favorites") {
    data = favorites.data;
    isPending = favorites.isPending;
  } else {
    data = folder.data;
    isPending = folder.isPending;
  }

  const search = useSearchStore((state) => state.search);
  const sortHandler = useSort();
  const filteredMusics: PrismaType.Music[] = (data?.musics || [])?.filter((musics: PrismaType.Music) => musics.title.toLowerCase().includes(String(search.toLowerCase())) || musics.singerName.toLowerCase().includes(String(search.toLowerCase())));
  sortHandler(filteredMusics || []);

  return (
    <div className={`lg:hidden w-full h-[calc(100%-88px)] bg-main fixed z-50 top-0 transition-all ${openSearchSidebar ? "left-0" : "-left-full"}`}>
      <header className="w-full p-2.5 py-5 flex items-center justify-between gap-2.5 border-b border-b-border">
        <SearchBoxComp />
        <Button className="w-10 h-10 rounded-lg bg-surface hover:bg-surface/80 cursor-pointer" onClick={() => setOpenSearchSidebar(false)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-secondary2 shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </Button>
      </header>
      <main className="w-full h-[calc(100%-81px)] flex justify-center p-2.5">
        {isPending ? (
          "pending"
        ) : filteredMusics.length ? (
          <div className="w-full flex flex-col gap-2">
            {filteredMusics?.map((music, i) => (
              <MusicItemComp key={i} music={music} />
            ))}
          </div>
        ) : (
          <h5 className="text-secondary2 my-auto">No music was found</h5>
        )}
      </main>
    </div>
  );
}

export default MobileSearchSidebarComp;
