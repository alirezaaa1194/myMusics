import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { folderMusicOption } from "@/utils/options";
import { getQueryClient } from "@/utils/getQueryClient";
import SkeletonListComp from "@/components/musics/skeletonList";
const FolderMusicsComp = dynamic(() => import("@/components/musics/folderMusics"), {
  loading: () => <SkeletonListComp/>,
});

async function page(props: { params: Promise<{ slug: string }> }) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("accessToken");
  const params = await props.params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(folderMusicOption(String(token?.value), params.slug));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FolderMusicsComp />
    </HydrationBoundary>
  );
}

export default page;
