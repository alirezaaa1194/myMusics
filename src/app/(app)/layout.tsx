import HeaderComp from "@/components/header/header";
import SearchBoxComp from "@/components/searchBox/searchBox";
import SidebarComp from "@/components/sidebar/sidebar";
import SortComp from "@/components/sort/sort";
import DesktopTimelineComp from "@/components/timeline/desktopTimeline";
import MobileTimelineComp from "@/components/timeline/mobileTimeline";
import { getQueryClient } from "@/utils/getQueryClient";
import { folderOption } from "@/utils/options";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";
import React from "react";

async function layout({ children }: { children: React.ReactNode }) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("accessToken");

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(folderOption(String(token?.value)));

  return (
    <main className="h-full">
      <div className="w-full h-[calc(100%-145px)] lg:py-5 flex">
        <aside className="h-full w-1/6 bg-main border-r border-r-border hidden lg:block">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <SidebarComp />
          </HydrationBoundary>
        </aside>
        <main className="w-full lg:w-5/6">
          <header className="w-full shrink-0 lg:pb-5">
            <HeaderComp />
          </header>
          <section className="w-full lg:w-5/6 h-full">
            <SearchBoxComp className="hidden lg:flex shrink-0" />
            <div className="no-scrollbar p-2.5 pt-0 lg:pt-3 h-[calc(100%-25px)] lg:h-[calc(100%-90px)] overflow-y-auto">
              <div className="flex justify-end py-3 lg:hidden">
                <SortComp className="flex gap-3" />
              </div>
              {children}
            </div>
          </section>
        </main>
      </div>
      <div className="w-full z-50 fixed bottom-0 right-0 border-t border-t-border bg-main">
        <DesktopTimelineComp />
        <MobileTimelineComp />
      </div>
    </main>
  );
}

export default layout;
