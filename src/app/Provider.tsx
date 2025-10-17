"use client";
import GlobalContext, { optionsType } from "@/contexts/globalContent";
import { PrismaType } from "@/lib/prisma";
import { QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/sonner";
import { getQueryClient } from "@/utils/getQueryClient";

const queryClient = getQueryClient();

function Provider({ user, token, children }: { user: PrismaType.User | null; token: string; children: React.ReactNode }) {
  const defaultOption: optionsType = {
    currentMusicId: undefined,
    volume: 50,
    filter: "name",
    sort: "Ascending",
    playbackMode: "next",
  };

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState<optionsType>(() => {
    if (typeof window !== "undefined") {
      const local = localStorage.getItem("options");

      if (local) {
        const localOptions = JSON.parse(local);
        return localOptions;
      }
    }
    return defaultOption;
  });
  const [play, setPlay] = useState(false);

  useEffect(() => {
    localStorage.setItem("options", JSON.stringify(options));
    if (audioRef.current) {
      audioRef.current.volume = options.volume / 100;
    }
  }, [options]);

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalContext
        value={{
          user,
          audio: audioRef,
          search,
          setSearch,
          options,
          setOptions,
          play,
          setPlay,
          token,
        }}
      >
        <Toaster position="top-right" richColors className="dark" />
        <audio
          ref={audioRef}
          onError={() => {
            toast.error("Not supported file!");
          }}
        ></audio>
        {children}
      </GlobalContext>
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
}

export default Provider;
