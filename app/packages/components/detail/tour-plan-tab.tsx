export function TourPlanTab() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-bold mb-6">Tour Itinerary</h3>

      <div className="space-y-8">
        <div className="flex">
          <div className="mr-4">
            <div className="w-10 h-10 rounded-full bg-[#E91E63] text-white flex items-center justify-center font-bold">
              1
            </div>
            <div className="h-full w-0.5 bg-gray-200 mx-auto mt-2"></div>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-2">Day 1: Arrival in Lalibela</h4>
            <p className="text-gray-700 mb-4">
              Morning arrival at Lalibela Airport. Transfer to your hotel and check-in. Afternoon orientation tour of
              the town and visit to the first group of rock-hewn churches.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Airport pickup and hotel transfer</li>
              <li>Visit to Bet Medhane Alem, the largest monolithic church</li>
              <li>Welcome dinner with traditional Ethiopian cuisine</li>
            </ul>
          </div>
        </div>

        <div className="flex">
          <div className="mr-4">
            <div className="w-10 h-10 rounded-full bg-[#E91E63] text-white flex items-center justify-center font-bold">
              2
            </div>
            <div className="h-full w-0.5 bg-gray-200 mx-auto mt-2"></div>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-2">Day 2: Explore the Northern Group of Churches</h4>
            <p className="text-gray-700 mb-4">
              Full day exploration of the remaining northern group of churches and the famous Bet Giyorgis (St. George's
              Church).
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Visit to Bet Maryam, Bet Meskel, and Bet Danaghel</li>
              <li>Lunch at a local restaurant</li>
              <li>Afternoon visit to Bet Giyorgis, carved in the shape of a cross</li>
              <li>Traditional coffee ceremony experience</li>
            </ul>
          </div>
        </div>

        <div className="flex">
          <div className="mr-4">
            <div className="w-10 h-10 rounded-full bg-[#E91E63] text-white flex items-center justify-center font-bold">
              3
            </div>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-2">Day 3: Departure</h4>
            <p className="text-gray-700 mb-4">
              Morning visit to the local market. After lunch, transfer to Lalibela Airport for your departure flight.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Shopping for souvenirs at the local market</li>
              <li>Farewell lunch</li>
              <li>Airport transfer</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
