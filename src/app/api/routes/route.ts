import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const direction = searchParams.get("direction")
  
  const routes = await prisma.route.findMany({
    where: {
      active: true,
      ...(direction === "TO_SGR" ? { destination: "Miritini SGR Station" } :
        direction === "FROM_SGR" ? { origin: "Miritini SGR Station" } : {}),
    },
    orderBy: { baseFare: "asc" },
  })
  
  return NextResponse.json(routes)
}
