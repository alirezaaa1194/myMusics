"use client";
import FoldersComp from "@/components/sidebar/folders/folders";
import { Button } from "@/components/ui/button";
import UploaderComp from "@/components/uploader/uploader";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ProfileDropdown from "../profileDropdown/profileDropdown";
import FolderUploaderComp from "@/components/uploader/folder";

function MobileSidebarComp({ openSidebar, setOpenSidebar }: { openSidebar: boolean; setOpenSidebar: (value: boolean) => void }) {
  const pathname = usePathname();
  const [openUploader, setOpenUploader] = useState(false);

  const handleSetOpen = useCallback(
    (value: boolean) => {
      setOpenSidebar(value);
    },
    [setOpenUploader]
  );

  useEffect(() => {
    handleSetOpen(false);
  }, [pathname, handleSetOpen]);

  return (
    <div className={`lg:hidden w-full h-[calc(100%-88px)] bg-main fixed z-50 top-0 transition-all ${openSidebar ? "right-0" : "-right-full"}`}>
      <header className="w-full p-2.5 py-5 flex items-center justify-between gap-2.5 border-b border-b-border">
        <ProfileDropdown />
        <Button className="w-10 h-10 rounded-lg bg-surface hover:bg-surface/80 cursor-pointer" onClick={() => setOpenSidebar(false)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-secondary2 shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </Button>
      </header>
      <main className="w-full h-[calc(100%-81px)] flex flex-col items-center justify-between gap-2.5 p-2.5">
        <ul className="w-full flex flex-col gap-3">
          <li className="w-full">
            <Link href="/" className={`w-full flex items-center justify-between text-white px-4 py-2.5 border border-transparent hover:text-accent transition-colors rounded-lg ${pathname === "/" ? "bg-surface border border-border !text-accent" : ""}`}>
              <span className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                Home
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 !text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          </li>
          <li className="w-full">
            <Link href="/favorites" className={`w-full flex items-center justify-between text-white px-4 py-2.5 border border-transparent hover:text-accent transition-colors rounded-lg ${pathname === "/favorites" ? "bg-surface border border-border !text-accent" : ""}`}>
              <span className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
                Favorites
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 !text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          </li>
        </ul>
        <FoldersComp />
        <UploaderComp open={openUploader} onClose={() => setOpenUploader(false)} />
        <div className="lg:!pr-2 flex gap-2 w-full">
          <Button className="flex-1 bg-accent hover:bg-accent/80 transition-colors text-primary text-[15px] cursor-pointer font-bold flex items-center justify-center gap-2 py-2 rounded-lg !w-full h-10" onClick={() => setOpenUploader(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            Upload music
          </Button>
          <FolderUploaderComp />
        </div>
      </main>
    </div>
  );
}

export default MobileSidebarComp;
