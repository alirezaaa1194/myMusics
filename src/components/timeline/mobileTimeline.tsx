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

function MobileTimelineComp() {
  const [open, setOpen] = useState(false);
  const currentMusic = useCurrentMusic();
  return (
    <div className="flex lg:hidden p-2.5 py-5">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4 shrink-0 cursor-pointer select-none" onClick={() => setOpen(true)}>
          <span className="w-12 h-12 bg-main rounded-xl border border-border text-white flex items-center justify-center">
            {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
          </svg> */}
            {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-7">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
            </svg> */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path fillRule="evenodd" d="M19.952 1.651a.75.75 0 0 1 .298.599V16.303a3 3 0 0 1-2.176 2.884l-1.32.377a2.553 2.553 0 1 1-1.403-4.909l2.311-.66a1.5 1.5 0 0 0 1.088-1.442V6.994l-9 2.572v9.737a3 3 0 0 1-2.176 2.884l-1.32.377a2.553 2.553 0 1 1-1.402-4.909l2.31-.66a1.5 1.5 0 0 0 1.088-1.442V5.25a.75.75 0 0 1 .544-.721l10.5-3a.75.75 0 0 1 .658.122Z" clipRule="evenodd" />
            </svg>
          </span>
          <div className="flex flex-col gap-1">
            <span className="text-white text-sm font-[500] max-w-[110px] line-clamp-1">{currentMusic?.title}</span>
            <span className="text-secondary2 text-xs max-w-[110px] line-clamp-1">{currentMusic?.singerName}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* <Button className="w-10 h-10 rounded-full cursor-pointer !bg-transparent text-white border border-border " id="prev-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
              <path d="M9.195 18.44c1.25.714 2.805-.189 2.805-1.629v-2.34l6.945 3.968c1.25.715 2.805-.188 2.805-1.628V8.69c0-1.44-1.555-2.343-2.805-1.628L12 11.029v-2.34c0-1.44-1.555-2.343-2.805-1.628l-7.108 4.061c-1.26.72-1.26 2.536 0 3.256l7.108 4.061Z" />
            </svg>
          </Button> */}
          {/* <Button className="w-12 h-12 rounded-full cursor-pointer" id="play-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
            </svg>
          </Button> */}
          {/* <Button className="w-10 h-10 rounded-full cursor-pointer !bg-transparent text-white border border-border " id="next-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
              <path d="M5.055 7.06C3.805 6.347 2.25 7.25 2.25 8.69v8.122c0 1.44 1.555 2.343 2.805 1.628L12 14.471v2.34c0 1.44 1.555 2.343 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256l-7.108-4.061C13.555 6.346 12 7.249 12 8.689v2.34L5.055 7.061Z" />
            </svg>
          </Button> */}
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
              <span className="text-white text-xl font-[500] line-clamp-1">{currentMusic?.title}</span>
              <span className="text-secondary2 text-sm line-clamp-1">{currentMusic?.singerName}</span>
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
