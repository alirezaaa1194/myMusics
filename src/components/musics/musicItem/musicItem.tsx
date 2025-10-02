"use client";
import { PrismaType } from "@/lib/prisma";
import OptionComp from "./option/option";
import { use } from "react";
import GlobalContext from "@/contexts/globalContent";
import { setOption } from "@/actions/options";

function MusicItemComp({ music }: { music: PrismaType.Music }) {
  const globalContext = use(GlobalContext);

  const playMusicHandler = async () => {
    if (globalContext) {
      globalContext?.audio?.current?.setAttribute("src", music?.src);
      globalContext?.audio?.current?.play();
      globalContext.setPlay(true);

      globalContext?.setOptions({
        ...globalContext.options,
        currentMusicId: music.id,
      });
      setOption({
        ...globalContext.options,
        currentMusicId: music.id,
      });
    }
  };

  return (
    <div className={`flex items-center justify-between gap-10 ${globalContext?.options?.currentMusicId === music.id ? "bg-surface/60" : "bg-surface"} rounded-lg px-3 py-1 border border-border`}>
      <div className="flex items-center gap-4 w-full cursor-pointer" onClick={playMusicHandler}>
        <span className="w-12 h-12 bg-main rounded-xl border border-border text-white flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path fillRule="evenodd" d="M19.952 1.651a.75.75 0 0 1 .298.599V16.303a3 3 0 0 1-2.176 2.884l-1.32.377a2.553 2.553 0 1 1-1.403-4.909l2.311-.66a1.5 1.5 0 0 0 1.088-1.442V6.994l-9 2.572v9.737a3 3 0 0 1-2.176 2.884l-1.32.377a2.553 2.553 0 1 1-1.402-4.909l2.31-.66a1.5 1.5 0 0 0 1.088-1.442V5.25a.75.75 0 0 1 .544-.721l10.5-3a.75.75 0 0 1 .658.122Z" clipRule="evenodd" />
          </svg>
        </span>
        <div className="flex flex-col gap-1">
          <span className="text-white text-sm font-[500] line-clamp-1">{music.title}</span>
          <span className="text-secondary2 text-xs line-clamp-1">{music.singerName}</span>
        </div>
      </div>
      <div className="flex items-center gap-10 shrink-0">
        <OptionComp music={music} />
      </div>
    </div>
  );
}

export default MusicItemComp;
