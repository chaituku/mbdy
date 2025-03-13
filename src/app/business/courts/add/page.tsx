// src/app/business/courts/add/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserProfile from "@/components/auth/UserProfile";

export default function AddCourt() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    courtType: "singles",
    features: {
      ledLighting: false,
      woodenFlooring: false,
      syntheticFlooring: false,
      shuttlecockService: false,
      airConditioning: false,
      waterDispenser: false,
      changingRoom: false,
      spectatorSeating: false
    },
    status: "active"
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [name]: checked
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // In a real implementation, this would call an API to create the court
      console.log("Court data to be submitted:", formData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to courts management page
      router.push("/business/courts/manage");
    } catch (error) {
      console.error("Error creating court:", error);
    } finally {
      setSubmitting(false);
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Add New Court</h1>
          <UserProfile />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl p-4">
        <div className="mb-6 flex justify-start">
          <button
            onClick={() => router.push("/business/courts/manage")}
            className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
          >
            Back to Courts
          </button>
        </div>

        {/* Court Form */}
        <div className="rounded-lg bg-white p-6 shadow">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Court Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="courtType" className="block text-sm font-medium text-gray-700">
                Court Type *
              </label>
              <select
                id="courtType"
                name="courtType"
                required
                value={formData.courtType}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              >
                <option value="singles">Singles</option>
                <option value="doubles">Doubles</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Features</label>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="ledLighting"
                    name="ledLighting"
                    checked={formData.features.ledLighting}
                    onChange={handleFeatureChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="ledLighting" className="ml-2 text-sm text-gray-700">
                    LED Lighting
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="woodenFlooring"
                    name="woodenFlooring"
                    checked={formData.features.woodenFlooring}
                    onChange={handleFeatureChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="woodenFlooring" className="ml-2 text-sm text-gray-700">
                    Wooden Flooring
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="syntheticFlooring"
                    name="syntheticFlooring"
                    checked={formData.features.syntheticFlooring}
                    onChange={handleFeatureChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="syntheticFlooring" className="ml-2 text-sm text-gray-700">
                    Synthetic Flooring
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="shuttlecockService"
                    name="shuttlecockService"
                    checked={formData.features.shuttlecockService}
                    onChange={handleFeatureChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="shuttlecockService" className="ml-2 text-sm text-gray-700">
                    Shuttlecock Service
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="airConditioning"
                    name="airConditioning"
                    checked={formData.features.airConditioning}
                    onChange={handleFeatureChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="airConditioning" className="ml-2 text-sm text-gray-700">
                    Air Conditioning
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="waterDispenser"
                    name="waterDispenser"
                    checked={formData.features.waterDispenser}
                    onChange={handleFeatureChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="waterDispenser" className="ml-2 text-sm text-gray-700">
                    Water Dispenser
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="changingRoom"
                    name="changingRoom"
                    checked={formData.features.changingRoom}
                    onChange={handleFeatureChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="changingRoom" className="ml-2 text-sm text-gray-700">
                    Changing Room
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="spectatorSeating"
                    name="spectatorSeating"
                    checked={formData.features.spectatorSeating}
                    onChange={handleFeatureChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="spectatorSeating" className="ml-2 text-sm text-gray-700">
                    Spectator Seating
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status *
              </label>
              <select
                id="status"
                name="status"
                required
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              >
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => router.push("/business/courts/manage")}
                className="mr-3 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {submitting ? "Creating..." : "Create Court"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
