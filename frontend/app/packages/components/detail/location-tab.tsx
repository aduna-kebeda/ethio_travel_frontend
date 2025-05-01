import Image from "next/image"
import { OtherInformationSidebar } from "./other-information-sidebar"

export function LocationTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <h3 className="text-xl font-bold mb-6">Tour Plan</h3>
        <p className="text-gray-700 mb-4">
          Qui tempore voluptate qui quia commodi rem praesentium quis et voluptatem officia. Qui quidem neque non
          expedita sit dolo. Enim aut et voluptas reprehenderit. Ut voluptas assumptum sit deleniti officia aut sapiente
          explicabo non neque corporis aut voluptatem iusto. At facere enim et voluptas reprehenderit. Ut voluptas
          assumptum.
        </p>

        <div className="aspect-video relative rounded-lg overflow-hidden mb-6">
          <Image
            src="/placeholder.svg?height=600&width=1200&text=Map+of+Lalibela"
            alt="Map of Lalibela"
            fill
            className="object-cover"
          />
        </div>

        <p className="text-gray-700 mb-4">
          Sit quae soluta non temporibus voluptas non necessitatibus tempore et deleniti praesentium aut velit nostrum
          ut itaque atque aut expedita voluptatem. Hic deleniti officia aut sapiente explicabo non neque corporis aut
          voluptatem iusto. At facere enim et voluptas reprehenderit. Ut voluptas assumptum sit deleniti officia aut
          sapiente explicabo non neque corporis aut omnis est saepe nihil.
        </p>

        <p className="text-gray-700 mb-8">
          Qui itaque expedit. Et aut rerum est internos impedit aut dignissimos quo. Et non enim aut voluptatem
          voluptatem. Ut voluptas assumptum sit deleniti officia aut sapiente explicabo non eum hurtumam hic deserunt
          atque sed dicta quibusdam in quos praesentium. In libellam illum et aut culpa porro sed molestiae libero. At
          blanditiis minima fugiat.
        </p>

        <div className="mt-8">
          <Image
            src="/placeholder.svg?height=200&width=600&text=Travel+Accessories"
            alt="Travel Accessories"
            width={600}
            height={200}
            className="rounded-lg"
          />
        </div>
      </div>

      <div className="md:col-span-1">
        <OtherInformationSidebar />
      </div>
    </div>
  )
}
