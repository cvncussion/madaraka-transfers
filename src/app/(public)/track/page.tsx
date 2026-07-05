"use client"

import { useState } from "react";
import { Search, MapPin, Clock, User, Phone, CreditCard, Bus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/public/Navbar";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";

export default function TrackPage() {
  const [ref, setRef] = useState("");
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!ref.trim()) return;
    setLoading(true); setError(""); setBooking(null);
    try {
      const res = await fetch(`/api/bookings?ref=${ref.trim()}`);
      const data = await res.json();
      if (res.ok && data) { setBooking(data); } else { setError(data.error || "Booking not found"); }
    } catch (e) { setError("An error occurred"); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-mpesa/10 rounded-full flex items-center justify-center mx-auto mb-4"><Search className="h-8 w-8 text-mpesa" /></div>
          <h1 className="text-2xl font-bold">Track Your Booking</h1>
          <p className="text-muted-foreground mt-1">Enter your booking reference to check status</p>
        </div>

        <div className="flex gap-2 mb-8">
          <Input placeholder="Enter booking reference (e.g., MTXXXX)" value={ref} onChange={e => setRef(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()} />
          <Button onClick={handleSearch} disabled={loading}>{loading ? "..." : "Search"}</Button>
        </div>

        {error && <div className="text-center p-6 bg-red-50 rounded-xl border border-red-200 text-red-600">{error}</div>}

        {booking && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center pb-4 border-b">
                <div><p className="text-sm text-muted-foreground">Booking Reference</p><p className="font-mono font-bold text-lg">{booking.ref}</p></div>
                <Badge variant={booking.status === "CONFIRMED" ? "success" : booking.status === "PENDING" ? "warning" : "destructive"}>{booking.status}</Badge>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3"><User className="h-4 w-4 text-mpesa" /><span className="text-muted-foreground w-20">Passenger</span><span className="font-medium">{booking.passengerName}</span></div>
                <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-mpesa" /><span className="text-muted-foreground w-20">Phone</span><span className="font-medium">{booking.phone}</span></div>
                <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-mpesa" /><span className="text-muted-foreground w-20">Route</span><span className="font-medium">{booking.route?.name}</span></div>
                <div className="flex items-center gap-3"><Clock className="h-4 w-4 text-mpesa" /><span className="text-muted-foreground w-20">Departure</span><span className="font-medium">{booking.schedule?.departureTime}</span></div>
                <div className="flex items-center gap-3"><Bus className="h-4 w-4 text-mpesa" /><span className="text-muted-foreground w-20">Seats</span><span className="font-medium">{booking.seats}</span></div>
              </div>
              <div className="pt-4 border-t flex justify-between items-center">
                <span className="text-muted-foreground">Total Paid</span>
                <span className="text-2xl font-bold text-mpesa">{formatCurrency(booking.totalFare)}</span>
              </div>
              <Link href={`/booking/${booking.ref}`}><Button className="w-full mt-4">View Full Ticket</Button></Link>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
