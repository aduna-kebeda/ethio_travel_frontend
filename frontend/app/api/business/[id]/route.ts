import { NextResponse } from "next/server"
import { fetchBusinessById, getBusinessById } from "@/app/actions/business-actions"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Try to get from API first
    const apiResult = await fetchBusinessById(id)

    // If API call succeeds, return the data
    if (apiResult.success) {
      return NextResponse.json(apiResult.data)
    }

    // Otherwise, fall back to mock data
    const business = await getBusinessById(id)

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 })
    }

    return NextResponse.json(business)
  } catch (error) {
    console.error("Error in business API:", error)
    return NextResponse.json({ error: "Failed to fetch business" }, { status: 500 })
  }
}
