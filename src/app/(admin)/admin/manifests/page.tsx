"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHeader } from "@/components/admin/PageHeader"
import { FileText, Download, Share2, Printer } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"

export default function ManifestsPage() {
  const [schedules, setSchedules] = useState<any[]>([])
  const [selectedScheduleId, setSelectedScheduleId] = useState("")
  const [manifest, setManifest] = useState<any>(null)
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0])

  useEffect(() => { fetch("/api/admin/schedules").then(r => r.json()).then(data => { setSchedules(data); if (data.length > 0) setSelectedScheduleId(data[0].id) }) }, [])
  const loadManifest = async () => { if (!selectedScheduleId) return; const res = await fetch(`/api/admin/manifests?scheduleId=${selectedScheduleId}&date=${date}`); const data = await res.json(); setManifest(data) }

  const shareWhatsApp = () => {
    if (!manifest) return
    const lines = manifest.bookings.map((b: any, i: number) => `${i+1}. ${b.passengerName} - ${b.phone} - ${b.seats} seat(s) - ${b.pickupLocation} → ${b.dropLocation}`).join("\n")
    const text = `*Madaraka Transfers - Driver Manifest*\n${manifest.schedule.route.origin} → ${manifest.schedule.route.destination}\nDate: ${formatDate(date)}\nDeparture: ${manifest.schedule.departureTime}\n\n${lines}\n\nTotal: ${manifest.bookings.length} bookings, ${manifest.bookings.reduce((s: number, b: any) => s + b.seats, 0)} seats`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`)
  }

  const downloadText = () => {
    if (!manifest) return
    const lines = manifest.bookings.map((b: any, i: number) => `${i+1}. ${b.passengerName} | ${b.phone} | ${b.seats} seats | ${b.pickupLocation} → ${b.dropLocation} | KES ${b.totalFare}`).join("\n")
    const text = `MADARAKA TRANSFERS - DRIVER MANIFEST\n${manifest.schedule.route.origin} → ${manifest.schedule.route.destination}\nDate: ${formatDate(date)}\nDeparture: ${manifest.schedule.departureTime}\nVehicle: ${manifest.vehicle?.plateNumber || "N/A"} | Driver: ${manifest.vehicle?.driverName || "N/A"}\n\n${lines}\n\nTotal Bookings: ${manifest.bookings.length}\nTotal Seats: ${manifest.bookings.reduce((s: number, b: any) => s + b.seats, 0)}\nTotal Revenue: KES ${manifest.bookings.reduce((s: number, b: any) => s + b.totalFare, 0)}`
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = `manifest-${manifest.schedule.departureTime}-${date}.txt`; a.click()
  }

  return (
    <div className="p-8">
      <PageHeader title="Manifests" description="Generate driver manifests" icon={FileText} />
      <div className="flex gap-4 mb-6">
        <Select value={selectedScheduleId} onValueChange={setSelectedScheduleId}><SelectTrigger className="w-80"><SelectValue placeholder="Select schedule" /></SelectTrigger><SelectContent>{schedules.map(s => <SelectItem key={s.id} value={s.id}>{s.route?.name} - {s.departureTime} ({s.vehicleCapacity} seats)</SelectItem>)}</SelectContent></Select>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border rounded-lg px-3" />
        <Button onClick={loadManifest}>Load Manifest</Button>
      </div>
      {manifest && (
        <>
          <div className="flex gap-2 mb-4">
            <Button variant="outline" size="sm" onClick={shareWhatsApp}><Share2 className="h-4 w-4 mr-1" /> WhatsApp</Button>
            <Button variant="outline" size="sm" onClick={downloadText}><Download className="h-4 w-4 mr-1" /> Download</Button>
            <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="h-4 w-4 mr-1" /> Print</Button>
          </div>
          <div className="bg-white rounded-xl border overflow-hidden print:shadow-none">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">Driver Manifest</h2>
              <p className="text-muted-foreground">{manifest.schedule.route.origin} → {manifest.schedule.route.destination}</p>
              <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                <div><span className="text-muted-foreground">Date:</span> {formatDate(date)}</div>
                <div><span className="text-muted-foreground">Departure:</span> {manifest.schedule.departureTime}</div>
                <div><span className="text-muted-foreground">Vehicle:</span> {manifest.vehicle?.plateNumber || "N/A"}</div>
                <div><span className="text-muted-foreground">Driver:</span> {manifest.vehicle?.driverName || "N/A"}</div>
                <div><span className="text-muted-foreground">Capacity:</span> {manifest.schedule.vehicleCapacity} seats</div>
                <div><span className="text-muted-foreground">Bookings:</span> {manifest.bookings.length} passengers</div>
              </div>
            </div>
            <Table>
              <TableHeader><TableRow><TableHead>#</TableHead><TableHead>Passenger</TableHead><TableHead>Phone</TableHead><TableHead>Seats</TableHead><TableHead>Pickup</TableHead><TableHead>Drop</TableHead><TableHead>Door-to-Door</TableHead><TableHead>Fare</TableHead></TableRow></TableHeader>
              <TableBody>
                {manifest.bookings.map((b: any, i: number) => (
                  <TableRow key={b.id}><TableCell>{i+1}</TableCell><TableCell className="font-medium">{b.passengerName}</TableCell><TableCell>{b.phone}</TableCell><TableCell>{b.seats}</TableCell><TableCell>{b.pickupLocation}</TableCell><TableCell>{b.dropLocation}</TableCell><TableCell>{b.doorToDoor ? "Yes" : "No"}</TableCell><TableCell>{formatCurrency(b.totalFare)}</TableCell></TableRow>
                ))}
                {manifest.bookings.length === 0 && <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No bookings for this schedule</TableCell></TableRow>}
              </TableBody>
            </Table>
            {manifest.bookings.length > 0 && (
              <div className="p-4 border-t bg-gray-50 flex justify-between text-sm">
                <span className="font-medium">Total Seats: {manifest.bookings.reduce((s: number, b: any) => s + b.seats, 0)} / {manifest.schedule.vehicleCapacity}</span>
                <span className="font-medium">Total Revenue: {formatCurrency(manifest.bookings.reduce((s: number, b: any) => s + b.totalFare, 0))}</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
