import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const scheduleId = searchParams.get("scheduleId")
  const date = searchParams.get("date")
  if (!scheduleId) return NextResponse.json({ error: "Schedule ID required" }, { status: 400 })

  const schedule = await prisma.schedule.findUnique({ where: { id: scheduleId }, include: { route: true } })
  if (!schedule) return NextResponse.json({ error: "Schedule not found" }, { status: 404 })

  const vehicle = await prisma.vehicle.findFirst({ where: { capacity: { gte: schedule.vehicleCapacity }, active: true } })

  const travelDateStart = date ? new Date(date) : new Date(); travelDateStart.setHours(0, 0, 0, 0)
  const travelDateEnd = new Date(travelDateStart); travelDateEnd.setDate(travelDateEnd.getDate() + 1)

  const bookings = await prisma.booking.findMany({
    where: { scheduleId, status: { in: ["PENDING", "CONFIRMED"] }, travelDate: { gte: travelDateStart, lt: travelDateEnd } },
    orderBy: { createdAt: "asc" },
  })

  return NextResponse.json({ schedule, bookings, vehicle })
}
