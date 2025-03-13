// src/app/business/courts/manage/page.tsx
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
};

export default function ManageCourts() {
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
    },
    {
      id: 2,
      name: "Court B",
      description: "Professional doubles court",
      courtType: "doubles",
      features: ["LED lighting", "synthetic flooring", "shuttlecock service"],
      status: "active",
    },
    {
      id: 3,
      name: "Court C",
      description: "Mixed court for all games",
      courtType: "mixed",
      features: ["standard lighting", "wooden flooring"],
      status: "active",
    },
  ]);

  useEffect(() => {
    // Check if user is authenticated and is a business owner
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      if (session?.user?.role !== "business_owner") {
        router.push("/dashboard");
      }
      setLoading(false);
    }
  }, [status, session, router]);

  const handleAddCourt = () => {
    router.push("/business/courts/add");
  };

  const handleEditCourt = (id: number) => {
    router.push(`/business/courts/edit/${id}`);
  };

  const handleDeleteCourt = (id: number) => {
    // In a real implementation, this would call an API to delete the court
    setCourts(courts.filter(court => court.id !== id));
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Manage Courts</h1>
          <UserProfile />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl p-4">
        <div className="mb-6 flex justify-between">
          <button
            onClick={() => router.push("/business/dashboard")}
            className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
          >
            Back to Dashboard
          </button>
          <button
            onClick={handleAddCourt}
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Add New Court
          </button>
        </div>

        {/* Courts List */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Features</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {courts.map((court) => (
                <tr key={court.id}>
                  <td className="whitespace-nowrap px-6 py-4">{court.name}</td>
                  <td className="whitespace-nowrap px-6 py-4 capitalize">{court.courtType}</td>
                  <td className="px-6 py-4">{court.description}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {court.features.map((feature, index) => (
                        <span key={index} className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      court.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : court.status === 'maintenance' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {court.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditCourt(court.id)}
                        className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800 hover:bg-blue-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCourt(court.id)}
                        className="rounded bg-red-100 px-2 py-1 text-xs text-red-800 hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
