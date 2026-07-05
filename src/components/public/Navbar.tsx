"use client"

import Link from "next/link";
import { Bus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Bus className="h-8 w-8 text-mpesa" />
          <span className="font-bold text-xl">Madaraka Transfers</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <Link href="/schedule" className="text-sm font-medium hover:text-mpesa transition-colors">Schedule</Link>
          <Link href="/track" className="text-sm font-medium hover:text-mpesa transition-colors">Track Booking</Link>
          <Link href="/admin/login"><Button variant="outline" size="sm">Admin</Button></Link>
        </div>

        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-white px-4 py-3 space-y-3">
          <Link href="/schedule" className="block text-sm font-medium hover:text-mpesa" onClick={() => setMobileOpen(false)}>Schedule</Link>
          <Link href="/track" className="block text-sm font-medium hover:text-mpesa" onClick={() => setMobileOpen(false)}>Track Booking</Link>
          <Link href="/admin/login" onClick={() => setMobileOpen(false)}>
            <Button variant="outline" size="sm" className="w-full">Admin</Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
