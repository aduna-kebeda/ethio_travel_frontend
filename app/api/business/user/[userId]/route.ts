import { NextResponse } from "next/server"
import { getBusinessesByUserId } from "@/app/actions/business-actions"

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    const userId = params.userId
    const businesses = await getBusinessesByUserId(userId)

    return NextResponse.json(businesses)
  } catch (error) {
    console.error("Error in business API:", error)
    return NextResponse.json({ error: "Failed to fetch user businesses" }, { status: 500 })
  }
}
