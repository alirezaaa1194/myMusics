"use client";
import { use, useEffect } from "react";
import { Button } from "../../ui/button";
import GlobalContext from "@/contexts/globalContent";
import { useGetMusics, useSort } from "@/hooks/useMusic";
import { PrismaType } from "@/lib/prisma";
import { setOption } from "@/utils/saveOptions";

const PlaybackBtnComp = ({ className }: { className?: string }) => {
  const globalContext = use(GlobalContext);
  const { data: playlist } = useGetMusics();
  const currentMusicId = globalContext?.options?.currentMusicId;
  const sortHandler = useSort();
  const audioElem = globalContext?.audio.current;
  const { audio, options, setPlay, setOptions } = globalContext ?? {};
  useEffect(() => {
    if (!audioElem) return;

    const handleEnded = () => {
      sortHandler(playlist.musics);

      switch (globalContext?.options?.playbackMode) {
        case "next": {
          const currentMusicIndex = playlist.musics.findIndex((music: PrismaType.Music) => music.id === currentMusicId);
          if (currentMusicIndex === playlist.musics.length - 1) {
            globalContext.setPlay(false);
            audioElem.pause();
            break;
          } else {
            const newMusicIndex = currentMusicIndex === playlist.musics.length - 1 ? 0 : currentMusicIndex + 1;
            const newMusic: PrismaType.Music = playlist.musics[newMusicIndex];
            globalContext.setOptions({ ...globalContext.options, currentMusicId: newMusic.id });
            globalContext.setPlay(true);
            setOption({ ...globalContext.options, currentMusicId: newMusic.id });
            audioElem.setAttribute("src", newMusic.src);
            audioElem.play();
            break;
          }
        }
        case "shuffle": {
          const newMusic: PrismaType.Music = playlist.musics.filter((music: PrismaType.Music) => music.id !== currentMusicId).sort(() => 0.5 - Math.random())[0];
          globalContext.setOptions({ ...globalContext.options, currentMusicId: newMusic.id });
          globalContext.setPlay(true);
          setOption({ ...globalContext.options, currentMusicId: newMusic.id });
          audioElem.setAttribute("src", newMusic.src);
          audioElem.play();
          break;
        }
        case "repeat-one": {
          globalContext.setPlay(true);
          audioElem.play();
          break;
        }
        case "repeat-all": {
          const currentMusicIndex = playlist.musics.findIndex((music: PrismaType.Music) => music.id === currentMusicId);
          const newMusicIndex = currentMusicIndex === playlist.musics.length - 1 ? 0 : currentMusicIndex + 1;
          const newMusic: PrismaType.Music = playlist.musics[newMusicIndex];
          globalContext.setOptions({ ...globalContext.options, currentMusicId: newMusic.id });
          globalContext.setPlay(true);
          setOption({ ...globalContext.options, currentMusicId: newMusic.id });
          audioElem.setAttribute("src", newMusic.src);
          audioElem.play();
          break;
        }
      }
    };

    const handleError = () => {
      const allMusics = playlist.musics;
      sortHandler(allMusics);

      const currentMusicIndex = allMusics.findIndex((music: PrismaType.Music) => music.id === currentMusicId);
      const newMusicIndex = currentMusicIndex === allMusics.length - 1 ? 0 : currentMusicIndex + 1;
      globalContext?.audio.current?.setAttribute("src", allMusics[newMusicIndex].src);
      globalContext?.audio.current?.play();
      globalContext?.setOptions({ ...globalContext.options, currentMusicId: allMusics[newMusicIndex].id });
      globalContext?.setPlay(true);
      setOption({ ...globalContext?.options, currentMusicId: allMusics[newMusicIndex].id });
    };

    audioElem.addEventListener("ended", handleEnded);
    audioElem.addEventListener("error", handleError);

    return () => {
      audioElem.removeEventListener("ended", handleEnded);
      audioElem.removeEventListener("error", handleError);
    };
  }, [audio, playlist, currentMusicId, options?.playbackMode, options?.filter, options?.sort, setPlay, setOptions, sortHandler]);

  const playbackHandler = () => {
    switch (globalContext?.options?.playbackMode) {
      case "next": {
        globalContext.setOptions({ ...globalContext.options, playbackMode: "shuffle" });
        setOption({ ...globalContext.options, playbackMode: "shuffle" });
        break;
      }
      case "shuffle": {
        globalContext.setOptions({ ...globalContext.options, playbackMode: "repeat-one" });
        setOption({ ...globalContext.options, playbackMode: "repeat-one" });
        break;
      }
      case "repeat-one": {
        globalContext.setOptions({ ...globalContext.options, playbackMode: "repeat-all" });
        setOption({ ...globalContext.options, playbackMode: "repeat-all" });
        break;
      }
      case "repeat-all": {
        globalContext.setOptions({ ...globalContext.options, playbackMode: "next" });
        setOption({ ...globalContext.options, playbackMode: "next" });
        break;
      }
    }
  };
  const playBackMode = globalContext?.options?.playbackMode;

  return (
    <Button className={`${className ? className : "w-12 h-12 rounded-full cursor-pointer ml-2"}`} id="playback-btn" onClick={playbackHandler}>
      {playBackMode === "next" ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      ) : playBackMode === "shuffle" ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="size-6 text-secondary" fill="currentColor">
          <path d="M467.8 98.4C479.8 93.4 493.5 96.2 502.7 105.3L566.7 169.3C572.7 175.3 576.1 183.4 576.1 191.9C576.1 200.4 572.7 208.5 566.7 214.5L502.7 278.5C493.5 287.7 479.8 290.4 467.8 285.4C455.8 280.4 448 268.9 448 256L448 224L416 224C405.9 224 396.4 228.7 390.4 236.8L358 280L318 226.7L339.2 198.4C357.3 174.2 385.8 160 416 160L448 160L448 128C448 115.1 455.8 103.4 467.8 98.4zM218 360L258 413.3L236.8 441.6C218.7 465.8 190.2 480 160 480L96 480C78.3 480 64 465.7 64 448C64 430.3 78.3 416 96 416L160 416C170.1 416 179.6 411.3 185.6 403.2L218 360zM502.6 534.6C493.4 543.8 479.7 546.5 467.7 541.5C455.7 536.5 448 524.9 448 512L448 480L416 480C385.8 480 357.3 465.8 339.2 441.6L185.6 236.8C179.6 228.7 170.1 224 160 224L96 224C78.3 224 64 209.7 64 192C64 174.3 78.3 160 96 160L160 160C190.2 160 218.7 174.2 236.8 198.4L390.4 403.2C396.4 411.3 405.9 416 416 416L448 416L448 384C448 371.1 455.8 359.4 467.8 354.4C479.8 349.4 493.5 352.2 502.7 361.3L566.7 425.3C572.7 431.3 576.1 439.4 576.1 447.9C576.1 456.4 572.7 464.5 566.7 470.5L502.7 534.5z" />
        </svg>
      ) : playBackMode === "repeat-one" ? (
        <svg width="228px" height="228px" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" className="size-8 text-secondary" fill="currentColor">
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <g fillRule="evenodd">
              <path d="M109.533 197.602a1.887 1.887 0 0 1-.034 2.76l-7.583 7.066a4.095 4.095 0 0 1-5.714-.152l-32.918-34.095c-1.537-1.592-1.54-4.162-.002-5.746l33.1-34.092c1.536-1.581 4.11-1.658 5.74-.18l7.655 6.94c.82.743.833 1.952.02 2.708l-21.11 19.659s53.036.129 71.708.064c18.672-.064 33.437-16.973 33.437-34.7 0-7.214-5.578-17.64-5.578-17.64-.498-.99-.273-2.444.483-3.229l8.61-8.94c.764-.794 1.772-.632 2.242.364 0 0 9.212 18.651 9.212 28.562 0 28.035-21.765 50.882-48.533 50.882-26.769 0-70.921.201-70.921.201l20.186 19.568z"></path> <path d="M144.398 58.435a1.887 1.887 0 0 1 .034-2.76l7.583-7.066a4.095 4.095 0 0 1 5.714.152l32.918 34.095c1.537 1.592 1.54 4.162.002 5.746l-33.1 34.092c-1.536 1.581-4.11 1.658-5.74.18l-7.656-6.94c-.819-.743-.832-1.952-.02-2.708l21.111-19.659s-53.036-.129-71.708-.064c-18.672.064-33.437 16.973-33.437 34.7 0 7.214 5.578 17.64 5.578 17.64.498.99.273 2.444-.483 3.229l-8.61 8.94c-.764.794-1.772.632-2.242-.364 0 0-9.212-18.65-9.212-28.562 0-28.035 21.765-50.882 48.533-50.882 26.769 0 70.921-.201 70.921-.201l-20.186-19.568z"></path> <path d="M127.992 104.543l6.53.146c1.105.025 2.013.945 2.027 2.037l.398 30.313a1.97 1.97 0 0 0 2.032 1.94l4.104-.103a1.951 1.951 0 0 1 2.01 1.958l.01 4.838a2.015 2.015 0 0 1-1.99 2.024l-21.14.147a1.982 1.982 0 0 1-1.994-1.983l-.002-4.71c0-1.103.897-1.997 1.996-1.997h4.254a2.018 2.018 0 0 0 2.016-1.994l.169-16.966-6.047 5.912-6.118-7.501 11.745-14.061z" stroke="#979797"></path>
            </g>
          </g>
        </svg>
      ) : playBackMode === "repeat-all" ? (
        <svg width="228px" height="228px" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" className="size-8 text-secondary" fill="currentColor">
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <g fillRule="evenodd">
              <path d="M109.533 197.602a1.887 1.887 0 0 1-.034 2.76l-7.583 7.066a4.095 4.095 0 0 1-5.714-.152l-32.918-34.095c-1.537-1.592-1.54-4.162-.002-5.746l33.1-34.092c1.536-1.581 4.11-1.658 5.74-.18l7.655 6.94c.82.743.833 1.952.02 2.708l-21.11 19.659s53.036.129 71.708.064c18.672-.064 33.437-16.973 33.437-34.7 0-7.214-5.578-17.64-5.578-17.64-.498-.99-.273-2.444.483-3.229l8.61-8.94c.764-.794 1.772-.632 2.242.364 0 0 9.212 18.651 9.212 28.562 0 28.035-21.765 50.882-48.533 50.882-26.769 0-70.921.201-70.921.201l20.186 19.568z"></path> <path d="M144.398 58.435a1.887 1.887 0 0 1 .034-2.76l7.583-7.066a4.095 4.095 0 0 1 5.714.152l32.918 34.095c1.537 1.592 1.54 4.162.002 5.746l-33.1 34.092c-1.536 1.581-4.11 1.658-5.74.18l-7.656-6.94c-.819-.743-.832-1.952-.02-2.708l21.111-19.659s-53.036-.129-71.708-.064c-18.672.064-33.437 16.973-33.437 34.7 0 7.214 5.578 17.64 5.578 17.64.498.99.273 2.444-.483 3.229l-8.61 8.94c-.764.794-1.772.632-2.242-.364 0 0-9.212-18.65-9.212-28.562 0-28.035 21.765-50.882 48.533-50.882 26.769 0 70.921-.201 70.921-.201l-20.186-19.568z"></path>
            </g>
          </g>
        </svg>
      ) : null}
    </Button>
  );
};
export default PlaybackBtnComp;
