import SignupComp from "@/components/signup/signup";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signup | My musics",
  description: "Signup | My musics",
};

function page() {
  return (
    <div className="w-full min-h-dvh flex justify-center items-start p-2.5">
      <SignupComp />
    </div>
  );
}

export default page;
