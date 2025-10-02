import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PrismaType } from "@/lib/prisma";
import React, { useCallback, useEffect, useState } from "react";
import { useDelete, useLike } from "@/hooks/useMusic";
import UploaderComp from "@/components/uploader/uploader";
import FolderModalComp from "./folderModal";
import SpinnerComp from "@/components/spinner/spinner";

function OptionComp({ music }: { music: PrismaType.Music }) {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openFolderModal, setOpenFolderModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const deleteMutation = useDelete(music.id);
  const updateMutation = useLike(music.id);

  const closeDialogHandler = useCallback(() => {
    if (deleteMutation.status === "success") {
      setOpenDeleteDialog(false);
    }
  }, [deleteMutation.status]);

  // useEffect(() => {
  //   if (deleteMutation.status === "success") {
  //     setOpenDeleteDialog(false);
  //   }
  // }, [deleteMutation.status]);

  useEffect(() => {
    closeDialogHandler();
  }, [closeDialogHandler]);

  return (
    <>
      <UploaderComp open={openEditModal} onClose={() => setOpenEditModal(false)} defaultValue={music} />
      <FolderModalComp open={openFolderModal} setOpen={setOpenFolderModal} music={music} />
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent className="dark">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete the <span className="font-bold underline underline-offset-2">{music.title}</span> music?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction className="cursor-pointer" onClick={() => deleteMutation.mutate()}>
              {deleteMutation.isPending ? <SpinnerComp className="size-5" variant="dark" /> : "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="text-white cursor-pointer outline-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-main text-white" align="end">
          <DropdownMenuItem className="cursor-pointer text-white hover:text-secondary" onClick={() => updateMutation.mutate()}>
            {music.favorites ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="size-5">
                  <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                </svg>
                Remove From Favorites
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentcolor" className="size-5 hover:text-secondary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
                Add To Favorites
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-white hover:text-secondary" onClick={() => setOpenFolderModal(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 hover:text-secondary">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
            </svg>
            Add To Folder
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-white hover:text-secondary"
            onClick={() => {
              setOpenEditModal(true);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 hover:text-secondary">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer hover:!bg-red-500 !text-white"
            onClick={() => {
              setOpenDeleteDialog(true);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default OptionComp;
