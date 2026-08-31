import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function SignUpPage() {
  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-16 flex justify-center">
      <SignUp />
    </div>
  );
}
