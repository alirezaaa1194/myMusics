"use client";
import { use } from "react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import GlobalContext from "@/contexts/globalContent";
import { setOption } from "@/actions/options";

function SortComp({ className }: { className: string }) {
  const globalContext = use(GlobalContext);
  return (
    <div className={className}>
      <Button
        className="w-10 h-10 lg:w-8 lg:h-8 cursor-pointer bg-surface lg:bg-transparent"
        onClick={() => {
          if (globalContext) {
            setOption({ ...globalContext.options, sort: globalContext.options?.sort === "Ascending" ? "Descending" : "Ascending" });
            globalContext?.setOptions({ ...globalContext.options, sort: globalContext.options?.sort === "Ascending" ? "Descending" : "Ascending" });
          }
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-5 transition-all ${globalContext?.options?.sort === "Descending" ? "rotate-0" : "rotate-180"}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
        </svg>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-10 h-10 lg:w-8 lg:h-8 cursor-pointer bg-surface lg:bg-transparent">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
            </svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-main text-white" align="end">
          <DropdownMenuItem
            onClick={() => {
              if (globalContext) {
                setOption({ ...globalContext.options, filter: "name" });
                globalContext?.setOptions({ ...globalContext.options, filter: "name" });
              }
            }}
            className={`cursor-pointer hover:!bg-surface !text-white flex items-center gap-2 p-2 ${globalContext?.options?.filter === "name" ? "!bg-accent !text-surface hover:!bg-accent" : ""}`}
          >
            Name
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              if (globalContext) {
                setOption({ ...globalContext.options, filter: "dateAdded" });
                globalContext?.setOptions({ ...globalContext.options, filter: "dateAdded" });
              }
            }}
            className={`cursor-pointer hover:!bg-surface !text-white flex items-center gap-2 p-2 ${globalContext?.options?.filter === "dateAdded" ? "!bg-accent !text-surface hover:!bg-accent" : ""}`}
          >
            Date added
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default SortComp;
