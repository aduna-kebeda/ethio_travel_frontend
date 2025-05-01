"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export default function SignupSuccessPage() {
  const router = useRouter();

  const handleContinue = () => {
    // Redirect to homepage or dashboard
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Logo />
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <img
                src="/placeholder.svg?height=200&width=200&text=Success"
                alt="Success"
                className="h-32 w-32"
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to Discovering Ethiopia with EthioTravel!
            </h2>

            <p className="text-sm text-gray-600 mb-8">
              You have successfully created your account!
            </p>

            <Button
              onClick={handleContinue}
              className="w-full bg-green-500 hover:bg-green-600"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}