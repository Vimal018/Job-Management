// src/app/layout.tsx

import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ClientToaster } from '@/components/ClientToaster';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Job Admin Dashboard",
  description: "Manage job postings and applications easily.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="hydrated">
      <body className={cn("min-h-screen bg-gray-100 text-gray-900", inter.className)}>
      {children}
    <ClientToaster />
    </body>
    </html>
  );
}
