"use client";

import { DataTableDemo } from "@/components/example-employee-table";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="flex items-center justify-between w-full max-w-3xl mx-auto">
        <div className="fixed top-4 right-4">
          <ThemeToggle />
        </div>
      </header>
      <main className="flex flex-col items-center justify-center gap-8">
        {/* Employee Table Example */}
        <div className="w-full max-w-3xl mx-auto">
          <DataTableDemo />
        </div>

      </main>
    </div>
  );
}
