import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { SideNav, TopBar } from "@/components/nav";

export const metadata: Metadata = {
  title: "Football Tipster",
  description:
    "Daily football tips backed by Poisson models — at most 2 high-confidence picks per day.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>
          <div className="flex min-h-screen">
            <SideNav />
            <div className="flex min-h-screen flex-1 flex-col">
              <TopBar />
              <main className="flex-1">
                <div className="mx-auto w-full max-w-6xl px-6 py-8">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
