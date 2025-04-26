import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

export const Newsletter = () => {
  return (
    <section className="py-10 bg-primary/5 rounded-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full -ml-32 -mb-32"></div>

      <div className="relative">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">Subscribe to Our Newsletter</h2>
          <p className="text-gray-600 mb-6">
            Stay updated with the latest travel tips, cultural insights, and exclusive offers from EthioTravel.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
              className="rounded-full px-4 border-gray-300 focus:border-primary"
            />
            <Button className="rounded-full px-4 flex items-center justify-center gap-2">
              Subscribe <Send className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <p className="text-gray-500 text-sm mt-3">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </div>
    </section>
  )
}
