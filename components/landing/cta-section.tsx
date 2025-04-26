import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to start your Ethiopian adventure?</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Sign up now to access exclusive deals, personalized recommendations, and start planning your dream trip to
          Ethiopia.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup">
            <button className="bg-[#E91E63] text-white px-8 py-3 rounded-full hover:bg-[#D81B60]">Sign Up Now</button>
          </Link>
          <Link href="/homepage">
            <button className="bg-white border border-[#E91E63] text-[#E91E63] px-8 py-3 rounded-full hover:bg-gray-50">
              Explore Homepage
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
