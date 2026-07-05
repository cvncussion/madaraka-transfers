"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency, formatDate } from "@/lib/utils"
import { PageHeader } from "@/components/admin/PageHeader"
import { Ticket, Download, Search } from "lucide-react"
import toast from "react-hot-toast"

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")

  useEffect(() => { fetchBookings() }, [])
  const fetchBookings = async () => { const res = await fetch("/api/admin/bookings"); const data = await res.json(); setBookings(data); setFiltered(data) }

  useEffect(() => {
    let result = bookings
    if (search) { const q = search.toLowerCase(); result = result.filter(b => b.passengerName?.toLowerCase().includes(q) || b.ref?.toLowerCase().includes(q) || b.phone?.includes(q)) }
    if (statusFilter !== "ALL") result = result.filter(b => b.status === statusFilter)
    setFiltered(result)
  }, [search, statusFilter, bookings])

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/admin/bookings/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) })
    if (res.ok) { toast.success("Status updated"); fetchBookings() }
  }

  const exportCSV = () => {
    const headers = ["Ref", "Passenger", "Phone", "Route", "Seats", "Total", "Status", "Date"]
    const rows = filtered.map(b => [b.ref, b.passengerName, b.phone, b.route?.name, b.seats, b.totalFare, b.status, new Date(b.createdAt).toLocaleDateString()])
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = `bookings-${new Date().toISOString().split("T")[0]}.csv`; a.click()
  }

  return (
    <div className="p-8">
      <PageHeader title="Bookings" description="Manage all bookings" icon={Ticket} />
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><Input placeholder="Search by name, reference, or phone..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div>
        <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ALL">All Status</SelectItem><SelectItem value="PENDING">Pending</SelectItem><SelectItem value="CONFIRMED">Confirmed</SelectItem><SelectItem value="CANCELLED">Cancelled</SelectItem></SelectContent></Select>
        <Button variant="outline" onClick={exportCSV}><Download className="h-4 w-4 mr-2" /> Export</Button>
      </div>
      <div className="bg-white rounded-xl border">
        <Table>
          <TableHeader><TableRow><TableHead>Ref</TableHead><TableHead>Passenger</TableHead><TableHead>Phone</TableHead><TableHead>Route</TableHead><TableHead>Seats</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map(b => (
              <TableRow key={b.id}>
                <TableCell className="font-mono text-xs">{b.ref}</TableCell><TableCell className="font-medium">{b.passengerName}</TableCell><TableCell>{b.phone}</TableCell><TableCell>{b.route?.name}</TableCell><TableCell>{b.seats}</TableCell>
                <TableCell className="text-mpesa font-medium">{formatCurrency(b.totalFare)}</TableCell>
                <TableCell><Badge variant={b.status === "CONFIRMED" ? "success" : b.status === "PENDING" ? "warning" : "destructive"}>{b.status}</Badge></TableCell>
                <TableCell className="text-xs">{new Date(b.createdAt).toLocaleDateString()}</TableCell>
                <TableCell><Select value={b.status} onValueChange={(v) => updateStatus(b.id, v)}><SelectTrigger className="w-32 h-8"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="PENDING">Pending</SelectItem><SelectItem value="CONFIRMED">Confirmed</SelectItem><SelectItem value="CANCELLED">Cancelled</SelectItem><SelectItem value="COMPLETED">Completed</SelectItem></SelectContent></Select></TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">No bookings found</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
