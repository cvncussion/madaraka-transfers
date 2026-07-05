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
import { Plus, Pencil, Trash2, Truck } from "lucide-react"
import toast from "react-hot-toast"

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [formData, setFormData] = useState({ driverName: "", driverPhone: "", plateNumber: "", capacity: 14, type: "shuttle", active: true })

  useEffect(() => { fetchVehicles() }, [])
  const fetchVehicles = async () => { const res = await fetch("/api/admin/vehicles"); const data = await res.json(); setVehicles(data) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch(editing ? `/api/admin/vehicles/${editing.id}` : "/api/admin/vehicles", { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) })
    if (res.ok) { toast.success(editing ? "Vehicle updated" : "Vehicle created"); setIsDialogOpen(false); setEditing(null); fetchVehicles() }
    else toast.error("Failed to save")
  }

  const handleDelete = async (id: string) => { if (!confirm("Delete this vehicle?")) return; await fetch(`/api/admin/vehicles/${id}`, { method: "DELETE" }); fetchVehicles(); toast.success("Deleted") }
  const openCreate = () => { setEditing(null); setFormData({ driverName: "", driverPhone: "", plateNumber: "", capacity: 14, type: "shuttle", active: true }); setIsDialogOpen(true) }
  const openEdit = (v: any) => { setEditing(v); setFormData({ driverName: v.driverName, driverPhone: v.driverPhone || "", plateNumber: v.plateNumber, capacity: v.capacity, type: v.type, active: v.active }); setIsDialogOpen(true) }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <PageHeader title="Vehicles" description="Manage vehicles and drivers" icon={Truck} />
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" /> Add Vehicle</Button>
      </div>
      <div className="bg-white rounded-xl border">
        <Table>
          <TableHeader><TableRow><TableHead>Plate Number</TableHead><TableHead>Driver</TableHead><TableHead>Phone</TableHead><TableHead>Capacity</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {vehicles.map(v => (
              <TableRow key={v.id}>
                <TableCell className="font-mono font-medium">{v.plateNumber}</TableCell><TableCell className="font-medium">{v.driverName}</TableCell><TableCell>{v.driverPhone || "—"}</TableCell><TableCell>{v.capacity} seats</TableCell><TableCell className="capitalize">{v.type}</TableCell>
                <TableCell>{v.active ? <span className="text-green-600 font-medium">Active</span> : "Inactive"}</TableCell>
                <TableCell><div className="flex gap-2"><Button size="sm" variant="ghost" onClick={() => openEdit(v)}><Pencil className="h-4 w-4" /></Button><Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDelete(v.id)}><Trash2 className="h-4 w-4" /></Button></div></TableCell>
              </TableRow>
            ))}
            {vehicles.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No vehicles found</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit Vehicle" : "Add Vehicle"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4"><div><Label>Driver Name</Label><Input value={formData.driverName} onChange={e => setFormData({...formData, driverName: e.target.value})} required /></div><div><Label>Driver Phone</Label><Input value={formData.driverPhone} onChange={e => setFormData({...formData, driverPhone: e.target.value})} placeholder="07XX XXX XXX" /></div></div>
            <div className="grid grid-cols-2 gap-4"><div><Label>Plate Number</Label><Input value={formData.plateNumber} onChange={e => setFormData({...formData, plateNumber: e.target.value})} placeholder="KXX 123X" required /></div><div><Label>Capacity</Label><Select value={String(formData.capacity)} onValueChange={v => setFormData({...formData, capacity: Number(v)})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{[7, 11, 14, 16, 28, 32].map(c => <SelectItem key={c} value={String(c)}>{c} seats</SelectItem>)}</SelectContent></Select></div></div>
            <div><Label>Type</Label><Select value={formData.type} onValueChange={v => setFormData({...formData, type: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="shuttle">Shuttle</SelectItem><SelectItem value="van">Van</SelectItem><SelectItem value="bus">Bus</SelectItem></SelectContent></Select></div>
            <div className="flex items-center gap-2"><Switch checked={formData.active} onCheckedChange={v => setFormData({...formData, active: v})} /><Label>Active</Label></div>
            <Button type="submit" className="w-full">{editing ? "Update" : "Create"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
