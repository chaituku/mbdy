// src/app/bookings/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserProfile from "@/components/auth/UserProfile";

type Booking = {
  id: number;
  courtId: number;
  courtName: string;
  businessName: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
};

export default function UserBookings() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Mock data for bookings
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 12345,
      courtId: 1,
      courtName: "Court A",
      businessName: "Demo Badminton Club",
      date: "2025-03-20",
      startTime: "10:00",
      endTime: "12:00",
      duration: 2,
      totalPrice: 30.00,
      status: "upcoming",
      paymentStatus: "paid",
    },
    {
      id: 12346,
      courtId: 2,
      courtName: "Court B",
      businessName: "Demo Badminton Club",
      date: "2025-03-25",
      startTime: "14:00",
      endTime: "16:00",
      duration: 2,
      totalPrice: 50.00,
      status: "upcoming",
      paymentStatus: "paid",
    },
    {
      id: 12347,
      courtId: 3,
      courtName: "Court C",
      businessName: "Demo Badminton Club",
      date: "2025-03-10",
      startTime: "09:00",
      endTime: "10:00",
      duration: 1,
      totalPrice: 15.00,
      status: "completed",
      paymentStatus: "paid",
    },
    {
      id: 12348,
      courtId: 1,
      courtName: "Court A",
      businessName: "Demo Badminton Club",
      date: "2025-03-05",
      startTime: "11:00",
      endTime: "13:00",
      duration: 2,
      totalPrice: 30.00,
      status: "cancelled",
      paymentStatus: "refunded",
    },
  ]);

  // Filter state
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Check if user is authenticated
    if (authStatus === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (authStatus === "loading") {
      return;
    }

    setLoading(false);
  }, [authStatus, router]);

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  const handleCancelBooking = (bookingId: number) => {
    // In a real implementation, this would call an API to cancel the booking
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: "cancelled", paymentStatus: "refunded" } 
        : booking
    ));
  };

  const handleViewDetails = (bookingId: number) => {
    router.push(`/bookings/${bookingId}`);
  };

  // Apply filter to bookings
  const filteredBookings = bookings.filter(booking => {
    if (filter === "all") return true;
    return booking.status === filter;
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
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          <UserProfile />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl p-4">
        <div className="mb-6 flex justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => handleFilterChange("all")}
              className={`rounded-md px-4 py-2 ${
                filter === "all"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange("upcoming")}
              className={`rounded-md px-4 py-2 ${
                filter === "upcoming"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => handleFilterChange("completed")}
              className={`rounded-md px-4 py-2 ${
                filter === "completed"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => handleFilterChange("cancelled")}
              className={`rounded-md px-4 py-2 ${
                filter === "cancelled"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Cancelled
            </button>
          </div>
          <button
            onClick={() => router.push("/courts")}
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Book a Court
          </button>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center shadow">
            <h2 className="text-xl font-medium text-gray-900">No bookings found</h2>
            <p className="mt-2 text-gray-600">
              You don't have any {filter !== "all" ? filter : ""} bookings yet.
            </p>
            {filter !== "all" && (
              <button
                onClick={() => handleFilterChange("all")}
                className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
              >
                View All Bookings
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-6">
                  <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:space-y-0">
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">{booking.courtName}</h3>
                        <span className={`ml-2 rounded-full px-2 py-1 text-xs font-medium ${
                          booking.status === "upcoming"
                            ? "bg-blue-100 text-blue-800"
                            : booking.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{booking.businessName}</p>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="mr-1.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(booking.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="mr-1.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {booking.startTime} - {booking.endTime} ({booking.duration} hour{booking.duration !== 1 ? 's' : ''})
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="mr-1.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          ${booking.totalPrice.toFixed(2)} - 
                          <span className={`ml-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                            booking.paymentStatus === "paid"
                              ? "bg-green-100 text-green-800"
                              : booking.paymentStatus === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(booking.id)}
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                      >
                        View Details
                      </button>
                      {booking.status === "upcoming" && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
