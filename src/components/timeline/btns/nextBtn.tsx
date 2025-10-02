import { setOption } from "@/actions/options";
import { Button } from "@/components/ui/button";
import GlobalContext from "@/contexts/globalContent";
import { useCurrentMusic, useGetMusics, useSort } from "@/hooks/useMusic";
import { PrismaType } from "@/lib/prisma";
import { use } from "react";

function NextBtnComp({ className }: { className?: string }) {
  const globalContext = use(GlobalContext);
  const musics = useGetMusics();
  const currentMusic = useCurrentMusic();
  const sortHandler = useSort();

  const nextMusicHandler = async () => {
    const allMusics = musics.data.musics;

    sortHandler(allMusics);
    // if (globalContext?.options.filter === "name") {
    //   if (globalContext?.options.sort === "Ascending") {
    //     allMusics.sort((a: PrismaType.Music, b: PrismaType.Music) => a.title.localeCompare(b.title));
    //   } else if (globalContext?.options.sort === "Descending") {
    //     allMusics.sort((a: PrismaType.Music, b: PrismaType.Music) => b.title.localeCompare(a.title));
    //   }
    // } else if (globalContext?.options.filter === "dateAdded") {
    //   if (globalContext?.options.sort === "Ascending") {
    //     allMusics.sort((a: PrismaType.Music, b: PrismaType.Music) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    //   } else if (globalContext?.options.sort === "Descending") {
    //     allMusics.sort((a: PrismaType.Music, b: PrismaType.Music) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    //   }
    // }
    const currentMusicIndex = allMusics.findIndex((music: PrismaType.Music) => music.id === currentMusic.id);
    if (globalContext?.options.playbackMode === "shuffle") {
      const newMusic: PrismaType.Music = allMusics.filter((music: PrismaType.Music) => music.id !== currentMusic?.id).sort(() => 0.5 - Math.random())[0];
      globalContext.setOptions({ ...globalContext.options, currentMusicId: newMusic.id });
      globalContext.setPlay(true);
      setOption({ ...globalContext.options, currentMusicId: newMusic.id });
      globalContext.audio.current?.setAttribute("src", newMusic.src);
      globalContext.audio.current?.play();
    } else {
      const newMusicIndex = currentMusicIndex === allMusics.length - 1 ? 0 : currentMusicIndex + 1;
      globalContext?.audio.current?.setAttribute("src", allMusics[newMusicIndex].src);
      globalContext?.audio.current?.play();
      globalContext?.setOptions({ ...globalContext.options, currentMusicId: allMusics[newMusicIndex].id });
      globalContext?.setPlay(true);
      if (globalContext?.options) {
        setOption({ ...globalContext?.options, currentMusicId: allMusics[newMusicIndex].id });
      }
    }
  };
  return (
    <Button className={`${className ? className : "w-12 h-12 rounded-full cursor-pointer"}`} id="next-btn" onClick={nextMusicHandler}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="size-5 text-secondary" fill="currentColor">
        {/*!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.*/}
        <path d="M149 100.8C161.9 93.8 177.7 94.5 190 102.6L448 272.1L448 128C448 110.3 462.3 96 480 96C497.7 96 512 110.3 512 128L512 512C512 529.7 497.7 544 480 544C462.3 544 448 529.7 448 512L448 367.9L190 537.5C177.7 545.6 162 546.3 149 539.3C136 532.3 128 518.7 128 504L128 136C128 121.3 136.1 107.8 149 100.8z" />
      </svg>
    </Button>
  );
}

export default NextBtnComp;
