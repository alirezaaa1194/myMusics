import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { favoritesMusicsOption } from "@/utils/options";
import { getQueryClient } from "@/utils/getQueryClient";
import SkeletonListComp from "@/components/musics/skeletonList";
const FavoritesComp = dynamic(() => import("@/components/musics/favorites"), {
  loading: () => <SkeletonListComp/>,
});

async function page() {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("accessToken");

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(favoritesMusicsOption(String(token?.value)));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FavoritesComp />
    </HydrationBoundary>
  );
}

export default page;
