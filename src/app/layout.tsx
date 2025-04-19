import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Providers } from "@/components/providers";
import { AppSidebar } from "@/components/app-sidebar";
import RootLayoutContent from "@/components/root-layout-content";
import { SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Odoo Lens",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <Providers>
          <SidebarProvider>
            <AppSidebar />
            <RootLayoutContent>
              {children}
            </RootLayoutContent>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
