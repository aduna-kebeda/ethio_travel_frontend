"use server"

// This is a mock implementation. In a real app, this would interact with a database.

export interface BusinessData {
  id: string
  businessName: string
  businessType: string
  description: string
  region: string
  city: string
  address: string
  phone: string
  email: string
  website: string
  verified: boolean
  rating: number
  image: string
  openingHours?: string
  facilities?: string
  facebook?: string
  instagram?: string
}

interface GetBusinessesParams {
  category?: string
  region?: string
  city?: string
  query?: string
}

export async function getBusinesses(params: GetBusinessesParams): Promise<BusinessData[]> {
  // Simulate database query with delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock data - replace with actual database query
  let mockBusinesses: BusinessData[] = [
    {
      id: "1",
      businessName: "Sheraton Addis",
      businessType: "Hotel",
      description: "Luxury hotel in the heart of Addis Ababa with world-class restaurants and a spa.",
      region: "Addis Ababa",
      city: "Addis Ababa",
      address: "Taitu Street, Addis Ababa",
      phone: "+251 11 517 1717",
      email: "info@sheratonaddis.com",
      website: "www.sheratonaddis.com",
      verified: true,
      rating: 4.8,
      image: "/placeholder.svg?height=300&width=500&text=Sheraton+Addis",
      openingHours: "Open 24 hours",
      facilities: "Pool, Spa, Restaurant, Conference Rooms, Gym",
      facebook: "facebook.com/sheratonaddis",
      instagram: "instagram.com/sheratonaddis",
    },
    {
      id: "2",
      businessName: "Yod Abyssinia Cultural Restaurant",
      businessType: "Restaurant",
      description: "Traditional Ethiopian restaurant with cultural performances and authentic cuisine.",
      region: "Addis Ababa",
      city: "Addis Ababa",
      address: "Bole Road, Addis Ababa",
      phone: "+251 11 661 2985",
      email: "info@yodethiopia.com",
      website: "www.yodethiopia.com",
      verified: true,
      rating: 4.5,
      image: "/placeholder.svg?height=300&width=500&text=Yod+Abyssinia",
      openingHours: "11:00 AM - 11:00 PM",
      facilities: "Cultural performances, Traditional cuisine",
      facebook: "facebook.com/yodethiopia",
      instagram: "instagram.com/yodethiopia",
    },
    {
      id: "3",
      businessName: "Ethiopia Travel Agency",
      businessType: "Travel Agency",
      description: "Full-service tour operator specializing in cultural and historical tours of Ethiopia.",
      region: "Amhara",
      city: "Bahir Dar",
      address: "Main Street, Bahir Dar",
      phone: "+251 91 123 4567",
      email: "info@ethiopiatravel.com",
      website: "www.ethiopiatravel.com",
      verified: false,
      rating: 4.2,
      image: "/placeholder.svg?height=300&width=500&text=Ethiopia+Travel",
    },
  ]

  if (params.category) {
    mockBusinesses = mockBusinesses.filter((business) => business.businessType === params.category)
  }

  if (params.region) {
    mockBusinesses = mockBusinesses.filter((business) => business.region === params.region)
  }

  if (params.query) {
    const query = params.query.toLowerCase()
    mockBusinesses = mockBusinesses.filter(
      (business) =>
        business.businessName.toLowerCase().includes(query) || business.description.toLowerCase().includes(query),
    )
  }

  return mockBusinesses
}

export async function getBusinessById(id: string): Promise<BusinessData | null> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const mockBusinesses: BusinessData[] = [
    {
      id: "1",
      businessName: "Sheraton Addis",
      businessType: "Hotel",
      description: "Luxury hotel in the heart of Addis Ababa with world-class restaurants and a spa.",
      region: "Addis Ababa",
      city: "Addis Ababa",
      address: "Taitu Street, Addis Ababa",
      phone: "+251 11 517 1717",
      email: "info@sheratonaddis.com",
      website: "www.sheratonaddis.com",
      verified: true,
      rating: 4.8,
      image: "/placeholder.svg?height=300&width=500&text=Sheraton+Addis",
      openingHours: "Open 24 hours",
      facilities: "Pool, Spa, Restaurant, Conference Rooms, Gym",
      facebook: "facebook.com/sheratonaddis",
      instagram: "instagram.com/sheratonaddis",
    },
    {
      id: "2",
      businessName: "Yod Abyssinia Cultural Restaurant",
      businessType: "Restaurant",
      description: "Traditional Ethiopian restaurant with cultural performances and authentic cuisine.",
      region: "Addis Ababa",
      city: "Addis Ababa",
      address: "Bole Road, Addis Ababa",
      phone: "+251 11 661 2985",
      email: "info@yodethiopia.com",
      website: "www.yodethiopia.com",
      verified: true,
      rating: 4.5,
      image: "/placeholder.svg?height=300&width=500&text=Yod+Abyssinia",
      openingHours: "11:00 AM - 11:00 PM",
      facilities: "Cultural performances, Traditional cuisine",
      facebook: "facebook.com/yodethiopia",
      instagram: "instagram.com/yodethiopia",
    },
    {
      id: "3",
      businessName: "Ethiopia Travel Agency",
      businessType: "Travel Agency",
      description: "Full-service tour operator specializing in cultural and historical tours of Ethiopia.",
      region: "Amhara",
      city: "Bahir Dar",
      address: "Main Street, Bahir Dar",
      phone: "+251 91 123 4567",
      email: "info@ethiopiatravel.com",
      website: "www.ethiopiatravel.com",
      verified: false,
      rating: 4.2,
      image: "/placeholder.svg?height=300&width=500&text=Ethiopia+Travel",
    },
  ]

  return mockBusinesses.find((business) => business.id === id) || null
}

export async function deleteBusiness(id: string): Promise<{ success: boolean; error?: string }> {
  // Simulate database deletion with delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  console.log(`Deleting business with id: ${id}`)
  return { success: true }
}

export async function getBusinessesByUserId(userId: string): Promise<BusinessData[]> {
  // Simulate database query with delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock data - replace with actual database query
  const mockBusinesses: BusinessData[] = [
    {
      id: "1",
      businessName: "Sheraton Addis",
      businessType: "Hotel",
      description: "Luxury hotel in the heart of Addis Ababa with world-class restaurants and a spa.",
      region: "Addis Ababa",
      city: "Addis Ababa",
      address: "Taitu Street, Addis Ababa",
      phone: "+251 11 517 1717",
      email: "info@sheratonaddis.com",
      website: "www.sheratonaddis.com",
      verified: true,
      rating: 4.8,
      image: "/placeholder.svg?height=300&width=500&text=Sheraton+Addis",
      openingHours: "Open 24 hours",
      facilities: "Pool, Spa, Restaurant, Conference Rooms, Gym",
      facebook: "facebook.com/sheratonaddis",
      instagram: "instagram.com/sheratonaddis",
    },
    {
      id: "2",
      businessName: "Yod Abyssinia Cultural Restaurant",
      businessType: "Restaurant",
      description: "Traditional Ethiopian restaurant with cultural performances and authentic cuisine.",
      region: "Addis Ababa",
      city: "Addis Ababa",
      address: "Bole Road, Addis Ababa",
      phone: "+251 11 661 2985",
      email: "info@yodethiopia.com",
      website: "www.yodethiopia.com",
      verified: true,
      rating: 4.5,
      image: "/placeholder.svg?height=300&width=500&text=Yod+Abyssinia",
      openingHours: "11:00 AM - 11:00 PM",
      facilities: "Cultural performances, Traditional cuisine",
      facebook: "facebook.com/yodethiopia",
      instagram: "instagram.com/yodethiopia",
    },
  ]

  // In a real application, you would filter businesses based on the userId.
  return mockBusinesses
}
