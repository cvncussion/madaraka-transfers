import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const routeId = searchParams.get("routeId")
  const date = searchParams.get("date")
  
  const dayOfWeek = date ? new Date(date).getDay() + 1 : new Date().getDay() + 1
  
  const where: any = { active: true }
  if (routeId) where.routeId = routeId
  
  const schedules = await prisma.schedule.findMany({ where, include: { route: true } })
  const filtered = schedules.filter(s => s.daysOfWeek.includes(dayOfWeek))

  const withAvailability = await Promise.all(
    filtered.map(async (s) => {
      const bookingCount = await prisma.booking.count({
        where: { scheduleId: s.id, status: { in: ["PENDING", "CONFIRMED"] }, ...(date ? { travelDate: { gte: new Date(date), lt: new Date(new Date(date).getTime() + 86400000) } } : {}) },
      })
      return { ...s, availableSeats: Math.max(0, s.vehicleCapacity - bookingCount) }
    })
  )

  return NextResponse.json(withAvailability)
}
