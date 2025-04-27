"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import {
  Compass,
  Mountain,
  Utensils,
  Camera,
  Users,
  Tent,
  Landmark,
  Music,
  Coffee,
  Palmtree,
  Map,
  Heart,
} from "lucide-react";
import { AuthLayout } from "@/components/auth-layout";

interface Interest {
  id: string;
  name: string;
  icon: React.ReactNode;
}

function InterestsContent() {
  const router = useRouter();
  const interests: Interest[] = [
    { id: "adventure", name: "Adventure", icon: <Compass className="h-6 w-6" /> },
    { id: "hiking", name: "Hiking", icon: <Mountain className="h-6 w-6" /> },
    { id: "food", name: "Food", icon: <Utensils className="h-6 w-6" /> },
    { id: "photography", name: "Photography", icon: <Camera className="h-6 w-6" /> },
    { id: "culture", name: "Culture", icon: <Users className="h-6 w-6" /> },
    { id: "camping", name: "Camping", icon: <Tent className="h-6 w-6" /> },
    { id: "history", name: "History", icon: <Landmark className="h-6 w-6" /> },
    { id: "festivals", name: "Festivals", icon: <Music className="h-6 w-6" /> },
    { id: "coffee", name: "Coffee", icon: <Coffee className="h-6 w-6" /> },
    { id: "beaches", name: "Beaches", icon: <Palmtree className="h-6 w-6" /> },
    { id: "roadtrips", name: "Road Trips", icon: <Map className="h-6 w-6" /> },
    { id: "wellness", name: "Wellness", icon: <Heart className="h-6 w-6" /> },
  ];

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSkip = () => {
    // Redirect to the next step
    router.push("/next-step");
  };

  const handleNext = () => {
    // Handle interests selection and redirect to the next step
    console.log({ selectedInterests });
    router.push("/next-step");
  };

  return (
    <AuthLayout imagePosition="left">
      <div className="w-full">
        <div className="flex justify-end mb-4">
          <Logo />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Choose interest</h2>
          <p className="mt-2 text-sm text-gray-600">
            Interest can be changed anytime in the profile setting.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {interests.map((interest) => (
            <div
              key={interest.id}
              onClick={() => toggleInterest(interest.id)}
              className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transform transition-all duration-200 ${
                selectedInterests.includes(interest.id)
                  ? "bg-primary text-white scale-105"
                  : "bg-white border border-gray-200 hover:border-primary text-gray-700"
              }`}
            >
              {interest.icon}
              <span className="mt-2 text-xs font-medium">{interest.name}</span>
            </div>
          ))}
        </div>

        <div className="flex space-x-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleSkip}
          >
            Skip
          </Button>
          <Button
            type="button"
            className="w-full"
            onClick={handleNext}
            disabled={selectedInterests.length === 0}
          >
            Next
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}

export default function ChooseInterestsPage() {
  return <InterestsContent />;
}