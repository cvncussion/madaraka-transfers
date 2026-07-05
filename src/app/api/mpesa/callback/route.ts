import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendSMS, buildConfirmationSMS } from "@/lib/sms"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { Body: { stkCallback } } = body
    const checkoutRequestId = stkCallback.CheckoutRequestID
    const resultCode = stkCallback.ResultCode
    const mpesaReceipt = stkCallback.CallbackMetadata?.Item?.find((i: any) => i.Name === "MpesaReceiptNumber")?.Value

    const booking = await prisma.booking.findFirst({ where: { mpesaCheckoutId: checkoutRequestId }, include: { route: true, schedule: true } })
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 })

    if (resultCode === 0) {
      await prisma.booking.update({ where: { id: booking.id }, data: { status: "CONFIRMED", mpesaReceipt: mpesaReceipt || "" } })
      const message = buildConfirmationSMS(booking.ref, booking.route.name, booking.direction, booking.schedule.departureTime, new Date(booking.travelDate).toLocaleDateString("en-KE"), booking.seats, booking.totalFare, booking.pickupLocation, booking.dropLocation, process.env.NEXT_PUBLIC_BUSINESS_PHONE || "")
      await sendSMS(booking.phone, message)
    } else {
      await prisma.booking.update({ where: { id: booking.id }, data: { status: "CANCELLED" } })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) { console.error("Callback error:", error); return NextResponse.json({ error: "Callback failed" }, { status: 500 }) }
}
