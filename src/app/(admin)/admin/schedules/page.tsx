"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageHeader } from "@/components/admin/PageHeader"
import { Plus, Pencil, Trash2, Calendar } from "lucide-react"
import toast from "react-hot-toast"

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<any[]>([])
  const [routes, setRoutes] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [formData, setFormData] = useState({ routeId: "", departureTime: "", arrivalTime: "", vehicleCapacity: 14, daysOfWeek: [1,2,3,4,5,6,7] as number[], direction: "TO_SGR", active: true })

  useEffect(() => { fetchSchedules(); fetch("/api/admin/routes").then(r => r.json()).then(setRoutes) }, [])
  const fetchSchedules = async () => { const res = await fetch("/api/admin/schedules"); const data = await res.json(); setSchedules(data) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editing ? `/api/admin/schedules/${editing.id}` : "/api/admin/schedules"
    const res = await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) })
    if (res.ok) { toast.success(editing ? "Schedule updated" : "Schedule created"); setIsDialogOpen(false); setEditing(null); fetchSchedules() }
    else toast.error("Failed to save")
  }

  const handleDelete = async (id: string) => { if (!confirm("Delete this schedule?")) return; await fetch(`/api/admin/schedules/${id}`, { method: "DELETE" }); fetchSchedules(); toast.success("Deleted") }
  const toggleDay = (day: number) => { setFormData(prev => ({ ...prev, daysOfWeek: prev.daysOfWeek.includes(day) ? prev.daysOfWeek.filter(d => d !== day) : [...prev.daysOfWeek, day] })) }
  const openCreate = () => { setEditing(null); setFormData({ routeId: routes[0]?.id || "", departureTime: "", arrivalTime: "", vehicleCapacity: 14, daysOfWeek: [1,2,3,4,5,6,7], direction: "TO_SGR", active: true }); setIsDialogOpen(true) }
  const openEdit = (s: any) => { setEditing(s); setFormData({ routeId: s.routeId, departureTime: s.departureTime, arrivalTime: s.arrivalTime, vehicleCapacity: s.vehicleCapacity, daysOfWeek: s.daysOfWeek, direction: s.direction, active: s.active }); setIsDialogOpen(true) }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <PageHeader title="Schedules" description="Manage departure times and capacity" icon={Calendar} />
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" /> Add Schedule</Button>
      </div>
      <div className="bg-white rounded-xl border">
        <Table>
          <TableHeader><TableRow><TableHead>Route</TableHead><TableHead>Departure</TableHead><TableHead>Arrival</TableHead><TableHead>Capacity</TableHead><TableHead>Days</TableHead><TableHead>Direction</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {schedules.map(s => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.route?.name}</TableCell><TableCell>{s.departureTime}</TableCell><TableCell>{s.arrivalTime}</TableCell><TableCell>{s.vehicleCapacity} seats</TableCell>
                <TableCell><div className="flex gap-1">{s.daysOfWeek.map((d: number) => <span key={d} className="text-xs w-5 h-5 bg-mpesa/10 text-mpesa rounded-full flex items-center justify-center">{DAYS[d-1]?.charAt(0)}</span>)}</div></TableCell>
                <TableCell>{s.direction}</TableCell><TableCell>{s.active ? <span className="text-green-600 font-medium">Active</span> : "Inactive"}</TableCell>
                <TableCell><div className="flex gap-2"><Button size="sm" variant="ghost" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button><Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDelete(s.id)}><Trash2 className="h-4 w-4" /></Button></div></TableCell>
              </TableRow>
            ))}
            {schedules.length === 0 && <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No schedules found</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Schedule" : "Create Schedule"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Route</Label><Select value={formData.routeId} onValueChange={v => setFormData({...formData, routeId: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{routes.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent></Select></div>
            <div className="grid grid-cols-2 gap-4"><div><Label>Departure Time</Label><Input type="time" value={formData.departureTime} onChange={e => setFormData({...formData, departureTime: e.target.value})} required /></div><div><Label>Arrival Time</Label><Input type="time" value={formData.arrivalTime} onChange={e => setFormData({...formData, arrivalTime: e.target.value})} required /></div></div>
            <div className="grid grid-cols-2 gap-4"><div><Label>Vehicle Capacity</Label><Select value={String(formData.vehicleCapacity)} onValueChange={v => setFormData({...formData, vehicleCapacity: Number(v)})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{[7, 11, 14, 16, 28, 32].map(c => <SelectItem key={c} value={String(c)}>{c} seats</SelectItem>)}</SelectContent></Select></div><div><Label>Direction</Label><Select value={formData.direction} onValueChange={v => setFormData({...formData, direction: v as any})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="TO_SGR">To SGR</SelectItem><SelectItem value="FROM_SGR">From SGR</SelectItem></SelectContent></Select></div></div>
            <div><Label>Operating Days</Label><div className="flex gap-2 mt-2">{DAYS.map((day, i) => <button key={i} type="button" onClick={() => toggleDay(i+1)} className={`w-10 h-10 rounded-lg text-xs font-medium transition-colors ${formData.daysOfWeek.includes(i+1) ? "bg-mpesa text-white" : "bg-gray-100 hover:bg-gray-200"}`}>{day}</button>)}</div></div>
            <div className="flex items-center gap-2"><Switch checked={formData.active} onCheckedChange={v => setFormData({...formData, active: v})} /><Label>Active</Label></div>
            <Button type="submit" className="w-full">{editing ? "Update" : "Create"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
