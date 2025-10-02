"use client";
import { usePathname } from "next/navigation";
import SortComp from "../sort/sort";
import { useSearchStore } from "@/store/store";
import { useCallback, useEffect } from "react";

function SearchBoxComp({ className }: { className?: string }) {
  const search = useSearchStore((state) => state.search);
  const setSearch = useSearchStore((state) => state.setSearch);
  const pathname = usePathname();

  const handleSearch = useCallback(() => {
    setSearch("");
  }, [setSearch]);

  useEffect(() => {
    handleSearch();
  }, [pathname, handleSearch]);

  // useEffect(() => {
  //   setSearch("");
  // }, [pathname]);

  return (
    <div className={`w-full h-10 lg:h-[46px] flex items-center gap-2 px-3 border border-border border-l-0 lg:border-l-1 rounded-lg lg:rounded-l-none lg:rounded-r-lg !outline-0 !shadow-none bg-surface ${className}`}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-secondary2 shrink-0">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
      <input
        className="w-full outline-0"
        placeholder="Search musics..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
      {search ? (
        <span
          className="cursor-pointer w-5 h-5 rounded-full bg-main/40 text-secondary flex items-center justify-center shrink-0 lg:mr-5"
          onClick={() => {
            setSearch("");
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </span>
      ) : null}
      <SortComp className="hidden lg:flex gap-2" />
    </div>
  );
}

export default SearchBoxComp;
