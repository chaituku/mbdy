// src/app/bookings/confirmation/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import UserProfile from "@/components/auth/UserProfile";

type Court = {
  id: number;
  name: string;
  businessName: string;
};

export default function BookingConfirmation() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState({
    courtId: 0,
    courtName: "",
    businessName: "",
    date: "",
    slots: [] as string[],
    totalPrice: 0,
    bookingId: Math.floor(Math.random() * 1000000) + 1000, // Generate random booking ID
  });

  useEffect(() => {
    // Check if user is authenticated
    if (authStatus === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (authStatus === "loading") {
      return;
    }

    // Get booking details from URL params
    const courtId = searchParams.get("courtId");
    const date = searchParams.get("date");
    const slots = searchParams.get("slots");
    const total = searchParams.get("total");

    if (!courtId || !date || !slots || !total) {
      router.push("/courts");
      return;
    }

    // Fetch court details
    const fetchCourtDetails = async () => {
      try {
        // In a real implementation, this would call an API to fetch the court data
        // For now, we'll use mock data
        const mockCourts = [
          {
            id: 1,
            name: "Court A",
            businessName: "Demo Badminton Club",
          },
          {
            id: 2,
            name: "Court B",
            businessName: "Demo Badminton Club",
          },
          {
            id: 3,
            name: "Court C",
            businessName: "Demo Badminton Club",
          },
        ];

        const court = mockCourts.find(c => c.id === Number(courtId));
        
        if (court) {
          // Mock time slots based on slot IDs
          const mockTimeSlots: Record<string, { start: string, end: string }> = {
            "1": { start: "08:00", end: "09:00" },
            "2": { start: "09:00", end: "10:00" },
            "3": { start: "10:00", end: "11:00" },
            "4": { start: "11:00", end: "12:00" },
            "5": { start: "12:00", end: "13:00" },
            "6": { start: "13:00", end: "14:00" },
            "7": { start: "14:00", end: "15:00" },
            "8": { start: "15:00", end: "16:00" },
            "9": { start: "16:00", end: "17:00" },
            "10": { start: "17:00", end: "18:00" },
            "11": { start: "18:00", end: "19:00" },
            "12": { start: "19:00", end: "20:00" },
          };
          
          const slotIds = slots.split(',');
          const timeSlots = slotIds.map(id => {
            const slot = mockTimeSlots[id];
            return slot ? `${slot.start} - ${slot.end}` : "";
          }).filter(Boolean);
          
          setBookingDetails({
            courtId: court.id,
            courtName: court.name,
            businessName: court.businessName,
            date,
            slots: timeSlots,
            totalPrice: parseFloat(total),
            bookingId: Math.floor(Math.random() * 1000000) + 1000,
          });
        } else {
          router.push("/courts");
        }
      } catch (error) {
        console.error("Error fetching court details:", error);
        router.push("/courts");
      } finally {
        setLoading(false);
      }
    };

    fetchCourtDetails();
  }, [router, authStatus, searchParams]);

  const handleViewBookings = () => {
    router.push("/bookings");
  };

  const handleBookAnother = () => {
    router.push("/courts");
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
          <h1 className="text-2xl font-bold text-gray-900">Booking Confirmation</h1>
          <UserProfile />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-3xl p-4">
        <div className="rounded-lg bg-white p-8 shadow">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h2>
            <p className="mt-2 text-gray-600">
              Your booking has been confirmed. We've sent a confirmation email to your registered email address.
            </p>
          </div>

          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Booking Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Booking ID:</span>
                <span className="font-medium">{bookingDetails.bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Court:</span>
                <span className="font-medium">{bookingDetails.courtName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Venue:</span>
                <span className="font-medium">{bookingDetails.businessName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">
                  {new Date(bookingDetails.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{bookingDetails.slots.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{bookingDetails.slots.length} hour{bookingDetails.slots.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-medium">${bookingDetails.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">Paid</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
            <button
              onClick={handleViewBookings}
              className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              View My Bookings
            </button>
            <button
              onClick={handleBookAnother}
              className="flex-1 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Book Another Court
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
