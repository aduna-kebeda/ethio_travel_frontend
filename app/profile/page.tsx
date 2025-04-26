"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Eye, EyeOff } from "lucide-react"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const user = {
    name: "Messiah Roma",
    email: "messiahroma@example.com",
    phone: "+251 123 456 789",
    location: "Addis Ababa",
    image: "/placeholder.svg?height=100&width=100",
    followers: 124,
    following: 235,
  }

  const favoriteDestinations = [
    {
      id: 1,
      name: "Lalibela",
      image: "/placeholder.svg?height=200&width=300&text=Lalibela",
      description: "Ancient rock-hewn churches",
    },
    {
      id: 2,
      name: "Gondar",
      image: "/placeholder.svg?height=200&width=300&text=Gondar",
      description: "Medieval castles and palaces",
    },
    {
      id: 3,
      name: "Simien Mountains",
      image: "/placeholder.svg?height=200&width=300&text=Simien",
      description: "Breathtaking landscapes and wildlife",
    },
    {
      id: 4,
      name: "Danakil Depression",
      image: "/placeholder.svg?height=200&width=300&text=Danakil",
      description: "Otherworldly landscapes",
    },
    {
      id: 5,
      name: "Omo Valley",
      image: "/placeholder.svg?height=200&width=300&text=Omo",
      description: "Cultural diversity and traditions",
    },
    {
      id: 6,
      name: "Harar",
      image: "/placeholder.svg?height=200&width=300&text=Harar",
      description: "Ancient walled city",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">My Profile</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="relative mb-4">
                    <div className="h-24 w-24 rounded-full overflow-hidden">
                      <img
                        src={user.image || "/placeholder.svg"}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <button className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                  </div>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-gray-500 text-sm">@traveler</p>
                  <div className="flex justify-center space-x-4 mt-2">
                    <div className="text-center">
                      <p className="font-bold">{user.followers}</p>
                      <p className="text-xs text-gray-500">Followers</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold">{user.following}</p>
                      <p className="text-xs text-gray-500">Following</p>
                    </div>
                  </div>
                </div>

                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === "profile" ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Profile Information
                  </button>
                  <button
                    onClick={() => setActiveTab("favorites")}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === "favorites" ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    My Favorite Destinations
                  </button>
                  <button
                    onClick={() => setActiveTab("newsletter")}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === "newsletter" ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Newsletter Subscription
                  </button>
                  <button
                    onClick={() => setActiveTab("notifications")}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === "notifications" ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Manage Notifications
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3">
              <div className="bg-white rounded-lg shadow">
                {activeTab === "profile" && (
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-6">Personal Information</h2>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" defaultValue={user.name} className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="dob">Date of Birth</Label>
                          <div className="relative mt-1">
                            <Input id="dob" type="date" defaultValue="1990-01-01" />
                            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" defaultValue={user.phone} className="mt-1" />
                      </div>

                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" defaultValue={user.location} className="mt-1" />
                      </div>

                      <h3 className="text-lg font-bold mt-8 mb-4">Security</h3>

                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue={user.email} className="mt-1" />
                      </div>

                      <div>
                        <Label htmlFor="password">Password</Label>
                        <div className="relative mt-1">
                          <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••••••" />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <div className="relative mt-1">
                          <Input
                            id="confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••••••"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      <Button className="mt-4">Save</Button>
                    </div>
                  </div>
                )}

                {activeTab === "favorites" && (
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-6">My Favorite Places</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favoriteDestinations.map((destination) => (
                        <div
                          key={destination.id}
                          className="group rounded-lg overflow-hidden shadow-sm border border-gray-200"
                        >
                          <div className="relative h-40 overflow-hidden">
                            <img
                              src={destination.image || "/placeholder.svg"}
                              alt={destination.name}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold">{destination.name}</h3>
                            <p className="text-sm text-gray-600">{destination.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 text-center">
                      <Button variant="outline">View All Favorites</Button>
                    </div>
                  </div>
                )}

                {activeTab === "newsletter" && (
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-6">Newsletter Subscription</h2>
                    <div className="space-y-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700">
                          You are currently subscribed to our newsletter. You will receive updates about:
                        </p>
                        <ul className="mt-4 space-y-2">
                          <li className="flex items-center">
                            <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            New destinations and travel guides
                          </li>
                          <li className="flex items-center">
                            <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Special offers and promotions
                          </li>
                          <li className="flex items-center">
                            <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Travel tips and cultural insights
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-bold mb-2">Email Frequency</h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input
                              id="frequency-weekly"
                              name="frequency"
                              type="radio"
                              defaultChecked
                              className="h-4 w-4 text-primary focus:ring-primary"
                            />
                            <label htmlFor="frequency-weekly" className="ml-2 block text-sm text-gray-700">
                              Weekly digest
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="frequency-biweekly"
                              name="frequency"
                              type="radio"
                              className="h-4 w-4 text-primary focus:ring-primary"
                            />
                            <label htmlFor="frequency-biweekly" className="ml-2 block text-sm text-gray-700">
                              Bi-weekly
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="frequency-monthly"
                              name="frequency"
                              type="radio"
                              className="h-4 w-4 text-primary focus:ring-primary"
                            />
                            <label htmlFor="frequency-monthly" className="ml-2 block text-sm text-gray-700">
                              Monthly roundup
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <Button>Save Preferences</Button>
                        <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-50">
                          Unsubscribe
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "notifications" && (
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-6">Notification Settings</h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-bold mb-4">Email Notifications</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">New trip recommendations</p>
                              <p className="text-sm text-gray-500">
                                Get personalized trip suggestions based on your interests
                              </p>
                            </div>
                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                              <input type="checkbox" id="toggle-1" defaultChecked className="sr-only" />
                              <label
                                htmlFor="toggle-1"
                                className="block h-6 w-12 rounded-full bg-gray-300 cursor-pointer"
                              ></label>
                              <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out transform translate-x-0"></span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Booking confirmations</p>
                              <p className="text-sm text-gray-500">
                                Receive confirmations for your bookings and reservations
                              </p>
                            </div>
                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                              <input type="checkbox" id="toggle-2" defaultChecked className="sr-only" />
                              <label
                                htmlFor="toggle-2"
                                className="block h-6 w-12 rounded-full bg-gray-300 cursor-pointer"
                              ></label>
                              <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out transform translate-x-0"></span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Travel alerts</p>
                              <p className="text-sm text-gray-500">Important updates about your destinations</p>
                            </div>
                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                              <input type="checkbox" id="toggle-3" defaultChecked className="sr-only" />
                              <label
                                htmlFor="toggle-3"
                                className="block h-6 w-12 rounded-full bg-gray-300 cursor-pointer"
                              ></label>
                              <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out transform translate-x-0"></span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold mb-4">Push Notifications</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Special offers</p>
                              <p className="text-sm text-gray-500">
                                Be the first to know about discounts and promotions
                              </p>
                            </div>
                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                              <input type="checkbox" id="toggle-4" defaultChecked className="sr-only" />
                              <label
                                htmlFor="toggle-4"
                                className="block h-6 w-12 rounded-full bg-gray-300 cursor-pointer"
                              ></label>
                              <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out transform translate-x-0"></span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Trip reminders</p>
                              <p className="text-sm text-gray-500">Get reminders about upcoming trips and activities</p>
                            </div>
                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                              <input type="checkbox" id="toggle-5" defaultChecked className="sr-only" />
                              <label
                                htmlFor="toggle-5"
                                className="block h-6 w-12 rounded-full bg-gray-300 cursor-pointer"
                              ></label>
                              <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out transform translate-x-0"></span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button>Save Preferences</Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
