import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollToTop } from "@/components/scroll-to-top"
import {
  MapPin,
  Calendar,
  Users,
  Star,
  Heart,
  Share2,
  MessageCircle,
  Bookmark,
  ChevronRight,
  Camera,
  Map,
  Info,
  CalendarClock,
} from "lucide-react"

// This would normally be fetched from an API based on the ID
const getDestination = (id: string) => {
  return {
    id,
    name: "Lalibela",
    category: "Historical",
    rating: 4.8,
    reviews: 124,
    location: "Northern Ethiopia",
    description:
      "Lalibela is a town in the Amhara region of northern Ethiopia, known for its distinctive rock-cut churches dating from the 12th and 13th centuries, which are pilgrimage sites for Coptic Christians.",
    longDescription: `
      <p>Lalibela, named after King Lalibela who commissioned these extraordinary edifices, represents one of Ethiopia's holiest cities and a significant place of pilgrimage and devotion. The town contains 11 monolithic churches that were carved downward into the ground from a single volcanic rock. These structures are connected by an extensive system of tunnels and passages, creating an underground maze of sacred spaces.</p>
      
      <p>The churches of Lalibela are not only remarkable for their engineering and architectural achievement but also for their continued religious significance. Each church possesses unique characteristics and artistic elements, including intricate carvings, early frescoes, and ceremonial artifacts that have been preserved for centuries.</p>
      
      <p>Among the most famous churches is Bete Giyorgis (Church of St. George), carved in the shape of a cross and considered a masterpiece of rock-hewn architecture. Other notable churches include Bete Medhane Alem, believed to be the largest monolithic church in the world, and Bete Maryam, known for its beautiful interior decorations.</p>
      
      <p>Visitors to Lalibela can witness the living traditions of Ethiopian Orthodox Christianity, particularly during religious festivals such as Timkat (Epiphany) and Genna (Ethiopian Christmas), when thousands of white-robed pilgrims gather for ceremonies that have remained largely unchanged for centuries.</p>
      
      <p>Beyond the churches, Lalibela offers visitors a glimpse into traditional Ethiopian highland life. The surrounding landscape features rugged mountains, traditional round tukul houses, and terraced fields that have been cultivated for generations.</p>
    `,
    price: "$120",
    image: "/placeholder.svg?height=600&width=1200&text=Lalibela",
    gallery: [
      "/placeholder.svg?height=400&width=600&text=Lalibela+1",
      "/placeholder.svg?height=400&width=600&text=Lalibela+2",
      "/placeholder.svg?height=400&width=600&text=Lalibela+3",
      "/placeholder.svg?height=400&width=600&text=Lalibela+4",
      "/placeholder.svg?height=400&width=600&text=Lalibela+5",
      "/placeholder.svg?height=400&width=600&text=Lalibela+6",
    ],
    bestTimeToVisit: "October to March",
    duration: "2-3 days",
    activities: [
      "Visit the 11 rock-hewn churches",
      "Attend a traditional Ethiopian Orthodox service",
      "Hike to nearby monasteries",
      "Experience local cuisine and coffee ceremonies",
      "Visit the local market",
    ],
    nearbyAttractions: [
      {
        name: "Yemrehana Krestos Church",
        distance: "42 km",
        description: "A beautiful church built inside a cave",
      },
      {
        name: "Asheton Maryam Monastery",
        distance: "7 km",
        description: "Perched high in the mountains with panoramic views",
      },
      {
        name: "Na'akuto La'ab Monastery",
        distance: "12 km",
        description: "Contains ancient religious artifacts and manuscripts",
      },
    ],
    tourGuides: [
      {
        name: "Abebe Kebede",
        image: "/placeholder.svg?height=100&width=100",
        rating: 4.9,
        reviews: 45,
        languages: ["English", "Amharic"],
      },
      {
        name: "Tigist Haile",
        image: "/placeholder.svg?height=100&width=100",
        rating: 4.8,
        reviews: 38,
        languages: ["English", "Amharic", "French"],
      },
      {
        name: "Daniel Mekonnen",
        image: "/placeholder.svg?height=100&width=100",
        rating: 4.7,
        reviews: 32,
        languages: ["English", "Amharic", "Italian"],
      },
    ],
  }
}

export default function DestinationDetailPage({ params }: { params: { id: string } }) {
  const destination = getDestination(params.id)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[500px]">
          <div className="absolute inset-0">
            <img
              src={destination.image || "/placeholder.svg"}
              alt={destination.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
          </div>

          <div className="relative container mx-auto px-4 h-full flex items-end pb-12">
            <div className="max-w-3xl text-white">
              <Badge className="bg-primary mb-4">{destination.category}</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{destination.name}</h1>
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 mr-1 fill-current" />
                  <span className="font-medium">{destination.rating}</span>
                  <span className="text-gray-300 ml-1">({destination.reviews} reviews)</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-1" />
                  <span>{destination.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-1" />
                  <span>Best time: {destination.bestTimeToVisit}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button className="bg-primary hover:bg-primary/90">Book Now</Button>
                <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                  <Heart className="h-4 w-4 mr-2" /> Save
                </Button>
                <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                  <Share2 className="h-4 w-4 mr-2" /> Share
                </Button>
              </div>
            </div>
          </div>
        </section>

        <Container className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full justify-start mb-6 bg-white rounded-lg p-1">
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    <Info className="h-4 w-4 mr-2" /> Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="gallery"
                    className="data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    <Camera className="h-4 w-4 mr-2" /> Gallery
                  </TabsTrigger>
                  <TabsTrigger
                    value="location"
                    className="data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    <Map className="h-4 w-4 mr-2" /> Location
                  </TabsTrigger>
                  <TabsTrigger
                    value="itinerary"
                    className="data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    <CalendarClock className="h-4 w-4 mr-2" /> Itinerary
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-0">
                  <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-4">About {destination.name}</h2>
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: destination.longDescription }}
                    />

                    <div className="mt-8">
                      <h3 className="text-xl font-bold mb-4">Activities</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {destination.activities.map((activity, index) => (
                          <li key={index} className="flex items-start">
                            <ChevronRight className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                            <span>{activity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4">Nearby Attractions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {destination.nearbyAttractions.map((attraction, index) => (
                        <div key={index} className="border rounded-lg p-4 hover:border-primary transition-colors">
                          <h3 className="font-bold mb-1">{attraction.name}</h3>
                          <p className="text-sm text-gray-500 mb-2">Distance: {attraction.distance}</p>
                          <p className="text-sm">{attraction.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="gallery" className="mt-0">
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-6">Photo Gallery</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {destination.gallery.map((image, index) => (
                        <div key={index} className="rounded-lg overflow-hidden">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`${destination.name} ${index + 1}`}
                            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="location" className="mt-0">
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-6">Location</h2>
                    <div className="aspect-video bg-gray-200 rounded-lg mb-6">
                      <img
                        src="/placeholder.svg?height=400&width=800&text=Map+of+Lalibela"
                        alt="Map"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-bold mb-2">How to Get There</h3>
                        <p className="text-gray-600 mb-4">
                          Lalibela is accessible by air from Addis Ababa, with daily flights to Lalibela Airport. From
                          the airport, it's a 30-minute drive to the town center. Alternatively, you can reach Lalibela
                          by road from major cities, though the journey can be long.
                        </p>
                        <Button variant="outline" className="w-full">
                          Get Directions
                        </Button>
                      </div>
                      <div>
                        <h3 className="font-bold mb-2">Local Transportation</h3>
                        <p className="text-gray-600 mb-4">
                          Within Lalibela, most sites are within walking distance. For longer distances, tuk-tuks and
                          taxis are readily available. Consider hiring a local guide to enhance your experience and
                          support the local economy.
                        </p>
                        <Button variant="outline" className="w-full">
                          Transportation Options
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="itinerary" className="mt-0">
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-6">Suggested Itinerary</h2>
                    <div className="space-y-6">
                      <div className="border-l-4 border-primary pl-4">
                        <h3 className="font-bold text-lg">Day 1: Northern Group of Churches</h3>
                        <p className="text-gray-600 mt-2">
                          Start your exploration with the northern group of churches, including Bet Medhane Alem, Bet
                          Maryam, and Bet Golgotha. Break for lunch at a local restaurant to try traditional Ethiopian
                          cuisine. In the afternoon, visit the Lalibela Museum to learn about the history and cultural
                          significance of the site.
                        </p>
                      </div>

                      <div className="border-l-4 border-primary pl-4">
                        <h3 className="font-bold text-lg">Day 2: Eastern Group & Bet Giyorgis</h3>
                        <p className="text-gray-600 mt-2">
                          Explore the eastern group of churches in the morning, including Bet Emanuel and Bet Abba
                          Libanos. After lunch, visit the most iconic church of Lalibela, Bet Giyorgis (Church of St.
                          George), carved in the shape of a cross. End your day with a traditional coffee ceremony at a
                          local home.
                        </p>
                      </div>

                      <div className="border-l-4 border-primary pl-4">
                        <h3 className="font-bold text-lg">Day 3: Surrounding Monasteries</h3>
                        <p className="text-gray-600 mt-2">
                          Take a day trip to nearby monasteries such as Yemrehana Krestos or Na'akuto La'ab. These
                          less-visited sites offer a different perspective on the religious heritage of the region.
                          Return to Lalibela in the evening for a farewell dinner with views of the surrounding
                          mountains.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button className="w-full bg-primary hover:bg-primary/90">Book This Itinerary</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">Book This Tour</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Travel Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Travelers</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent appearance-none">
                        <option>1 Person</option>
                        <option>2 People</option>
                        <option>3 People</option>
                        <option>4+ People</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tour Guide</label>
                    <div className="relative">
                      <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent appearance-none">
                        <option>Select a guide (optional)</option>
                        {destination.tourGuides.map((guide, index) => (
                          <option key={index}>
                            {guide.name} - ⭐ {guide.rating}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between mb-2">
                      <span>Base Price</span>
                      <span>{destination.price}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Guide Fee</span>
                      <span>$30</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Tax</span>
                      <span>$15</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>$165</span>
                    </div>
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90">Book Now</Button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">Tour Guides</h3>
                <div className="space-y-4">
                  {destination.tourGuides.map((guide, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <img
                        src={guide.image || "/placeholder.svg"}
                        alt={guide.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{guide.name}</h4>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm ml-1">{guide.rating}</span>
                          <span className="text-xs text-gray-500 ml-1">({guide.reviews} reviews)</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Languages: {guide.languages.join(", ")}</div>
                      </div>
                      <Button variant="outline" size="sm">
                        Profile
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">Weather</h3>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-5xl font-light mb-2">22°C</div>
                  <div className="text-gray-500">Partly Cloudy</div>
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Mon</div>
                      <div className="text-sm font-medium">21°</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Tue</div>
                      <div className="text-sm font-medium">23°</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Wed</div>
                      <div className="text-sm font-medium">22°</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Thu</div>
                      <div className="text-sm font-medium">20°</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Traveler Reviews</h2>
              <Button>
                <MessageCircle className="h-4 w-4 mr-2" /> Write a Review
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((review) => (
                <div key={review} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex justify-between mb-4">
                    <div className="flex items-center">
                      <img
                        src={`/placeholder.svg?height=50&width=50&text=User`}
                        alt="User"
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <h4 className="font-medium">John Doe</h4>
                        <p className="text-xs text-gray-500">Visited April 2023</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 font-medium">4.8</span>
                    </div>
                  </div>
                  <h5 className="font-bold mb-2">Incredible historical experience</h5>
                  <p className="text-gray-600 text-sm mb-3">
                    The rock-hewn churches of Lalibela are truly a wonder to behold. Our guide was knowledgeable and
                    passionate about the history. I would highly recommend spending at least 2 full days here.
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <button className="flex items-center mr-4 hover:text-primary">
                      <Heart className="h-4 w-4 mr-1" /> Helpful (24)
                    </button>
                    <button className="flex items-center hover:text-primary">
                      <MessageCircle className="h-4 w-4 mr-1" /> Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <Button variant="outline">Load More Reviews</Button>
            </div>
          </div>

          {/* Similar Destinations */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Similar Destinations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="relative h-48">
                    <img
                      src={`/placeholder.svg?height=300&width=400&text=Destination+${item}`}
                      alt={`Destination ${item}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <Bookmark className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-1">Historical Site {item}</h3>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>Northern Ethiopia</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm ml-1">4.7</span>
                      </div>
                      <span className="font-bold">$95</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </main>

      <ScrollToTop />
    </div>
  )
}
