"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import { PageHeader } from "@/components/admin/PageHeader"
import { DollarSign, Save } from "lucide-react"
import toast from "react-hot-toast"

export default function PricesPage() {
  const [routes, setRoutes] = useState<any[]>([])
  const [editing, setEditing] = useState<Record<string, any>>({})

  useEffect(() => { fetchRoutes() }, [])
  const fetchRoutes = async () => { const res = await fetch("/api/admin/routes"); const data = await res.json(); setRoutes(data); const editMap: Record<string, any> = {}; data.forEach((r: any) => { editMap[r.id] = { ...r } }); setEditing(editMap) }

  const updateField = (id: string, field: string, value: any) => { setEditing(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } })) }

  const saveRoute = async (id: string) => {
    const data = editing[id]
    const res = await fetch(`/api/admin/routes/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ baseFare: Number(data.baseFare), doorToDoorFare: Number(data.doorToDoorFare), doorToDoorEnabled: data.doorToDoorEnabled }) })
    if (res.ok) { toast.success("Prices updated"); fetchRoutes() } else toast.error("Failed to update")
  }

  return (
    <div className="p-8">
      <PageHeader title="Prices" description="Manage fares for all routes" icon={DollarSign} />
      <div className="bg-white rounded-xl border">
        <Table>
          <TableHeader><TableRow><TableHead>Route</TableHead><TableHead>Base Fare (KES)</TableHead><TableHead>Door-to-Door</TableHead><TableHead>Door-to-Door Fare (KES)</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {routes.map(route => (
              <TableRow key={route.id}>
                <TableCell className="font-medium">{route.origin} → {route.destination}</TableCell>
                <TableCell><Input type="number" value={editing[route.id]?.baseFare || 0} onChange={e => updateField(route.id, "baseFare", e.target.value)} className="w-32" /></TableCell>
                <TableCell><Switch checked={editing[route.id]?.doorToDoorEnabled ?? true} onCheckedChange={v => updateField(route.id, "doorToDoorEnabled", v)} /></TableCell>
                <TableCell><Input type="number" value={editing[route.id]?.doorToDoorFare || 0} onChange={e => updateField(route.id, "doorToDoorFare", e.target.value)} className="w-32" disabled={!editing[route.id]?.doorToDoorEnabled} /></TableCell>
                <TableCell><Button size="sm" onClick={() => saveRoute(route.id)}><Save className="h-4 w-4 mr-1" /> Save</Button></TableCell>
              </TableRow>
            ))}
            {routes.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No routes found</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
