import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const settings = await prisma.setting.findMany({ orderBy: { label: "asc" } })
  return NextResponse.json(settings)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { values } = await request.json()
  await Promise.all(Object.entries(values).map(([key, value]) => prisma.setting.updateMany({ where: { key }, data: { value: String(value) } })))
  return NextResponse.json({ success: true })
}
