"use client";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { folderFormSchema } from "@/utils/formSchema";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { use, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import GlobalContext from "@/contexts/globalContent";
import { folderOption } from "@/utils/options";
import { PrismaType } from "@/lib/prisma";
import SpinnerComp from "../spinner/spinner";

function FolderUploaderComp() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const globalContext = use(GlobalContext);
  const { data } = useQuery(folderOption(String(globalContext?.token)));
  const form = useForm<z.infer<typeof folderFormSchema>>({
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
        setOpen(false);
      }
    },
  });

  async function onSubmit(values: z.infer<typeof folderFormSchema>) {
    const isExistFolder = data.folders.some((folder: PrismaType.Folder) => folder.title.trim() === values.title.trim());

    if (isExistFolder) {
      form.setError("title", {
        message: "Folder name already exists",
      });
      return;
    }

    const isValid = await form.trigger();
    if (!isValid) return;

    createMutation.mutate(values);
  }

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  useEffect(() => {
    if (createMutation.status === "success") {
      form.reset();
    }
  }, [createMutation.status, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="shrink-0 flex-1 lg:w-14 bg-white hover:bg-white/80 lg:!max-w-10 h-10 transition-colors text-primary text-[16px] cursor-pointer font-bold flex items-center justify-center gap-2 py-2 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="size-7">
          <path d="M576 448C576 483.3 547.3 512 512 512L128 512C92.7 512 64 483.3 64 448L64 160C64 124.7 92.7 96 128 96L266.7 96C280.5 96 294 100.5 305.1 108.8L343.5 137.6C349 141.8 355.8 144 362.7 144L512 144C547.3 144 576 172.7 576 208L576 448zM320 224C306.7 224 296 234.7 296 248L296 296L248 296C234.7 296 224 306.7 224 320C224 333.3 234.7 344 248 344L296 344L296 392C296 405.3 306.7 416 320 416C333.3 416 344 405.3 344 392L344 344L392 344C405.3 344 416 333.3 416 320C416 306.7 405.3 296 392 296L344 296L344 248C344 234.7 333.3 224 320 224z" />
        </svg>
        <span className="lg:hidden">Create folder</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] dark">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="folder-form" className="space-y-4">
            <DialogHeader>
              <DialogTitle>Create new folder</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="title">Folder Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          form.setValue("title", e.target.value);
                          const isExistFolder = data.folders.some((folder: PrismaType.Folder) => folder.title.trim() === e.target.value.trim());
                          if (isExistFolder) {
                            form.setError("title", {
                              message: "Folder name already exists",
                            });
                          } else {
                            form.clearErrors();
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
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" form="folder-form" className="bg-accent hover:bg-accent/80 transition-colors cursor-pointer">
                {createMutation.isPending ? <SpinnerComp className="size-5" variant="dark" /> : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default FolderUploaderComp;
