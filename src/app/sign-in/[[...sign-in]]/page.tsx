import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function SignInPage() {
  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-16 flex justify-center">
      <SignIn />
    </div>
  );
}
