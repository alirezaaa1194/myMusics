"use client";

import { PrismaType } from "@/lib/prisma";
import { createContext, RefObject } from "react";

export type playbackModeType = "next" | "repeat-one" | "repeat-all" | "shuffle";

export type optionsType = {
  currentMusicId?: string;
  volume: number;
  filter: "name" | "dateAdded";
  sort: "Ascending" | "Descending";
  playbackMode: playbackModeType;
};

type globalContextValueType = {
  user: PrismaType.User | null;
  audio: RefObject<HTMLAudioElement | null>;
  search: string;
  setSearch: (value: string) => void;
  options: optionsType;
  setOptions: (options: optionsType) => void;
  play: boolean;
  setPlay: (play: boolean) => void;
  token: string;
};

const GlobalContext = createContext<globalContextValueType | null>(null);
export default GlobalContext;
