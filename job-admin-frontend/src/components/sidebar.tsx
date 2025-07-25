// src/components/sidebar.tsx

import Link from "next/link";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Jobs", href: "/jobs" },
  { label: "Applications", href: "/applications" },
  { label: "Settings", href: "/settings" },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r shadow-sm">
      <div className="p-6 text-xl font-bold border-b">Job Admin</div>
      <nav className="flex flex-col p-4 gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-100 transition"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
