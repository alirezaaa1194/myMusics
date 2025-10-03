"use client";
import { setOption } from "@/actions/options";
import GlobalContext from "@/contexts/globalContent";
import { PrismaType } from "@/lib/prisma";
import { uploadFormSchema } from "@/utils/formSchema";
import { favoritesMusicsOption, musicsOption } from "@/utils/options";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, usePathname } from "next/navigation";
import { use } from "react";
import { toast } from "sonner";
import z from "zod";

export function useGetMusics() {
  const globalContext = use(GlobalContext);
  return useQuery(musicsOption(String(globalContext?.token)));
}

export function useGetFavoritesMusics() {
  const globalContext = use(GlobalContext);
  const pathname = usePathname();
  return useQuery({ ...favoritesMusicsOption(String(globalContext?.token)), enabled: pathname === "/favorites" });
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
      await queryClient.cancelQueries({ queryKey: ["favorites"] });
      queryClient.cancelQueries({
        predicate: (query) => query.queryKey[0] === "folder",
      });
      const previousMusics = queryClient.getQueryData(["musics"]);
      const previousFavoritesMusics = queryClient.getQueryData(["favorites"]);
      const previousFolders = queryClient.getQueriesData({
        predicate: (query) => query.queryKey[0] === "folder",
      });

      queryClient.setQueryData(["musics"], (oldData?: { musics: PrismaType.Music[] }) => {
        if (!oldData) return { musics: [] };

        return {
          ...oldData,
          musics: oldData.musics.map((m) => (m.id === id ? { ...m, favorites: !m.favorites } : m)),
        };
      });

      queryClient.setQueryData(["favorites"], (oldData?: { musics: PrismaType.Music[] }) => {
        if (!oldData) return { musics: [] };

        return {
          ...oldData,
          musics: oldData.musics.filter((m) => m.id !== id),
        };
      });

      previousFolders.forEach(([key, oldData]) => {
        queryClient.setQueryData(key, (oldData?: { musics: PrismaType.Music[] }) => {
          if (!oldData) return { musics: [] };
          return {
            ...oldData,
            musics: oldData.musics.map((m) => (m.id === id ? { ...m, favorites: !m.favorites } : m)),
          };
        });
      });

      return { previousMusics, previousFavoritesMusics, previousFolders };
    },

    onError: (err, variables, context) => {
      toast.error("Failed to like music!");
      if (context?.previousMusics) {
        queryClient.setQueryData(["musics"], context.previousMusics);
      }
      if (context?.previousFavoritesMusics) {
        queryClient.setQueryData(["favorites"], context.previousFavoritesMusics);
      }
    },

    onSuccess: async (res) => {
      const response = await res.json();
      if (res.status === 200) {
        toast.success(response.message);
        queryClient.invalidateQueries({ queryKey: ["musics"] });
        queryClient.invalidateQueries({ queryKey: ["favorites"] });
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "folder",
        });
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
          setOption({ ...globalContext.options, currentMusicId: newMusic.id });
          globalContext.audio.current?.setAttribute("src", newMusic.src);
        } else {
          const newMusicIndex = currentMusicIndex === allMusics.length - 1 ? 0 : currentMusicIndex + 1;
          globalContext?.audio.current?.setAttribute("src", allMusics[newMusicIndex].src);
          globalContext?.setOptions({ ...globalContext.options, currentMusicId: allMusics[newMusicIndex].id });

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
    mutationFn: (newMusic: FormData) => {
      if (params?.slug && typeof params.slug === "string") {
        newMusic.append("folderId", params?.slug);
      }

      return fetch("/api/music", {
        method: "POST",
        headers: {
          // "Content-Type": "application/json",
          authorization: String(globalContext?.token),
        },
        // body: JSON.stringify({ ...newMusic, folderId: params?.slug || null }),
        body: newMusic,
      });
    },

    onMutate: async (newMusic: FormData) => {
      await queryClient.cancelQueries({ queryKey: ["musics"] });
      const previousMusics = queryClient.getQueryData(["musics"]);

      queryClient.setQueryData(["musics"], (oldData?: { musics: PrismaType.Music[] }) => {
        if (!oldData) return { musics: [] };

        return {
          ...oldData,
          musics: [
            ...oldData.musics,
            {
              title: newMusic.get("musicName"),
              src: newMusic.get("musicType") === "link" ? newMusic.get("musicLink") : newMusic.get("musicFile"),
              singerName: newMusic.get("singerName"),
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
        toast.error("Failed to create music!");
      }
    },
  });

  return createMutation;
}

export function useUpdate(id: string) {
  const globalContext = use(GlobalContext);
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (updatedMusic: z.infer<typeof uploadFormSchema>) => {
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
      await queryClient.cancelQueries({ queryKey: ["favorites"] });
      await queryClient.cancelQueries({
        predicate: (query) => query.queryKey[0] === "folder",
      });

      const previousMusics = queryClient.getQueryData(["musics"]);
      const previousFavorites = queryClient.getQueryData(["favorites"]);
      const previousFolders = queryClient.getQueriesData({
        predicate: (query) => query.queryKey[0] === "folder",
      });

      const updateList = (oldData?: { musics: PrismaType.Music[] }) => {
        if (!oldData) return { musics: [] };
        return {
          ...oldData,
          musics: oldData.musics.map((music) =>
            music.id === id
              ? {
                  ...music,
                  title: updatedMusic.musicName,
                  src: updatedMusic.musicType === "link" ? updatedMusic.musicLink : updatedMusic.musicFile,
                  singerName: updatedMusic.singerName,
                }
              : music
          ),
        };
      };

      queryClient.setQueryData(["musics"], updateList);
      queryClient.setQueryData(["favorites"], updateList);
      previousFolders.forEach(([key]) => {
        queryClient.setQueryData(key, updateList);
      });

      return { previousMusics, previousFavorites, previousFolders };
    },

    onError: (err, variables, context) => {
      toast.error("Failed to update music!");
      if (context?.previousMusics) queryClient.setQueryData(["musics"], context.previousMusics);
      if (context?.previousFavorites) queryClient.setQueryData(["favorites"], context.previousFavorites);
      if (context?.previousFolders) {
        context.previousFolders.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },

    onSuccess: async (res) => {
      if (res.status === 200) {
        toast.success("Music updated successfully");
        queryClient.invalidateQueries({ queryKey: ["musics"] });
        queryClient.invalidateQueries({ queryKey: ["favorites"] });
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "folder",
        });
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
