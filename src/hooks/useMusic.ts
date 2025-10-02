"use client";
import { setOption } from "@/actions/options";
import GlobalContext from "@/contexts/globalContent";
import { PrismaType } from "@/lib/prisma";
import { uploadFormSchema } from "@/utils/formSchema";
import { favoritesMusicsOption, musicsOption } from "@/utils/options";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { use } from "react";
import { toast } from "sonner";
import z from "zod";

export function useGetMusics() {
  const globalContext = use(GlobalContext);
  return useQuery(musicsOption(String(globalContext?.token)));
}

export function useGetFavoritesMusics() {
  const globalContext = use(GlobalContext);
  return useQuery(favoritesMusicsOption(String(globalContext?.token)));
}

export function useCurrentMusic(): {
  data: PrismaType.Music;
  isPending: boolean;
} {
  const globalContext = use(GlobalContext);
  const musics = useQuery(musicsOption(String(globalContext?.token)));
  const currentMusic = musics.data?.musics?.find((music: PrismaType.Music) => music.id === globalContext?.options.currentMusicId);

  return {
    data: currentMusic,
    isPending: musics.isPending,
  };
}

export function useLike(id: string) {
  const globalContext = use(GlobalContext);
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/music/favorites/${id}`, {
        method: "POST",
        headers: {
          Authorization: String(globalContext?.token),
        },
      });
      return res;
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["musics"] });
      await queryClient.cancelQueries({ queryKey: ["favorites-musics"] });
      const previousMusics = queryClient.getQueryData(["musics"]);
      const previousFavoritesMusics = queryClient.getQueryData(["favorites-musics"]);

      queryClient.setQueryData(["musics"], (oldData?: { musics: PrismaType.Music[] }) => {
        if (!oldData) return { musics: [] };

        return {
          ...oldData,
          musics: oldData.musics.map((m) => (m.id === id ? { ...m, favorites: !m.favorites } : m)),
        };
      });

      queryClient.setQueryData(["favorites-musics"], (oldData?: { musics: PrismaType.Music[] }) => {
        if (!oldData) return { musics: [] };

        return {
          ...oldData,
          musics: oldData.musics.filter((m) => m.id !== id),
        };
      });

      return { previousMusics, previousFavoritesMusics };
    },

    onError: (err, variables, context) => {
      toast.error("Failed to like music!");
      if (context?.previousMusics) {
        queryClient.setQueryData(["musics"], context.previousMusics);
      }
      if (context?.previousFavoritesMusics) {
        queryClient.setQueryData(["favorites-musics"], context.previousFavoritesMusics);
      }
    },

    onSuccess: async (res) => {
      const response = await res.json();
      if (res.status === 200) {
        toast.success(response.message);
        queryClient.invalidateQueries({ queryKey: ["musics"] });
        queryClient.invalidateQueries({ queryKey: ["favorites-musics"] });
      }
    },
  });
  return updateMutation;
}

export function useDelete(id: string) {
  const globalContext = use(GlobalContext);
  const queryClient = useQueryClient();
  const musics = useGetMusics();
  const currentMusic = useCurrentMusic();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/music/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: String(globalContext?.token),
        },
      });
      return res;
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["musics"] });
      const previousMusics = queryClient.getQueryData(["musics"]);

      queryClient.setQueryData(["musics"], (oldData?: { musics: PrismaType.Music[] }) => {
        if (!oldData) return { musics: [] };

        return {
          ...oldData,
          musics: oldData.musics.filter((m) => m.id !== id),
        };
      });

      if (currentMusic.data.id === id) {
        const allMusics = musics.data.musics;
        const currentMusicIndex = allMusics.findIndex((music: PrismaType.Music) => music.id === currentMusic?.data?.id);
        if (globalContext?.options.playbackMode === "shuffle") {
          const newMusic: PrismaType.Music = allMusics.filter((music: PrismaType.Music) => music.id !== currentMusic?.data?.id).sort(() => 0.5 - Math.random())[0];
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
      }

      return { previousMusics };
    },

    onError: (err, variables, context) => {
      toast.error("Failed to delete music!");
      queryClient.setQueryData(["musics"], context?.previousMusics);
    },

    onSuccess: (res) => {
      if (res.status === 200) {
        toast.success("Music deleted successfully!");
        queryClient.invalidateQueries({ queryKey: ["musics"] });
      }
    },
  });

  return deleteMutation;
}

export function useCreate() {
  const globalContext = use(GlobalContext);
  const queryClient = useQueryClient();
  const params = useParams();

  const createMutation = useMutation({
    mutationFn: (newMusic) => {
      return fetch("/api/music", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: String(globalContext?.token),
        },
        body: JSON.stringify({ ...newMusic, folderId: params?.slug || null }),
      });
    },

    onMutate: async (newMusic: z.infer<typeof uploadFormSchema>) => {
      await queryClient.cancelQueries({ queryKey: ["musics"] });
      const previousMusics = queryClient.getQueryData(["musics"]);

      queryClient.setQueryData(["musics"], (oldData?: { musics: PrismaType.Music[] }) => {
        if (!oldData) return { musics: [] };

        return {
          ...oldData,
          musics: [
            ...oldData.musics,
            {
              title: newMusic.musicName,
              src: newMusic.musicType === "link" ? newMusic.musicLink : newMusic.musicFile,
              singerName: newMusic.singerName,
              favorites: false,
            },
          ],
        };
      });

      return { previousMusics };
    },

    onError: (err, variables, context) => {
      toast.error("Failed to create music!");
      queryClient.setQueryData(["musics"], context?.previousMusics);
    },

    onSuccess: (res) => {
      if (res.status === 201) {
        toast.success("Music created successfully");
        queryClient.invalidateQueries({ queryKey: ["musics"] });
        queryClient.invalidateQueries({ queryKey: ["folder", params?.slug] });
      } else if (res.status === 500) {
        toast.error("Failed to update music!");
      }
    },
  });

  return createMutation;
}

export function useUpdate(id: string) {
  const globalContext = use(GlobalContext);
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (updatedMusic) => {
      return fetch(`/api/music/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: String(globalContext?.token),
        },
        body: JSON.stringify(updatedMusic),
      });
    },

    onMutate: async (updatedMusic: z.infer<typeof uploadFormSchema>) => {
      await queryClient.cancelQueries({ queryKey: ["musics"] });
      const previousMusics = queryClient.getQueryData(["musics"]);

      queryClient.setQueryData(["musics"], (oldData?: { musics: PrismaType.Music[] }) => {
        if (!oldData) return { musics: [] };

        return {
          ...oldData,
          musics: oldData.musics.map((music) => {
            if (music.id === id) {
              return {
                title: updatedMusic.musicName,
                src: updatedMusic.musicType === "link" ? updatedMusic.musicLink : updatedMusic.musicFile,
                singerName: updatedMusic.singerName,
                favorites: false,
              };
            }
            return music;
          }),
        };
      });

      return { previousMusics };
    },

    onError: (err, variables, context) => {
      toast.error("Failed to update music!");
      queryClient.setQueryData(["musics"], context?.previousMusics);
    },

    onSuccess: (res) => {
      if (res.status === 200) {
        toast.success("Music updated successfully");
        queryClient.invalidateQueries({ queryKey: ["musics"] });
      } else if (res.status === 500) {
        toast.error("Failed to update music!");
      }
    },
  });

  return updateMutation;
}

export function useSort() {
  const globalContext = use(GlobalContext);

  const sortHandler = (source: PrismaType.Music[]) => {
    if (globalContext?.options.filter === "name") {
      if (globalContext?.options.sort === "Ascending") {
        source.sort((a: PrismaType.Music, b: PrismaType.Music) => a.title.localeCompare(b.title));
      } else if (globalContext?.options.sort === "Descending") {
        source.sort((a: PrismaType.Music, b: PrismaType.Music) => b.title.localeCompare(a.title));
      }
    } else if (globalContext?.options.filter === "dateAdded") {
      if (globalContext?.options.sort === "Ascending") {
        source.sort((a: PrismaType.Music, b: PrismaType.Music) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      } else if (globalContext?.options.sort === "Descending") {
        source.sort((a: PrismaType.Music, b: PrismaType.Music) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    }
  };

  return sortHandler;
}
