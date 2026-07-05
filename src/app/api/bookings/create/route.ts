import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateRef, formatPhone } from "@/lib/utils"
import { initiateSTKPush } from "@/lib/mpesa"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { passengerName, phone, routeId, scheduleId, direction, pickupLocation, dropLocation, seats, doorToDoor, travelDate } = body

    const route = await prisma.route.findUnique({ where: { id: routeId } })
    const schedule = await prisma.schedule.findUnique({ where: { id: scheduleId } })
    if (!route || !schedule) return NextResponse.json({ error: "Route or schedule not found" }, { status: 404 })

    const travelDateStart = new Date(travelDate); travelDateStart.setHours(0, 0, 0, 0)
    const travelDateEnd = new Date(travelDateStart); travelDateEnd.setDate(travelDateEnd.getDate() + 1)

    const existingBookings = await prisma.booking.count({
      where: { scheduleId, status: { in: ["PENDING", "CONFIRMED"] }, travelDate: { gte: travelDateStart, lt: travelDateEnd } },
    })
    if (existingBookings + seats > schedule.vehicleCapacity) return NextResponse.json({ error: "Not enough seats available" }, { status: 400 })

    const baseFare = route.baseFare * seats
    const doorToDoorCharge = doorToDoor && route.doorToDoorEnabled ? route.doorToDoorFare * seats : 0
    const totalFare = baseFare + doorToDoorCharge
    const ref = generateRef()
    const normalizedPhone = formatPhone(phone)

    const booking = await prisma.booking.create({
      data: { ref, passengerName, phone: normalizedPhone, routeId, scheduleId, direction, pickupLocation: pickupLocation || route.origin, dropLocation: dropLocation || route.destination, seats, doorToDoor, baseFare, doorToDoorCharge, totalFare, travelDate: new Date(travelDate) },
    })

    try {
      const mpesaResponse = await initiateSTKPush(normalizedPhone, totalFare, ref, "Madaraka Transfers Shuttle")
      await prisma.booking.update({ where: { id: booking.id }, data: { mpesaCheckoutId: mpesaResponse.CheckoutRequestID } })
    } catch (mpesaError: any) { console.error("M-Pesa error:", mpesaError.message) }

    return NextResponse.json({ ref: booking.ref, bookingId: booking.id })
  } catch (error: any) { console.error("Booking error:", error); return NextResponse.json({ error: "Failed to create booking" }, { status: 500 }) }
}
