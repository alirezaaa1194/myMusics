"use client";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import GlobalContext from "@/contexts/globalContent";
import { use } from "react";
import { createHash } from "crypto";
import { logout } from "@/actions/auth";
import { useQueryClient } from "@tanstack/react-query";

function ProfileDropdown() {
  const globalContext = use(GlobalContext);
  const queryClient = useQueryClient();
  const signOutHandler = () => {
    logout();
    if (globalContext?.audio.current) {
      globalContext.audio.current.currentTime = 0;
      globalContext.audio.current.pause();
      queryClient.clear();
    }
  };
  const hashedEmail = createHash("sha256").update(`${globalContext?.user?.email}`).digest("hex");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="w-2/3 lg:w-full max-w-[300px]">
        <Button className="text-white cursor-pointer outline-0 flex items-center justify-between gap-14 py-5 border border-border">
          <div className="flex items-center gap-2 max-w-2/3 lg:max-w-full">
            <img src={`https://gravatar.com/avatar/${hashedEmail}?d=mp`} alt={globalContext?.user?.username || "user profile"} className="bg-surface rounded-full object-cover shrink-0 size-7" />
            <div className="flex flex-col text-left w-full">
              <span className="text-white text-xs font-[500] block w-full line-clamp-1">{globalContext?.user?.username}</span>
              <span className="text-secondary2 text-xs w-full overflow-ellipsis line-clamp-1">{globalContext?.user?.email}</span>
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-main text-white w-[221px]" align="start">
        <DropdownMenuItem className="cursor-pointer hover:!bg-red-500 !text-white flex items-center gap-2 p-2" onClick={signOutHandler}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
          </svg>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ProfileDropdown;
