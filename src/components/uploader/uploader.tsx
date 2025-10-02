"use client";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { uploadFormSchema } from "@/utils/formSchema";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { useCreate, useUpdate } from "@/hooks/useMusic";
import { PrismaType } from "@/lib/prisma";
import SpinnerComp from "../spinner/spinner";

function UploaderComp({ open, onClose, defaultValue }: { open: boolean; onClose: (open: boolean) => void; defaultValue?: PrismaType.Music }) {
  const form = useForm<z.infer<typeof uploadFormSchema>>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      musicName: "",
      singerName: "",
      musicLink: "",
      musicFile: "",
      musicType: "link",
    },
    mode: "onSubmit",
  });

  const createMutation = useCreate();
  const updateMutation = useUpdate(defaultValue?.id || "");

  function onSubmit(values: z.infer<typeof uploadFormSchema>) {
    if (defaultValue) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  }

  useEffect(() => {
    if (!open) {
      form.reset();
    }

    if (defaultValue) {
      form.setValue("musicName", defaultValue.title);
      form.setValue("singerName", defaultValue.singerName);
      form.setValue("musicLink", defaultValue.src);
    }
  }, [open, form, defaultValue]);

  useEffect(() => {
    if (createMutation.status === "success" || updateMutation.status === "success") {
      form.reset();
    }
  }, [createMutation.status, updateMutation.status, form]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] dark">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="upload-form" className="space-y-4">
            <DialogHeader>
              <DialogTitle>Upload new music</DialogTitle>
              <DialogDescription>Upload your music to create and edit your playlist</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="musicName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="musicName-1">Music Name</FormLabel>
                    <FormControl>
                      <Input {...field} id="musicName-1" name="musicName" placeholder="Please enter music name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="singerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="singerName-1">Singer Name</FormLabel>
                    <FormControl>
                      <Input {...field} id="singerName-1" name="singerName" placeholder="Please enter singer name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="musicType"
                render={({ field }) => (
                  <FormItem>
                    <RadioGroup
                      value={field.value}
                      onValueChange={(e) => {
                        form.resetField("musicLink");
                        form.resetField("musicFile");
                        field.onChange(e);
                      }}
                      className="grid grid-cols-2 gap-2 my-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="link" id="link" />
                        <Label htmlFor="link">Link</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="file" id="file" />
                        <Label htmlFor="file">File</Label>
                      </div>
                    </RadioGroup>
                  </FormItem>
                )}
              />
              {form.watch("musicType") === "link" ? (
                <FormField
                  control={form.control}
                  name="musicLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="musicLink-1">Music Link</FormLabel>
                      <FormControl>
                        <Input {...field} id="musicLink-1" name="musicLink" placeholder="Please enter music link" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="musicFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="musicFile-1">Music File</FormLabel>
                      <FormControl>
                        <Input type="file" onChange={(e) => field.onChange(e.target.files?.[0])} id="musicFile-1" name="musicFile" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" form="upload-form" className="bg-accent hover:bg-accent/80 transition-colors cursor-pointer">
                {createMutation.isPending || updateMutation.isPending ? <SpinnerComp className="size-5" variant="dark" /> : <>{defaultValue ? "Edit" : "Upload"}</>}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default UploaderComp;
