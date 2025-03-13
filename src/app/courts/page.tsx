// src/app/courts/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserProfile from "@/components/auth/UserProfile";

type Court = {
  id: number;
  name: string;
  description: string;
  courtType: string;
  features: string[];
  status: string;
  businessName: string;
  pricePerHour: number;
};

export default function CourtListing() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Mock data for courts
  const [courts, setCourts] = useState<Court[]>([
    {
      id: 1,
      name: "Court A",
      description: "Professional singles court",
      courtType: "singles",
      features: ["LED lighting", "wooden flooring", "shuttlecock service"],
      status: "active",
      businessName: "Demo Badminton Club",
      pricePerHour: 15.00,
    },
    {
      id: 2,
      name: "Court B",
      description: "Professional doubles court",
      courtType: "doubles",
      features: ["LED lighting", "synthetic flooring", "shuttlecock service"],
      status: "active",
      businessName: "Demo Badminton Club",
      pricePerHour: 25.00,
    },
    {
      id: 3,
      name: "Court C",
      description: "Mixed court for all games",
      courtType: "mixed",
      features: ["standard lighting", "wooden flooring"],
      status: "active",
      businessName: "Demo Badminton Club",
      pricePerHour: 15.00,
    },
  ]);

  // Filter state
  const [filter, setFilter] = useState({
    courtType: "all",
    priceRange: "all",
    features: [] as string[],
    date: "",
  });

  useEffect(() => {
    // Check if user is authenticated
    if (status === "loading") {
      return;
    }
    setLoading(false);
  }, [status]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureFilterChange = (feature: string) => {
    setFilter(prev => {
      const features = [...prev.features];
      if (features.includes(feature)) {
        return {
          ...prev,
          features: features.filter(f => f !== feature)
        };
      } else {
        return {
          ...prev,
          features: [...features, feature]
        };
      }
    });
  };

  const handleBookCourt = (courtId: number) => {
    if (status === "authenticated") {
      router.push(`/courts/${courtId}/book`);
    } else {
      router.push("/auth/signin?redirect=/courts");
    }
  };

  // Apply filters to courts
  const filteredCourts = courts.filter(court => {
    // Filter by court type
    if (filter.courtType !== "all" && court.courtType !== filter.courtType) {
      return false;
    }
    
    // Filter by price range
    if (filter.priceRange !== "all") {
      if (filter.priceRange === "under15" && court.pricePerHour >= 15) {
        return false;
      } else if (filter.priceRange === "15to25" && (court.pricePerHour < 15 || court.pricePerHour > 25)) {
        return false;
      } else if (filter.priceRange === "over25" && court.pricePerHour <= 25) {
        return false;
      }
    }
    
    // Filter by features
    if (filter.features.length > 0) {
      for (const feature of filter.features) {
        if (!court.features.includes(feature)) {
          return false;
        }
      }
    }
    
    return true;
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
          <h1 className="text-2xl font-bold text-gray-900">Find a Court</h1>
          <UserProfile />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl p-4">
        {/* Filters */}
        <div className="mb-6 rounded-lg bg-white p-4 shadow">
          <h2 className="mb-4 text-lg font-medium text-gray-900">Filters</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label htmlFor="courtType" className="block text-sm font-medium text-gray-700">
                Court Type
              </label>
              <select
                id="courtType"
                name="courtType"
                value={filter.courtType}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              >
                <option value="all">All Types</option>
                <option value="singles">Singles</option>
                <option value="doubles">Doubles</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
            <div>
              <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700">
                Price Range
              </label>
              <select
                id="priceRange"
                name="priceRange"
                value={filter.priceRange}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              >
                <option value="all">All Prices</option>
                <option value="under15">Under $15/hour</option>
                <option value="15to25">$15 - $25/hour</option>
                <option value="over25">Over $25/hour</option>
              </select>
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={filter.date}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>
          </div>
          
          {/* Feature filters */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Features</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {["LED lighting", "wooden flooring", "synthetic flooring", "shuttlecock service", "air conditioning"].map((feature) => (
                <button
                  key={feature}
                  onClick={() => handleFeatureFilterChange(feature)}
                  className={`rounded-full px-3 py-1 text-sm ${
                    filter.features.includes(feature)
                      ? "bg-indigo-100 text-indigo-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {feature}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Courts Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourts.length === 0 ? (
            <div className="col-span-full py-8 text-center text-gray-500">
              No courts found matching your filters.
            </div>
          ) : (
            filteredCourts.map((court) => (
              <div key={court.id} className="overflow-hidden rounded-lg bg-white shadow">
                <div className="h-48 bg-gray-200">
                  {/* Court image would go here */}
                  <div className="flex h-full items-center justify-center text-gray-400">
                    Court Image
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">{court.name}</h3>
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      {court.courtType}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{court.businessName}</p>
                  <p className="mt-2 text-sm text-gray-600">{court.description}</p>
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-1">
                      {court.features.map((feature, index) => (
                        <span key={index} className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-900">${court.pricePerHour.toFixed(2)}/hour</span>
                    <button
                      onClick={() => handleBookCourt(court.id)}
                      className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
