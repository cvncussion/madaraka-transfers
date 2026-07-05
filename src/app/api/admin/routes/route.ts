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
  const routes = await prisma.route.findMany({ orderBy: { createdAt: "desc" } })
  return NextResponse.json(routes)
}

export async function POST(request: Request) {
  const authError = await checkAuth()
  if (authError) return authError
  const body = await request.json()
  const route = await prisma.route.create({ data: body })
  return NextResponse.json(route)
}
