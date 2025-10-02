import GlobalContext from "@/contexts/globalContent";
import { PrismaType } from "@/lib/prisma";
import { folderOption } from "@/utils/options";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import FolderItemComp from "./folderItem";

function FoldersComp() {
  const globalContext = use(GlobalContext);
  const { data, isPending } = useQuery(folderOption(String(globalContext?.token)));

  return (
    <div className="no-scrollbar lg:my-2 pt-2 lg:py-2 border-y border-y-border w-full h-full max-h-full overflow-auto">
      {isPending ? (
        "loading..."
      ) : (
        <ul className="flex flex-col gap-1 pr-2">
          {data?.folders
            ?.sort((a: PrismaType.Music, b: PrismaType.Music) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            ?.map((folder: PrismaType.Folder) => (
              <FolderItemComp key={folder.id} folder={folder} />
            ))}
        </ul>
      )}
    </div>
  );
}

export default FoldersComp;
