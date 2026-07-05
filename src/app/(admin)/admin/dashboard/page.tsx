import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatsCard } from "@/components/admin/StatsCard";
import { DollarSign, Route, Truck, Ticket, TrendingUp } from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);

  const [todayBookings, todayRevenue, totalRoutes, totalVehicles, totalBookings, confirmedBookings] = await Promise.all([
    prisma.booking.count({ where: { createdAt: { gte: today, lt: tomorrow } } }),
    prisma.booking.aggregate({ where: { createdAt: { gte: today, lt: tomorrow }, status: "CONFIRMED" }, _sum: { totalFare: true } }),
    prisma.route.count({ where: { active: true } }),
    prisma.vehicle.count({ where: { active: true } }),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
  ]);

  const recentBookings = await prisma.booking.findMany({ take: 10, orderBy: { createdAt: "desc" }, include: { route: true, schedule: true } });

  return (
    <div className="p-8">
      <PageHeader title="Dashboard" description="Overview of your shuttle business" icon={TrendingUp} />
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Today's Bookings" value={todayBookings} icon={Ticket} />
        <StatsCard title="Today's Revenue" value={formatCurrency(todayRevenue._sum.totalFare || 0)} icon={DollarSign} className="text-mpesa" />
        <StatsCard title="Active Routes" value={totalRoutes} icon={Route} />
        <StatsCard title="Vehicles" value={totalVehicles} icon={Truck} />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">Recent Bookings</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b text-muted-foreground"><th className="text-left py-2">Ref</th><th className="text-left py-2">Passenger</th><th className="text-left py-2">Route</th><th className="text-left py-2">Amount</th><th className="text-left py-2">Status</th></tr></thead>
                <tbody>
                  {recentBookings.map(b => (
                    <tr key={b.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 font-mono">{b.ref}</td><td className="py-2">{b.passengerName}</td><td className="py-2">{b.route?.name}</td>
                      <td className="py-2">{formatCurrency(b.totalFare)}</td>
                      <td className="py-2"><span className={`px-2 py-1 rounded-full text-xs font-medium ${b.status === "CONFIRMED" ? "bg-green-100 text-green-800" : b.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>{b.status}</span></td>
                    </tr>
                  ))}
                  {recentBookings.length === 0 && <tr><td colSpan={5} className="py-4 text-center text-muted-foreground">No bookings yet</td></tr>}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Business Summary</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b"><span className="text-muted-foreground">Total Bookings</span><span className="font-bold">{totalBookings}</span></div>
            <div className="flex justify-between items-center py-2 border-b"><span className="text-muted-foreground">Confirmed Bookings</span><span className="font-bold text-green-600">{confirmedBookings}</span></div>
            <div className="flex justify-between items-center py-2 border-b"><span className="text-muted-foreground">Pending Bookings</span><span className="font-bold text-yellow-600">{totalBookings - confirmedBookings}</span></div>
            <div className="flex justify-between items-center py-2"><span className="text-muted-foreground">Success Rate</span><span className="font-bold">{totalBookings > 0 ? Math.round((confirmedBookings / totalBookings) * 100) : 0}%</span></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
