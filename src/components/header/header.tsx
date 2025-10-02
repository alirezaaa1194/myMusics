"use client";
import { useParams, usePathname } from "next/navigation";
import MobileSidebarComp from "./mobileSidebar/mobileSidebar";
import { Button } from "../ui/button";
import { use, useState } from "react";
import MobileSearchSidebarComp from "./mobileSearchSidebar/mobileSearchSidebar";
import ProfileDropdown from "./profileDropdown/profileDropdown";
import { useQuery } from "@tanstack/react-query";
import { folderOption } from "@/utils/options";
import GlobalContext from "@/contexts/globalContent";
import { PrismaType } from "@/lib/prisma";

function HeaderComp() {
  const pathname = usePathname();
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openSearchSidebar, setOpenSearchSidebar] = useState(false);
  const globalContext = use(GlobalContext);
  const params = useParams();
  const { data } = useQuery(folderOption(String(globalContext?.token)));
  const currentFolder = data?.folders?.find((folder: PrismaType.Folder) => folder?.id === params?.slug);

  return (
    <>
      <MobileSidebarComp openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
      <MobileSearchSidebarComp openSearchSidebar={openSearchSidebar} setOpenSearchSidebar={setOpenSearchSidebar} />
      <div className="w-full px-2.5 lg:pl-8 lg:pr-0 flex items-center justify-between border-b border-b-border lg:border-b-0 py-5 lg:py-0">
        <Button className="lg:hidden w-10 h-10 rounded-lg bg-surface hover:bg-surface/80 cursor-pointer" onClick={() => setOpenSearchSidebar(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </Button>
        <div className="flex items-center gap-3">
          {pathname === "/" ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="hidden lg:block size-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
            </svg>
          ) : pathname.startsWith("/favorites") ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="hidden lg:block size-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="hidden lg:block size-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
            </svg>
          )}
          {pathname === "/" ? <h1 className="text-2xl lg:text-3xl font-bold">All Songs</h1> : pathname === "/favorites" ? <h1 className="text-2xl lg:text-3xl font-bold">Favorites</h1> : <h1 className="text-2xl lg:text-3xl font-bold">{currentFolder?.title}</h1>}
        </div>
        <div className="hidden lg:block">
          <ProfileDropdown />
        </div>
        <Button className="lg:hidden w-10 h-10 rounded-lg bg-surface hover:bg-surface/80 cursor-pointer" onClick={() => setOpenSidebar(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
          </svg>
        </Button>
      </div>
    </>
  );
}

export default HeaderComp;
