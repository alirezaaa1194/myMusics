"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UploaderComp from "../uploader/uploader";
import { Button } from "../ui/button";
import FolderUploaderComp from "../uploader/folder";
import { useState } from "react";
import FoldersComp from "./folders/folders";

function SidebarComp() {
  const pathname = usePathname();
  const [openMusicModal, setOpenMusicModal] = useState(false);

  return (
    <>
      <UploaderComp open={openMusicModal} onClose={() => setOpenMusicModal(false)} />
      <div className="w-full h-full flex flex-col justify-between">
        <div className="flex flex-col">
          <h1 className="text-lg h-[62px]">Next.js</h1>
          <ul>
            <li>
              <Link href="/" className={`w-full flex items-center gap-3 text-white  px-4 py-2.5 border border-transparent hover:text-accent transition-colors rounded-l-lg ${pathname === "/" ? "bg-surface border border-border" : ""}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                Home
              </Link>
            </li>
            <li>
              <Link href="/favorites" className={`w-full flex items-center gap-3 text-white  px-4 py-2.5 border border-transparent hover:text-accent transition-colors rounded-l-lg ${pathname === "/favorites" ? "bg-surface border border-border" : ""}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
                Favorites
              </Link>
            </li>
          </ul>
        </div>
        <FoldersComp />
        <div className="pr-5 lg:!pr-2 flex gap-2">
          <Button className="flex-1 bg-accent hover:bg-accent/80 transition-colors text-primary text-[15px] cursor-pointer font-bold flex items-center justify-center gap-2 py-2 rounded-lg !w-full h-10" onClick={() => setOpenMusicModal(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            Upload
          </Button>
          <FolderUploaderComp />
        </div>
      </div>
    </>
  );
}

export default SidebarComp;
