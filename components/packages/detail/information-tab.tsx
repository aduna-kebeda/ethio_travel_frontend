import { Button } from "@/components/ui/button"

interface PackageDetail {
  id: string
  title: string
  location: string
  region: string
  price: number
  priceUnit: string
  duration: string
  rating: number
  reviews: number
  description: string
  image: string
  departure: string
  departureTime: string
  returnTime: string
  dressCode: string
  notIncluded: string[]
  included: string[]
  tourGuide: string
  galleryImages: string[]
}

interface InformationTabProps {
  packageDetail: PackageDetail
}

export function InformationTab({ packageDetail }: InformationTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <div className="flex items-center mb-4">
          <h2 className="text-2xl font-bold mr-4">{packageDetail.title}</h2>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`h-4 w-4 ${i < packageDetail.rating ? "text-yellow-400" : "text-gray-300"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-xs text-gray-500 ml-2">{packageDetail.reviews} reviews</span>
          </div>
        </div>

        <div className="prose max-w-none mb-8">
          {packageDetail.description.split("\n\n").map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-700">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold mb-4">Destination</h3>
            <p className="text-gray-700">
              {packageDetail.location}, {packageDetail.region}
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-4">Departure</h3>
            <p className="text-gray-700">{packageDetail.departure}</p>
          </div>

          <div>
            <h3 className="font-bold mb-4">Departure Time</h3>
            <p className="text-gray-700">{packageDetail.departureTime}</p>
          </div>

          <div>
            <h3 className="font-bold mb-4">Return Time</h3>
            <p className="text-gray-700">{packageDetail.returnTime}</p>
          </div>

          <div>
            <h3 className="font-bold mb-4">Dress Code</h3>
            <p className="text-gray-700">{packageDetail.dressCode}</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold mb-4">Not Included</h3>
            <ul className="space-y-2">
              {packageDetail.notIncluded.map((item, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Included</h3>
            <ul className="space-y-2">
              {packageDetail.included.map((item, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="md:col-span-1">
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="text-center mb-6">
            <span className="text-2xl font-bold text-[#E91E63]">{packageDetail.price.toLocaleString()} $ </span>
            <span className="text-gray-500">{packageDetail.priceUnit}</span>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-center mb-4">Prepared by</h3>
            <h4 className="text-xl font-bold text-[#E91E63] text-center">{packageDetail.tourGuide}</h4>
          </div>

          <div className="space-y-4">
            <p className="text-gray-700">
              Et ipsum velit ut quae praesentium in maiores labore nam rerum quae sed magni reprehenderit. Qui nemo
              consequatur vel omnis ut eligendi qui et quas voluptatem.
            </p>

            <p className="text-gray-700">
              Et ipsum velit ut quae praesentium in maiores labore nam rerum quae sed magni reprehenderit. Qui nemo
              consequatur vel omnis ut eligendi qui et quas voluptatem.
            </p>

            <p className="text-gray-700">
              Et ipsum velit ut quae praesentium in maiores labore nam rerum quae sed magni reprehenderit. Qui nemo
              consequatur vel omnis ut eligendi qui et quas voluptatem.
            </p>
          </div>

          <Button className="w-full mt-8 bg-[#E91E63] hover:bg-[#D81B60]">Check Availability</Button>
        </div>
      </div>
    </div>
  )
}
