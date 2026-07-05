import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const ref = searchParams.get("ref")
  if (!ref) return NextResponse.json({ error: "Reference required" }, { status: 400 })

  const booking = await prisma.booking.findUnique({ where: { ref }, include: { route: true, schedule: true } })
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 })

  return NextResponse.json(booking)
}
