import Link from "next/link"
import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function RegisterSuccessPage() {
  return (
    <Container className="py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">Registration Successful!</h1>

        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <p className="text-gray-700 mb-6">
            Thank you for registering your business with EthioTravel. Your submission has been received and is now
            pending review.
          </p>

          <div className="space-y-4 text-left bg-gray-50 p-4 rounded-md mb-6">
            <h3 className="font-medium text-gray-900">What happens next?</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Our team will review your business information within 1-2 business days</li>
              <li>You'll receive an email notification once your listing is approved</li>
              <li>Once approved, your business will appear in our directory</li>
              <li>You can manage your business listing from your account dashboard</li>
            </ul>
          </div>

          <p className="text-gray-600 mb-8">
            If you have any questions or need to make changes to your submission, please contact our support team.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/business">Browse Business Directory</Link>
            </Button>

            <Button asChild variant="outline">
              <Link href="/business/my-businesses">View My Businesses</Link>
            </Button>
          </div>
        </div>

        <p className="text-sm text-gray-500">
          Need help? Contact our support team at{" "}
          <a href="mailto:support@ethiotravel.com" className="text-primary hover:underline">
            support@ethiotravel.com
          </a>
        </p>
      </div>
    </Container>
  )
}
