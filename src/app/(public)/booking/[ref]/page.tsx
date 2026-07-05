import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Check, QrCode, Download, Share2, Bus, MapPin, Clock, User, Phone, Calendar } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/public/Navbar";

export default async function BookingPage({ params }: { params: { ref: string } }) {
  const booking = await prisma.booking.findUnique({
    where: { ref: params.ref },
    include: { route: true, schedule: true },
  });

  if (!booking) notFound();

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-mpesa/10 rounded-full flex items-center justify-center mx-auto mb-4"><Check className="h-8 w-8 text-mpesa" /></div>
          <h1 className="text-2xl font-bold">Booking Confirmed</h1>
          <p className="text-muted-foreground">Ref: <span className="font-mono font-bold">{booking.ref}</span></p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="text-muted-foreground">Status</span>
              <Badge variant={booking.status === "CONFIRMED" ? "success" : "warning"}>{booking.status}</Badge>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-muted-foreground"><User className="h-4 w-4" /><span>Passenger</span></div><span className="font-medium">{booking.passengerName}</span></div>
              <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" /><span>Phone</span></div><span className="font-medium">{booking.phone}</span></div>
              <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /><span>Route</span></div><span className="font-medium">{booking.route.name}</span></div>
              <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-muted-foreground"><Bus className="h-4 w-4" /><span>Direction</span></div><span className="font-medium">{booking.direction === "TO_SGR" ? "To SGR" : "From SGR"}</span></div>
              <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /><span>Pickup</span></div><span className="font-medium">{booking.pickupLocation}</span></div>
              <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /><span>Drop</span></div><span className="font-medium">{booking.dropLocation}</span></div>
              <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4" /><span>Departure</span></div><span className="font-medium">{booking.schedule.departureTime}</span></div>
              <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4" /><span>Date</span></div><span className="font-medium">{formatDate(booking.travelDate)}</span></div>
              <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-muted-foreground"><Bus className="h-4 w-4" /><span>Seats</span></div><span className="font-medium">{booking.seats}</span></div>
              {booking.doorToDoor && <div className="flex items-center justify-between"><span className="text-muted-foreground">Door-to-Door</span><span className="font-medium">Yes (+{formatCurrency(booking.doorToDoorCharge)})</span></div>}
            </div>
            <div className="pt-4 border-t flex justify-between items-center">
              <span className="text-lg font-bold">Total Paid</span>
              <span className="text-2xl font-bold text-mpesa">{formatCurrency(booking.totalFare)}</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1"><QrCode className="h-4 w-4 mr-2" /> Show QR</Button>
          <Button variant="outline" className="flex-1" onClick={() => window.print()}><Download className="h-4 w-4 mr-2" /> PDF</Button>
          <Button variant="outline" className="flex-1" onClick={() => { const text = `My Madaraka Transfers booking: ${booking.ref}`; window.open(`https://wa.me/?text=${encodeURIComponent(text)}`); }}><Share2 className="h-4 w-4 mr-2" /> Share</Button>
        </div>
        <div className="mt-6 text-center"><Link href="/" className="text-mpesa hover:underline text-sm">← Back to Home</Link></div>
      </div>
    </main>
  );
}
