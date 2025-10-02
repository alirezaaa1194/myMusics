import { queryOptions } from "@tanstack/react-query";

const baseUrl = "https://my-musics-one.vercel.app/api";
// const baseUrl = "http://localhost:3000/api";

export const musicsOption = (token: string) => {
  return queryOptions({
    queryKey: ["musics"],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/music`, {
        headers: {
          Authorization: token,
        },
      });

      return response.json();
    },
  });
};

export const favoritesMusicsOption = (token: string) => {
  return queryOptions({
    queryKey: ["favorites"],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/music/favorites`, {
        headers: {
          Authorization: token,
        },
      });

      return response.json();
    },
  });
};

export const folderOption = (token: string) => {
  return queryOptions({
    queryKey: ["folders"],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/folder`, {
        headers: {
          Authorization: token,
        },
      });

      return response.json();
    },
  });
};

export const folderMusicOption = (token: string, folderId: string) => {
  return queryOptions({
    queryKey: ["folder", folderId],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/folder/${folderId}/musics`, {
        headers: {
          Authorization: token,
        },
      });

      return response.json();
    },
  });
};
