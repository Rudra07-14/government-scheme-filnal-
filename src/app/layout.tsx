import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: {
    default: "Yojana Setu — Government Schemes, Made Simple",
    template: "%s | Yojana Setu",
  },
  description:
    "Discover government schemes, understand eligibility, prepare required documents, and reach the official application portal.",
  openGraph: {
    title: "Yojana Setu — Government Schemes, Made Simple",
    description:
      "Discover government schemes, understand eligibility, and apply through official portals.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en" className="h-full antialiased">
        <body className="min-h-full flex flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
