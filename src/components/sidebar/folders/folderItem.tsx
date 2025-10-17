import { Input } from "@/components/ui/input";
import { PrismaType } from "@/lib/prisma";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { use, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { folderFormSchema } from "@/utils/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import GlobalContext from "@/contexts/globalContent";
import { toast } from "sonner";
import SpinnerComp from "@/components/spinner/spinner";
import { Button } from "@/components/ui/button";
import { folderOption } from "@/utils/options";
import { Skeleton } from "@/components/ui/skeleton";

function FolderItemComp({ folder }: { folder: PrismaType.Folder }) {
  const globalContext = use(GlobalContext);
  const [isEdit, setIsEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const params = useParams();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();
  const { data } = useQuery(folderOption(String(globalContext?.token)));
  const form = useForm<z.infer<typeof folderFormSchema>>({
    resolver: zodResolver(folderFormSchema),
    defaultValues: {
      title: "",
    },
    mode: "onSubmit",
  });

  const editMutation = useMutation({
    mutationFn: async (values: z.infer<typeof folderFormSchema>) => {
      const res = await fetch(`/api/folder/${folder.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: String(globalContext?.token),
        },
        body: JSON.stringify(values),
      });
      return res;
    },
    onSuccess: (res) => {
      if (res.status === 200) {
        toast.success("Folder name updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["folders"] });
      }
    },
  });
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/folder/${folder.id}`, {
        method: "DELETE",
        headers: {
          authorization: String(globalContext?.token),
        },
      });
      return res;
    },
    onSuccess: (res) => {
      if (res.status === 200) {
        toast.success("Folder deleted successfully!");
        queryClient.invalidateQueries({ queryKey: ["folders"] });
        queryClient.invalidateQueries({ queryKey: ["musics"] });
        setOpenDialog(false);

        if (params.slug === folder.id) {
          router.push("/");
        }
      }
    },
  });

  async function onSubmit(values: z.infer<typeof folderFormSchema>) {
    if (values.title !== folder.title) {
      const isExistFolder = data.folders.some((folder: PrismaType.Folder) => folder.title.trim() === values.title.trim());

      if (isExistFolder) {
        form.setError("title", {
          message: "Folder name already exists",
        });
        return;
      }

      const isValid = await form.trigger();
      if (!isValid) return;
    }

    if (values.title !== folder.title) {
      editMutation.mutate(values);
    }
    inputRef.current = null;
    setIsEdit(false);
  }

  useEffect(() => {
    const skipHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isEdit) {
        inputRef.current = null;
        setIsEdit(false);
      }
    };
    window.addEventListener("keydown", skipHandler);
    return () => window.removeEventListener("keydown", skipHandler);
  }, [isEdit]);

  return (
    <>
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent className="dark">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete the <span className="font-bold underline underline-offset-2">{folder.title}</span> folder?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
            <Button className="cursor-pointer" onClick={() => deleteMutation.mutate()}>
              {deleteMutation.isPending ? <SpinnerComp className="size-5" variant="dark" /> : "Continue"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <li key={folder.id} className={`w-full flex items-center justify-between gap-3 text-white transition-colors pr-2 rounded-lg ${folder.id === params?.slug ? "bg-surface" : ""}`}>
        {!isEdit ? (
          <Link href={`/folder/${folder.id}`} className={`w-full flex items-center gap-3 hover:text-accent px-4 py-2.5 ${params?.slug === folder.id ? "text-accent" : ""}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
            </svg>
            {editMutation.isPending ? <Skeleton className={`h-6 w-12 rounded-lg ${params?.slug === folder.id ? "bg-black/90" : "bg-surface"} `} /> : <span className="line-clamp-1">{folder.title}</span>}
          </Link>
        ) : (
          <div className={`w-full flex items-center gap-3 transition-colors hover:text-accent ${params?.slug === folder.id ? "text-accent" : ""}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
            </svg>
            {isEdit ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} id="folder-form" className="space-y-4">
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              ref={(el) => {
                                field.ref(el);
                                inputRef.current = el;
                              }}
                              onChange={(e) => {
                                form.setValue("title", e.target.value);
                                if (e.target.value !== folder.title) {
                                  const isExistFolder = data.folders.some((folder: PrismaType.Folder) => folder.title.trim() === e.target.value.trim());
                                  if (isExistFolder) {
                                    form.setError("title", {
                                      message: "Folder name already exists",
                                    });
                                  } else {
                                    form.clearErrors();
                                  }
                                }
                              }}
                              id="title"
                              name="title"
                              placeholder="Folder name"
                              className="text-white"
                              onBlur={() => {
                                inputRef.current = null;
                                setIsEdit(false);
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            ) : (
              <span className="line-clamp-1">{folder.title}</span>
            )}
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 cursor-pointer">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
            </svg>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-main text-white" align="start">
            <DropdownMenuItem
              className="cursor-pointer text-white hover:text-secondary hover:[&>svg]:text-surface"
              onClick={() => {
                setIsEdit(true);
                form.resetField("title");
                form.setValue("title", folder.title);
                setTimeout(() => {
                  inputRef.current?.focus();
                }, 50);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
              Edit name
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:!bg-red-500 !text-white" onClick={() => setOpenDialog(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </li>
    </>
  );
}

export default FolderItemComp;
