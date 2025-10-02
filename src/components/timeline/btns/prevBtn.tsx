import { setOption } from "@/actions/options";
import { Button } from "@/components/ui/button";
import GlobalContext from "@/contexts/globalContent";
import { useCurrentMusic, useGetMusics, useSort } from "@/hooks/useMusic";
import { PrismaType } from "@/lib/prisma";
import React, { use } from "react";

function PrevBtnComp({ className }: { className?: string }) {
  const globalContext = use(GlobalContext);
  const musics = useGetMusics();
  const currentMusic = useCurrentMusic();
  const sortHandler = useSort();

  const prevMusicHandler = () => {
    const allMusics = musics.data.musics;
    sortHandler(allMusics);
    // if (globalContext?.options?.filter === "name") {
    //   if (globalContext?.options?.sort === "Ascending") {
    //     allMusics.sort((a: PrismaType.Music, b: PrismaType.Music) => a.title.localeCompare(b.title));
    //   } else if (globalContext?.options?.sort === "Descending") {
    //     allMusics.sort((a: PrismaType.Music, b: PrismaType.Music) => b.title.localeCompare(a.title));
    //   }
    // } else if (globalContext?.options?.filter === "dateAdded") {
    //   if (globalContext?.options?.sort === "Ascending") {
    //     allMusics.sort((a: PrismaType.Music, b: PrismaType.Music) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    //   } else if (globalContext?.options?.sort === "Descending") {
    //     allMusics.sort((a: PrismaType.Music, b: PrismaType.Music) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    //   }
    // }
    const currentMusicIndex = allMusics.findIndex((music: PrismaType.Music) => music.id === currentMusic.id);
    const newMusicIndex = currentMusicIndex === 0 ? allMusics.length - 1 : currentMusicIndex - 1;
    globalContext?.audio.current?.setAttribute("src", allMusics[newMusicIndex].src);
    globalContext?.audio.current?.play();
    globalContext?.setOptions({ ...globalContext.options, currentMusicId: allMusics[newMusicIndex].id });
    globalContext?.setPlay(true);
    if (globalContext?.options) {
      setOption({ ...globalContext?.options, currentMusicId: allMusics[newMusicIndex].id });
    }
  };
  return (
    <Button className={`${className ? className : "w-12 h-12 rounded-full cursor-pointer"}`} id="prev-btn" onClick={prevMusicHandler}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="size-5 text-secondary" fill="currentColor">
        <path d="M491 100.8C478.1 93.8 462.3 94.5 450 102.6L192 272.1L192 128C192 110.3 177.7 96 160 96C142.3 96 128 110.3 128 128L128 512C128 529.7 142.3 544 160 544C177.7 544 192 529.7 192 512L192 367.9L450 537.5C462.3 545.6 478 546.3 491 539.3C504 532.3 512 518.8 512 504.1L512 136.1C512 121.4 503.9 107.9 491 100.9z" />
      </svg>
    </Button>
  );
}

export default PrevBtnComp;
