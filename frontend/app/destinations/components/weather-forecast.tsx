"use client"

import { useEffect, useState } from "react"
import { Cloud, CloudRain, Sun, Wind } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface WeatherData {
  current: {
    temp: number
    description: string
    icon: string
  }
  forecast: Array<{
    date: string
    temp: number
    description: string
    icon: string
  }>
}

interface WeatherForecastProps {
  address: string
  city: string
}

export function WeatherForecast({ address, city }: WeatherForecastProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true)
        setError(null)

        // Check if API key is available
        if (!process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY) {
          throw new Error("OpenWeatherMap API key is not configured")
        }
        
        // First get coordinates from the address
        const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          `${address}, ${city}, Ethiopia`
        )}`
        
        const geocodeResponse = await fetch(geocodeUrl)
        const geocodeData = await geocodeResponse.json()
        
        if (!geocodeData || geocodeData.length === 0) {
          throw new Error(`Location not found for ${address}, ${city}`)
        }
        
        const { lat, lon } = geocodeData[0]
        
        // Get current weather
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric`
        const currentWeatherResponse = await fetch(currentWeatherUrl)
        const currentWeatherData = await currentWeatherResponse.json()
        
        if (currentWeatherData.cod !== 200) {
          throw new Error(`Weather data error: ${currentWeatherData.message || 'Unknown error'}`)
        }

        // Get 5-day forecast
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric`
        const forecastResponse = await fetch(forecastUrl)
        const forecastData = await forecastResponse.json()

        if (forecastData.cod !== "200") {
          throw new Error(`Forecast data error: ${forecastData.message || 'Unknown error'}`)
        }

        // Process forecast data to get daily averages
        const dailyForecasts = forecastData.list.reduce((acc: any[], item: any) => {
          const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })
          const existingDay = acc.find(day => day.date === date)
          
          if (existingDay) {
            existingDay.temp = (existingDay.temp + item.main.temp) / 2
          } else {
            acc.push({
              date,
              temp: Math.round(item.main.temp),
              description: item.weather[0].description,
              icon: item.weather[0].icon
            })
          }
          return acc
        }, []).slice(0, 4) // Get only next 4 days
        
        setWeather({
          current: {
            temp: Math.round(currentWeatherData.main.temp),
            description: currentWeatherData.weather[0].description,
            icon: currentWeatherData.weather[0].icon
          },
          forecast: dailyForecasts
        })
      } catch (err) {
        console.error("Weather fetch error:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch weather data")
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [address, city])

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Weather</h3>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <Skeleton className="h-16 w-16 mx-auto mb-2" />
          <Skeleton className="h-4 w-32 mx-auto mb-4" />
          <div className="mt-4 grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-4 w-12 mx-auto mb-1" />
                <Skeleton className="h-4 w-8 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !weather) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Weather</h3>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-2">Weather information unavailable</p>
          {error && (
            <p className="text-sm text-red-500">
              {error === "OpenWeatherMap API key is not configured" 
                ? "Please configure the OpenWeatherMap API key in .env.local"
                : error}
            </p>
          )}
        </div>
      </div>
    )
  }

  const getWeatherIcon = (iconCode: string) => {
    if (iconCode.includes("01")) return <Sun className="h-8 w-8 text-yellow-500" />
    if (iconCode.includes("02") || iconCode.includes("03") || iconCode.includes("04")) return <Cloud className="h-8 w-8 text-gray-500" />
    if (iconCode.includes("09") || iconCode.includes("10")) return <CloudRain className="h-8 w-8 text-blue-500" />
    return <Sun className="h-8 w-8 text-yellow-500" />
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-bold mb-4">Weather</h3>
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-center mb-2">
          {getWeatherIcon(weather.current.icon)}
        </div>
        <div className="text-5xl font-light mb-2">{weather.current.temp}°C</div>
        <div className="text-gray-500 capitalize">{weather.current.description}</div>
        <div className="mt-4 grid grid-cols-4 gap-2">
          {weather.forecast.map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-xs text-gray-500">{day.date}</div>
              <div className="flex justify-center my-1">
                {getWeatherIcon(day.icon)}
              </div>
              <div className="text-sm font-medium">{day.temp}°</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 