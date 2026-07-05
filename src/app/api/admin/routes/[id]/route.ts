import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function checkAuth() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  return null
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const authError = await checkAuth()
  if (authError) return authError
  const body = await request.json()
  const route = await prisma.route.update({ where: { id: params.id }, data: body })
  return NextResponse.json(route)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const authError = await checkAuth()
  if (authError) return authError
  await prisma.route.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
