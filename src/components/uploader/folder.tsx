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
      <DialogTrigger className="shrink-0 flex-1 lg:w-14 bg-white hover:bg-white/80 lg:!max-w-10 transition-colors text-primary text-[16px] cursor-pointer font-bold flex items-center justify-center gap-2 py-2 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
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
