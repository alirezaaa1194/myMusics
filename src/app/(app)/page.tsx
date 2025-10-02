import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { musicsOption } from "@/utils/options";
import { getQueryClient } from "@/utils/getQueryClient";
import SkeletonListComp from "@/components/musics/skeletonList";
const Musics = dynamic(() => import("@/components/musics/musics"), {
  loading: () => <SkeletonListComp />,
});

async function page() {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("accessToken");

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(musicsOption(String(token?.value)));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Musics />
    </HydrationBoundary>
  );
}

export default page;
