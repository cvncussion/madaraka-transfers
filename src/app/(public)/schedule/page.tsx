"use client"

import { useState, useEffect } from "react";
import { Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/public/Navbar";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default function SchedulePage() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<string>("all");
  const [direction, setDirection] = useState<string>("TO_SGR");

  useEffect(() => {
    fetch(`/api/routes?direction=${direction}`).then(r => r.json()).then(setRoutes);
  }, [direction]);

  useEffect(() => {
    const url = selectedRoute === "all" 
      ? `/api/schedules?date=${new Date().toISOString().split("T")[0]}`
      : `/api/schedules?routeId=${selectedRoute}&date=${new Date().toISOString().split("T")[0]}`;
    fetch(url).then(r => r.json()).then(setSchedules);
  }, [selectedRoute, direction]);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Shuttle Schedule</h1>

        <div className="flex gap-2 mb-6">
          <button onClick={() => setDirection("TO_SGR")} className={`px-4 py-2 rounded-lg font-medium transition-colors ${direction === "TO_SGR" ? "bg-mpesa text-white" : "bg-white border hover:bg-gray-50"}`}>To SGR Station</button>
          <button onClick={() => setDirection("FROM_SGR")} className={`px-4 py-2 rounded-lg font-medium transition-colors ${direction === "FROM_SGR" ? "bg-mpesa text-white" : "bg-white border hover:bg-gray-50"}`}>From SGR Station</button>
        </div>

        <div className="bg-white rounded-xl border p-4 mb-6">
          <label className="text-sm font-medium mb-2 block">Filter by Route</label>
          <select value={selectedRoute} onChange={e => setSelectedRoute(e.target.value)} className="w-full p-2 border rounded-lg">
            <option value="all">All Routes</option>
            {routes.map(route => <option key={route.id} value={route.id}>{route.origin} → {route.destination}</option>)}
          </select>
        </div>

        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b bg-gray-50">
                <th className="text-left p-4 font-medium">Route</th>
                <th className="text-left p-4 font-medium">Departure</th>
                <th className="text-left p-4 font-medium">Arrival</th>
                <th className="text-left p-4 font-medium">Capacity</th>
                <th className="text-left p-4 font-medium">Days</th>
                <th className="text-left p-4 font-medium">Fare</th>
                <th className="text-left p-4 font-medium"></th>
              </tr></thead>
              <tbody>
                {schedules.map(s => (
                  <tr key={s.id} className="border-b hover:bg-gray-50">
                    <td className="p-4"><div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-mpesa" /><span className="font-medium">{s.route.origin} → {s.route.destination}</span></div></td>
                    <td className="p-4"><div className="flex items-center gap-2"><Clock className="h-4 w-4 text-ocean" />{s.departureTime}</div></td>
                    <td className="p-4">{s.arrivalTime}</td>
                    <td className="p-4"><Badge variant="secondary">{s.vehicleCapacity} seats</Badge></td>
                    <td className="p-4"><div className="flex gap-1">{s.daysOfWeek.map((d: number) => <span key={d} className="text-xs w-6 h-6 bg-mpesa/10 text-mpesa rounded-full flex items-center justify-center">{daysOfWeek[d - 1]?.charAt(0)}</span>)}</div></td>
                    <td className="p-4 font-medium text-mpesa">{formatCurrency(s.route.baseFare)}</td>
                    <td className="p-4"><Link href={`/book?direction=${direction.toLowerCase().replace("_", "-")}`}><button className="text-mpesa hover:underline text-sm font-medium">Book →</button></Link></td>
                  </tr>
                ))}
                {schedules.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No schedules available.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
