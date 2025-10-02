"use client";
import React, { useState } from "react";
import { Drawer, DrawerContent, DrawerFooter } from "../ui/drawer";
import { useCurrentMusic } from "@/hooks/useMusic";
import TimelineComp from "./timeline";
import LikeBtnComp from "./btns/likeBtn";
import PrevBtnComp from "./btns/prevBtn";
import PlayBtnComp from "./btns/playBtn";
import NextBtnComp from "./btns/nextBtn";
import PlaybackBtnComp from "./btns/playbackBtn";
import TimeBtnComp from "./btns/timeBtn";
import MobileSkeletonComp from "./mobileSkeleton";

function MobileTimelineComp() {
  const [open, setOpen] = useState(false);
  const currentMusic = useCurrentMusic();

  if (currentMusic.isPending) {
    return <MobileSkeletonComp />;
  }

  if (!currentMusic.data)
    return (
      <div className="flex lg:hidden items-center gap-12 px-8 py-5 h-[88px]">
        <h6 className="text-secondary2 w-full text-center">No music was found</h6>
      </div>
    );

  return (
    <div className="flex lg:hidden p-2.5 py-5">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4 shrink-0 cursor-pointer select-none" onClick={() => setOpen(true)}>
          <span className="w-12 h-12 bg-main rounded-xl border border-border text-white flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path fillRule="evenodd" d="M19.952 1.651a.75.75 0 0 1 .298.599V16.303a3 3 0 0 1-2.176 2.884l-1.32.377a2.553 2.553 0 1 1-1.403-4.909l2.311-.66a1.5 1.5 0 0 0 1.088-1.442V6.994l-9 2.572v9.737a3 3 0 0 1-2.176 2.884l-1.32.377a2.553 2.553 0 1 1-1.402-4.909l2.31-.66a1.5 1.5 0 0 0 1.088-1.442V5.25a.75.75 0 0 1 .544-.721l10.5-3a.75.75 0 0 1 .658.122Z" clipRule="evenodd" />
            </svg>
          </span>
          <div className="flex flex-col gap-1">
            <span className="text-white text-sm font-[500] max-w-[110px] line-clamp-1">{currentMusic?.data?.title}</span>
            <span className="text-secondary2 text-xs max-w-[110px] line-clamp-1">{currentMusic?.data?.singerName}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <PrevBtnComp className="w-10 h-10 !bg-transparent [&>svg]:text-white border border-border active:border-accent rounded-full cursor-pointer" />
          <PlayBtnComp className="w-12 h-12 !bg-transparent [&>svg]:text-white border border-border active:border-accent rounded-full cursor-pointer" />
          <NextBtnComp className="w-10 h-10 !bg-transparent [&>svg]:text-white border border-border active:border-accent rounded-full cursor-pointer" />
        </div>
      </div>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="!h-dvh !max-h-dvh !bg-main dark p-2.5 pt-0">
          <div className="flex flex-col items-center justify-center gap-6  h-full pt-4">
            <div className="w-[250px] max-w-full aspect-square rounded-xl bg-border flex items-center justify-center text-secondary2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-36">
                <path fillRule="evenodd" d="M19.952 1.651a.75.75 0 0 1 .298.599V16.303a3 3 0 0 1-2.176 2.884l-1.32.377a2.553 2.553 0 1 1-1.403-4.909l2.311-.66a1.5 1.5 0 0 0 1.088-1.442V6.994l-9 2.572v9.737a3 3 0 0 1-2.176 2.884l-1.32.377a2.553 2.553 0 1 1-1.402-4.909l2.31-.66a1.5 1.5 0 0 0 1.088-1.442V5.25a.75.75 0 0 1 .544-.721l10.5-3a.75.75 0 0 1 .658.122Z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex flex-col gap-1 text-center">
              <span className="text-white text-xl font-[500] line-clamp-1">{currentMusic?.data?.title}</span>
              <span className="text-secondary2 text-sm line-clamp-1">{currentMusic?.data?.singerName}</span>
            </div>
          </div>
          <DrawerFooter className="pb-14">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 pb-4 self-end">
                <TimeBtnComp className="w-10 h-10 rounded-full cursor-pointer !bg-transparent [&>svg]:text-white active:[&>svg]:text-accent" />
              </div>
              <TimelineComp />
              <div className="flex items-center justify-between mt-4">
                <LikeBtnComp />
                <div className="w-full flex items-center justify-center gap-4">
                  <PrevBtnComp className="w-14 h-14 !bg-transparent [&>svg]:text-white border border-border active:border-accent rounded-full cursor-pointer" />
                  <PlayBtnComp className="w-16 h-16 !bg-transparent [&>svg]:text-white border border-border active:border-accent rounded-full cursor-pointer" />
                  <NextBtnComp className="w-14 h-14 !bg-transparent [&>svg]:text-white border border-border active:border-accent rounded-full cursor-pointer" />
                </div>
                <PlaybackBtnComp className="w-12 h-12 rounded-full cursor-pointer !bg-transparent [&>svg]:text-white active:text-accent" />
              </div>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default MobileTimelineComp;
