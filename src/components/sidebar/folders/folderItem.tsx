import { Input } from "@/components/ui/input";
import { PrismaType } from "@/lib/prisma";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { use, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { folderFormSchema } from "@/utils/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import GlobalContext from "@/contexts/globalContent";
import { toast } from "sonner";
import SpinnerComp from "@/components/spinner/spinner";
import { Button } from "@/components/ui/button";

function FolderItemComp({ folder }: { folder: PrismaType.Folder }) {
  const globalContext = use(GlobalContext);
  const [isEdit, setIsEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const params = useParams();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();
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

  function onSubmit(values: z.infer<typeof folderFormSchema>) {
    if (values.title !== folder.title) {
      editMutation.mutate(values);
    }
    inputRef.current = null;
    setIsEdit(false);
  }

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

      <li key={folder.id} className={`w-full flex items-center justify-between gap-3 text-white px-4 py-2.5 pr-2 transition-colors rounded-lg ${folder.id === params?.slug ? "bg-surface" : ""}`}>
        {!isEdit ? (
          <Link href={`/folder/${folder.id}`} className={`w-full flex items-center gap-3 hover:text-accent ${params?.slug === folder.id ? "text-accent" : ""}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
            </svg>
            {editMutation.isPending ? "loading..." : folder.title}
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
              folder.title
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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="size-4">
                <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
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
