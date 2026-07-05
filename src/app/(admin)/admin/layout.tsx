import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { LayoutDashboard, Route, Calendar, Ticket, Truck, Settings, DollarSign, FileText, LogOut, Bus } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/bookings", label: "Bookings", icon: Ticket },
    { href: "/admin/routes", label: "Routes", icon: Route },
    { href: "/admin/schedules", label: "Schedules", icon: Calendar },
    { href: "/admin/manifests", label: "Manifests", icon: FileText },
    { href: "/admin/vehicles", label: "Vehicles", icon: Truck },
    { href: "/admin/prices", label: "Prices", icon: DollarSign },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-gray-800">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Bus className="h-6 w-6 text-mpesa" />
            <h1 className="font-bold text-lg">Madaraka Admin</h1>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors">
              <item.icon className="h-5 w-5 text-gray-400" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <Link href="/api/auth/signout" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-400">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
