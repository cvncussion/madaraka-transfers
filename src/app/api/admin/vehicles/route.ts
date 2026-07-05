import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function checkAuth() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  return null
}

export async function GET() {
  const authError = await checkAuth()
  if (authError) return authError
  const vehicles = await prisma.vehicle.findMany({ orderBy: { createdAt: "desc" } })
  return NextResponse.json(vehicles)
}

export async function POST(request: Request) {
  const authError = await checkAuth()
  if (authError) return authError
  const body = await request.json()
  const vehicle = await prisma.vehicle.create({ data: body })
  return NextResponse.json(vehicle)
}
