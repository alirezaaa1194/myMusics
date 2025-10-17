"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import GlobalContext from "@/contexts/globalContent";
import { PrismaType } from "@/lib/prisma";
import { folderOption } from "@/utils/options";
import { useQuery } from "@tanstack/react-query";
import { use, useCallback, useEffect, useState } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { folderFormSchema } from "@/utils/formSchema";
import { Input } from "@/components/ui/input";
import SpinnerComp from "@/components/spinner/spinner";

function FolderModalComp({ open, setOpen, music }: { open: boolean; setOpen: (open: boolean) => void; music: PrismaType.Music }) {
  const globalContext = use(GlobalContext);
  const { data } = useQuery(folderOption(String(globalContext?.token)));
  const [openCreateFolder, setOpenCreateFolder] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      folder: music?.folderId || "",
    },
    mode: "onSubmit",
  });

  const folderNameForm = useForm<z.infer<typeof folderFormSchema>>({
    resolver: zodResolver(folderFormSchema),
    defaultValues: {
      title: "",
    },
    mode: "onSubmit",
  });

  const createMutation = useMutation({
    mutationFn: async (values: z.infer<typeof folderFormSchema>) => {
      const res = await fetch(`/api/folder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: String(globalContext?.token),
        },
        body: JSON.stringify(values),
      });
      return res;
    },
    onSuccess: (res) => {
      if (res.status === 201) {
        toast.success("Folder created successfully");
        queryClient.invalidateQueries({ queryKey: ["folders"] });
        queryClient.invalidateQueries({ queryKey: ["musics"] });
        form.setValue("folder", form.getValues("folder"));
        setOpenCreateFolder(false);
        form.resetField("folder");
        folderNameForm.resetField("title");
      }
    },
  });

  const folderMutation = useMutation({
    mutationFn: async (values: { folder: string }) => {
      const res = await fetch(`/api/folder/${values.folder}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: String(globalContext?.token),
        },
        body: JSON.stringify({
          musicId: music.id,
        }),
      });
      return res;
    },
    onSuccess: (res, variables) => {
      if (res.status === 200) {
        toast.success("Folder created successfully");
        queryClient.invalidateQueries({ queryKey: ["folders"] });
        queryClient.invalidateQueries({ queryKey: ["musics"] });
        queryClient.invalidateQueries({ queryKey: ["folder", music.folderId] });
        form.setValue("folder", variables.folder);
        setOpenCreateFolder(false);
      }
    },
  });

  const deleteFromAllMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/music/${music.id}/folder/`, {
        method: "DELETE",
        headers: {
          authorization: String(globalContext?.token),
        },
      });
      return res;
    },
    onSuccess: (res) => {
      if (res.status === 200) {
        toast.success("Music removed from all folder");
        queryClient.invalidateQueries({ queryKey: ["musics"] });
        queryClient.invalidateQueries({ queryKey: ["folder", music.folderId] });
        form.setValue("folder", "");
        setOpenCreateFolder(false);
      }
    },
  });

  const onSubmit = (values: { folder: string }) => {
    folderMutation.mutate(values);
  };

  const createFolderOnSubmit = async (values: z.infer<typeof folderFormSchema>) => {
    const isExistFolder = data.folders.some((folder: PrismaType.Folder) => folder.title.trim() === values.title.trim());

    if (isExistFolder) {
      folderNameForm.setError("title", {
        message: "Folder name already exists",
      });
      return;
    }

    const isValid = await folderNameForm.trigger();
    if (!isValid) return;

    createMutation.mutate(values);
  };

  const closeModalHandler = () => {
    setOpen(false);
    setOpenCreateFolder(false);
  };

  const resetFormValues = useCallback(() => {
    if (open) {
      if (music.folderId) {
        form.setValue("folder", music.folderId);
      }
    } else {
      form.setValue("folder", "");
    }
  }, [open, form, music.folderId]);

  useEffect(() => {
    resetFormValues();
  }, [resetFormValues]);

  return (
    <Dialog open={open} onOpenChange={closeModalHandler}>
      <DialogContent className="sm:max-w-[425px] dark">
        <DialogHeader>
          <DialogTitle>Select folder</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="folder-form">
            <FormField
              control={form.control}
              name="folder"
              render={({ field }) => (
                <FormItem>
                  <RadioGroup value={field.value} onValueChange={field.onChange} className="grid grid-cols-2">
                    {data?.folders
                      ?.sort((a: PrismaType.Music, b: PrismaType.Music) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                      ?.map((folder: PrismaType.Folder) => (
                        <div key={folder.id} className="flex items-center gap-3">
                          <RadioGroupItem value={folder.id} id={folder.id} />
                          <Label htmlFor={folder.id}>{folder.title}</Label>
                        </div>
                      ))}
                  </RadioGroup>
                </FormItem>
              )}
            />
          </form>
        </Form>
        {openCreateFolder ? (
          <Form {...folderNameForm}>
            <form className="flex gap-2" id="create-folder" onSubmit={folderNameForm.handleSubmit(createFolderOnSubmit)}>
              <FormField
                control={folderNameForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          folderNameForm.setValue("title", e.target.value);
                          const isExistFolder = data.folders.some((folder: PrismaType.Folder) => folder.title.trim() === e.target.value.trim());
                          if (isExistFolder) {
                            folderNameForm.setError("title", {
                              message: "Folder name already exists",
                            });
                          } else {
                            folderNameForm.clearErrors();
                          }
                        }}
                        id="title"
                        name="title"
                        placeholder="Please enter folder name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-1">
                <Button form="create-folder" className="bg-accent hover:bg-accent/80 transition-colors cursor-pointer">
                  {createMutation.isPending ? (
                    <SpinnerComp className="size-5" variant="dark" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => {
                    folderNameForm.resetField("title");
                    setOpenCreateFolder(false);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <Button className="w-fit cursor-pointer" onClick={() => setOpenCreateFolder(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New folder
          </Button>
        )}
        <DialogFooter className="mt-10">
          {music.folderId ? (
            <Button className="bg-red-500 hover:bg-red-600 text-white transition-colors cursor-pointer" onClick={() => deleteFromAllMutation.mutate()}>
              {deleteFromAllMutation.isPending ? <SpinnerComp className="size-5" variant="light" /> : "Delete from all"}
            </Button>
          ) : null}
          <DialogClose asChild>
            <Button variant="outline" className="cursor-pointer">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" form="folder-form" className="bg-accent hover:bg-accent/80 transition-colors cursor-pointer">
            {folderMutation.isPending ? <SpinnerComp className="size-5" variant="dark" /> : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default FolderModalComp;
