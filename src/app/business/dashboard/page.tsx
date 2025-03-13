// src/app/business/dashboard/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserProfile from "@/components/auth/UserProfile";

export default function BusinessDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Mock data for business dashboard
  const [businessStats, setBusinessStats] = useState({
    totalCourts: 3,
    activeBookings: 12,
    todayBookings: 5,
    monthlyRevenue: 1250.75,
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
          <h1 className="text-2xl font-bold text-gray-900">Business Dashboard</h1>
          <UserProfile />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl p-4">
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-sm font-medium text-gray-500">Total Courts</h2>
            <p className="mt-2 text-3xl font-bold text-gray-900">{businessStats.totalCourts}</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-sm font-medium text-gray-500">Active Bookings</h2>
            <p className="mt-2 text-3xl font-bold text-gray-900">{businessStats.activeBookings}</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-sm font-medium text-gray-500">Today's Bookings</h2>
            <p className="mt-2 text-3xl font-bold text-gray-900">{businessStats.todayBookings}</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-sm font-medium text-gray-500">Monthly Revenue</h2>
            <p className="mt-2 text-3xl font-bold text-gray-900">${businessStats.monthlyRevenue.toFixed(2)}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button 
              onClick={() => router.push("/business/courts/manage")}
              className="flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-white hover:bg-indigo-700"
            >
              Manage Courts
            </button>
            <button 
              onClick={() => router.push("/business/bookings")}
              className="flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-white hover:bg-indigo-700"
            >
              View Bookings
            </button>
            <button 
              onClick={() => router.push("/business/settings")}
              className="flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-white hover:bg-indigo-700"
            >
              Business Settings
            </button>
          </div>
        </div>

        {/* Recent Bookings */}
        <div>
          <h2 className="mb-4 text-xl font-bold text-gray-900">Recent Bookings</h2>
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Court</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {/* Mock booking data */}
                <tr>
                  <td className="whitespace-nowrap px-6 py-4">Court A</td>
                  <td className="whitespace-nowrap px-6 py-4">Mar 14, 2025 10:00 - 11:00</td>
                  <td className="whitespace-nowrap px-6 py-4">John Doe</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">Confirmed</span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">$15.00</td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap px-6 py-4">Court B</td>
                  <td className="whitespace-nowrap px-6 py-4">Mar 14, 2025 14:00 - 16:00</td>
                  <td className="whitespace-nowrap px-6 py-4">Jane Smith</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">Confirmed</span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">$50.00</td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap px-6 py-4">Court C</td>
                  <td className="whitespace-nowrap px-6 py-4">Mar 15, 2025 09:00 - 10:00</td>
                  <td className="whitespace-nowrap px-6 py-4">Mike Johnson</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex rounded-full bg-yellow-100 px-2 text-xs font-semibold leading-5 text-yellow-800">Pending</span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">$15.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
