"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export default function RegisterBusinessSuccessPage() {
  const router = useRouter()

  // Track page view
  useEffect(() => {
    // You could add analytics tracking here
    console.log("Business registration success page viewed")
  }, [])

  return (
    <Container className="py-16">
      <div className="max-w-2xl mx-auto">
        <Card className="border-green-100 shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-50 mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-700">Registration Successful!</CardTitle>
            <CardDescription className="text-base">
              Your business has been successfully registered in our directory.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4 pt-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-800">
                Thank you for registering your business with us. Our team will review your submission and publish it to
                our directory.
              </p>
            </div>

            <div className="space-y-2 text-left">
              <h3 className="font-medium text-gray-900">What happens next?</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>Our team will review your business details within 1-2 business days</li>
                <li>You'll receive an email notification when your listing is approved</li>
                <li>Once approved, your business will appear in our directory</li>
                <li>You can edit your business details anytime from your dashboard</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3 pt-2">
            <Button
              onClick={() => router.push("/business/my-business")}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              View My Businesses
            </Button>
            <Button variant="outline" onClick={() => router.push("/business")} className="w-full">
              Explore Business Directory
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            Have questions? Contact our support team at{" "}
            <a href="mailto:support@ethiotravel.com" className="text-primary hover:underline">
              support@ethiotravel.com
            </a>
          </p>
        </div>
      </div>
    </Container>
  )
}
