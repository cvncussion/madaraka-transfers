"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import { PageHeader } from "@/components/admin/PageHeader"
import { Plus, Pencil, Trash2, Route } from "lucide-react"
import toast from "react-hot-toast"

export default function RoutesPage() {
  const [routes, setRoutes] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRoute, setEditingRoute] = useState<any>(null)
  const [formData, setFormData] = useState({ name: "", origin: "", destination: "", baseFare: 0, doorToDoorFare: 150, doorToDoorEnabled: true, distanceKm: 0, durationMin: 0, active: true })

  useEffect(() => { fetchRoutes() }, [])
  const fetchRoutes = async () => { const res = await fetch("/api/admin/routes"); const data = await res.json(); setRoutes(data) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editingRoute ? `/api/admin/routes/${editingRoute.id}` : "/api/admin/routes"
    const method = editingRoute ? "PUT" : "POST"
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) })
    if (res.ok) { toast.success(editingRoute ? "Route updated" : "Route created"); setIsDialogOpen(false); setEditingRoute(null); fetchRoutes() }
    else toast.error("Failed to save route")
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this route?")) return
    const res = await fetch(`/api/admin/routes/${id}`, { method: "DELETE" })
    if (res.ok) { toast.success("Route deleted"); fetchRoutes() } else toast.error("Failed to delete")
  }

  const openEdit = (route: any) => { setEditingRoute(route); setFormData({ name: route.name || "", origin: route.origin || "", destination: route.destination || "", baseFare: route.baseFare || 0, doorToDoorFare: route.doorToDoorFare || 150, doorToDoorEnabled: route.doorToDoorEnabled ?? true, distanceKm: route.distanceKm || 0, durationMin: route.durationMin || 0, active: route.active ?? true }); setIsDialogOpen(true) }
  const openCreate = () => { setEditingRoute(null); setFormData({ name: "", origin: "", destination: "", baseFare: 0, doorToDoorFare: 150, doorToDoorEnabled: true, distanceKm: 0, durationMin: 0, active: true }); setIsDialogOpen(true) }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <PageHeader title="Routes" description="Manage shuttle routes and pricing" icon={Route} />
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" /> Add Route</Button>
      </div>
      <div className="bg-white rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Name</TableHead><TableHead>Origin → Destination</TableHead><TableHead>Base Fare</TableHead><TableHead>Door-to-Door</TableHead><TableHead>Distance</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {routes.map((route: any) => (
              <TableRow key={route.id}>
                <TableCell className="font-medium">{route.name}</TableCell>
                <TableCell>{route.origin} → {route.destination}</TableCell>
                <TableCell className="text-mpesa font-medium">{formatCurrency(route.baseFare)}</TableCell>
                <TableCell>{route.doorToDoorEnabled ? `+${formatCurrency(route.doorToDoorFare)}` : "—"}</TableCell>
                <TableCell>{route.distanceKm} km</TableCell>
                <TableCell><span className={`px-2 py-1 rounded-full text-xs font-medium ${route.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>{route.active ? "Active" : "Inactive"}</span></TableCell>
                <TableCell><div className="flex gap-2"><Button size="sm" variant="ghost" onClick={() => openEdit(route)}><Pencil className="h-4 w-4" /></Button><Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDelete(route.id)}><Trash2 className="h-4 w-4" /></Button></div></TableCell>
              </TableRow>
            ))}
            {routes.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No routes found</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingRoute ? "Edit Route" : "Create Route"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Route Name</Label><Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g., Mombasa → SGR" required /></div>
            <div className="grid grid-cols-2 gap-4"><div><Label>Origin</Label><Input value={formData.origin} onChange={e => setFormData({...formData, origin: e.target.value})} placeholder="e.g., Mombasa CBD" required /></div><div><Label>Destination</Label><Input value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} placeholder="e.g., Miritini SGR" required /></div></div>
            <div className="grid grid-cols-2 gap-4"><div><Label>Base Fare (KES)</Label><Input type="number" value={formData.baseFare} onChange={e => setFormData({...formData, baseFare: Number(e.target.value)})} required /></div><div><Label>Distance (km)</Label><Input type="number" value={formData.distanceKm} onChange={e => setFormData({...formData, distanceKm: Number(e.target.value)})} /></div></div>
            <div className="grid grid-cols-2 gap-4"><div><Label>Duration (min)</Label><Input type="number" value={formData.durationMin} onChange={e => setFormData({...formData, durationMin: Number(e.target.value)})} /></div><div className="flex items-center gap-2 pt-6"><Switch checked={formData.doorToDoorEnabled} onCheckedChange={v => setFormData({...formData, doorToDoorEnabled: v})} /><Label>Door-to-Door</Label></div></div>
            {formData.doorToDoorEnabled && <div><Label>Door-to-Door Fare (KES)</Label><Input type="number" value={formData.doorToDoorFare} onChange={e => setFormData({...formData, doorToDoorFare: Number(e.target.value)})} /></div>}
            <div className="flex items-center gap-2"><Switch checked={formData.active} onCheckedChange={v => setFormData({...formData, active: v})} /><Label>Active</Label></div>
            <Button type="submit" className="w-full">{editingRoute ? "Update" : "Create"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
