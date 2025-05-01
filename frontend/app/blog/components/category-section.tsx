import Link from "next/link"

interface Category {
  name: string
  count: number
  image: string
}

interface CategorySectionProps {
  categories: Category[]
}

export const CategorySection = ({ categories }: CategorySectionProps) => {
  return (
    <section className="py-8 bg-white rounded-xl shadow-sm">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-3">Browse by Category</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our diverse range of topics covering everything from cultural insights to travel tips and
          technological innovations in Ethiopian tourism.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Link key={category.name} href={`/blog/category/${category.name.toLowerCase()}`} className="group">
            <div className="bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 text-center group-hover:transform group-hover:scale-105">
              <div className="h-28 overflow-hidden">
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-3">
                <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{category.name}</h3>
                <p className="text-gray-500 text-sm">{category.count} articles</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
