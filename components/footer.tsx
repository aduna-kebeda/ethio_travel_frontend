import Link from "next/link"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-secondary text-white py-12">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-1">
            <Logo className="mb-4" />
            <p className="text-sm text-gray-600 mb-4">
              Discover the beauty and culture of Ethiopia with personalized travel experiences.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-primary hover:text-primary/80">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-primary hover:text-primary/80">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-primary hover:text-primary/80">
                <Instagram size={20} />
              </Link>
            </div>
          </div>

          <div className="md:col-span-1">
            <h3 className="font-bold text-sm mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-sm text-gray-600 hover:text-primary">
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm text-gray-600 hover:text-primary">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-gray-600 hover:text-primary">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="font-bold text-sm mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/partners" className="text-sm text-gray-600 hover:text-primary">
                  Partners
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-gray-600 hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-600 hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="font-bold text-sm mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-sm text-gray-600 hover:text-primary">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="text-sm text-gray-600 hover:text-primary">
                  Feedback
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-sm text-gray-600 hover:text-primary">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="font-bold text-sm mb-4">Newsletter</h3>
            <p className="text-sm text-gray-600 mb-4">
              Subscribe to our newsletter for travel updates and special offers.
            </p>
            <div className="flex space-x-2">
              <Input type="email" placeholder="Your email" className="bg-white" />
              <Button size="sm" className="whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-6">
          <p className="text-center text-sm text-gray-600">
            © {new Date().getFullYear()} EthioTravel. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
