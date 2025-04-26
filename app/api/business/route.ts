import { NextResponse } from "next/server"
import { getBusinesses } from "@/app/actions/business-actions"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || undefined
    const region = searchParams.get("region") || undefined
    const city = searchParams.get("city") || undefined
    const query = searchParams.get("query") || undefined

    const businesses = await getBusinesses({
      category,
      region,
      city,
      query,
    })

    return NextResponse.json(businesses)
  } catch (error) {
    console.error("Error in business API:", error)
    return NextResponse.json({ error: "Failed to fetch businesses" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // In a real app, you would validate the request and save to a database
    // For now, we'll just return a success response
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in business API:", error)
    return NextResponse.json({ error: "Failed to create business" }, { status: 500 })
  }
}
