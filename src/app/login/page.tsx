import LoginComp from "@/components/login/login";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | My musics",
  description: "Login | My musics",
};

function page() {
  return (
    <div className="w-full min-h-dvh flex justify-center items-start p-2.5">
      <LoginComp />
    </div>
  );
}

export default page;
