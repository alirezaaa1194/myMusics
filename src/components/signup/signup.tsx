"use client";
import { signupFormSchema } from "@/utils/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { signup } from "@/actions/auth";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import SpinnerComp from "../spinner/spinner";

function SignupComp() {
  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const initialValue = {
    values: {
      username: "",
      email: "",
      password: "",
    },
    message: "",
  };

  const [state, action, pending] = useActionState(signup, initialValue);
  function onSubmit(values: z.infer<typeof signupFormSchema>) {
    startTransition(() => action(values));
  }

  useEffect(() => {
    if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <div className="w-full lg:max-w-[350px] mt-24 border border-border rounded-xl p-4 space-y-5">
      <h1 className="text-center text-2xl font-bold mb-2">Signup</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} id="login-form" className="space-y-5">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="username">Username</FormLabel>
                <FormControl>
                  <Input {...field} id="username" name="username" placeholder="Please enter username" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input {...field} id="email" name="email" placeholder="Please enter email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="password">Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" id="password" name="password" placeholder="Please enter password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" form="login-form" className="w-full bg-accent hover:bg-accent/80 text-main text-[17px] transition-colors cursor-pointer">
            {pending ? <SpinnerComp className="size-6" variant="dark" /> : "Signup"}
          </Button>
        </form>
      </Form>
      <span className="text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-accent">
          login
        </Link>
      </span>
    </div>
  );
}

export default SignupComp;
