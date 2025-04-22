import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Providers } from "@/components/providers";
import { AppSidebar } from "@/components/app-sidebar";
import RootLayoutContent from "@/components/root-layout-content";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SettingsProvider } from "@/lib/settings-context";
import { SessionErrorAlert } from "@/components/session-error-alert";

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
          <SettingsProvider>
            <SidebarProvider>
              <AppSidebar />
              <RootLayoutContent>
                <div className="flex justify-center w-full">
                  <div className="max-w-full md:max-w-3xl 2xl:max-w-6xl w-full p-6">
                    <SessionErrorAlert className="mb-6 rounded-b-xl p-4" />
                    {children}
                  </div>
                </div>
              </RootLayoutContent>
            </SidebarProvider>
          </SettingsProvider>
        </Providers>
      </body>
    </html>
  );
}
