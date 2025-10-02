"use client";
import VolumeSliderComp from "./volumeSlider";
import { useCurrentMusic } from "@/hooks/useMusic";
import TimelineComp from "./timeline";
import PlaybackBtnComp from "./btns/playbackBtn";
import LikeBtnComp from "./btns/likeBtn";
import PlayBtnComp from "./btns/playBtn";
import TimeBtnComp from "./btns/timeBtn";
import PrevBtnComp from "./btns/prevBtn";
import NextBtnComp from "./btns/nextBtn";
import DesktopSkeletonComp from "./desktopSkeleton";

function DesktopTimelineComp() {
  const currentMusic = useCurrentMusic();

  if (currentMusic.isPending) {
    return <DesktopSkeletonComp />;
  }

  if (!currentMusic.data)
    return (
      <div className="hidden lg:flex items-center gap-12 px-8 py-5 h-[146px]">
        <h5 className="text-secondary2 w-full text-center ml-10">No music was found</h5>
      </div>
    );

  return (
    <div className="hidden lg:flex items-center gap-12 px-8 py-5">
      <div className="flex items-center gap-4 shrink-0 w-52">
        <span className="w-12 h-12 bg-main rounded-xl border border-border text-white flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path fillRule="evenodd" d="M19.952 1.651a.75.75 0 0 1 .298.599V16.303a3 3 0 0 1-2.176 2.884l-1.32.377a2.553 2.553 0 1 1-1.403-4.909l2.311-.66a1.5 1.5 0 0 0 1.088-1.442V6.994l-9 2.572v9.737a3 3 0 0 1-2.176 2.884l-1.32.377a2.553 2.553 0 1 1-1.402-4.909l2.31-.66a1.5 1.5 0 0 0 1.088-1.442V5.25a.75.75 0 0 1 .544-.721l10.5-3a.75.75 0 0 1 .658.122Z" clipRule="evenodd" />
          </svg>
        </span>
        <div className="flex flex-col gap-1 flex-1">
          <span className="text-white text-sm font-[500] line-clamp-1">{currentMusic?.data?.title ?? "loading..."}</span>
          <span className="text-secondary2 text-xs line-clamp-1">{currentMusic?.data?.singerName}</span>
        </div>
      </div>
      <div className="flex-1 h-full flex items-center gap-12">
        <div className="w-full flex flex-col gap-2">
          <TimelineComp />
          <div className="w-full flex items-center justify-center gap-4">
            <TimeBtnComp />
            <PrevBtnComp />
            <PlayBtnComp />
            <NextBtnComp />
            <PlaybackBtnComp />
            <LikeBtnComp />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 shrink-0 w-44">
        <VolumeSliderComp />
      </div>
    </div>
  );
}

export default DesktopTimelineComp;
