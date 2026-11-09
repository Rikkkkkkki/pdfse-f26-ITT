import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StackLock — Pick one stack. Ship it tonight.",
  description:
    "Lock one opinionated starter stack and finish three Day 1 steps before tutorial paralysis sets in.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
