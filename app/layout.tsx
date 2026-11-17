import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agent Inbox Demo",
  description: "A rule-based sales agent powered by real AgentMail email threads."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
