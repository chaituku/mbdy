// src/app/courts/[id]/book/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
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

type TimeSlot = {
  id: number;
  startTime: string;
  endTime: string;
  available: boolean;
  price: number;
  isPeak: boolean;
};

export default function BookCourt() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const params = useParams();
  const courtId = params.id;
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [court, setCourt] = useState<Court | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // Check if user is authenticated
    if (authStatus === "unauthenticated") {
      router.push(`/auth/signin?redirect=/courts/${courtId}/book`);
      return;
    }

    if (authStatus === "loading") {
      return;
    }

    // Fetch court data
    const fetchCourtData = async () => {
      try {
        // In a real implementation, this would call an API to fetch the court data
        // For now, we'll use mock data
        const mockCourts = [
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
        ];

        const foundCourt = mockCourts.find(c => c.id === Number(courtId));
        
        if (foundCourt) {
          setCourt(foundCourt);
          fetchTimeSlots(foundCourt.id, selectedDate);
        } else {
          router.push('/courts');
        }
      } catch (error) {
        console.error("Error fetching court data:", error);
        router.push('/courts');
      }
    };

    fetchCourtData();
  }, [courtId, router, authStatus, selectedDate]);

  const fetchTimeSlots = async (courtId: number, date: string) => {
    try {
      // In a real implementation, this would call an API to fetch available time slots
      // For now, we'll generate mock time slots
      const mockTimeSlots: TimeSlot[] = [];
      const startHour = 8; // 8 AM
      const endHour = 20; // 8 PM
      
      for (let hour = startHour; hour < endHour; hour++) {
        const isPeak = hour >= 17 || (hour >= 12 && hour < 14); // Peak hours: 12-2 PM and after 5 PM
        const price = isPeak ? 25.00 : 15.00;
        
        // Make some slots unavailable randomly
        const available = Math.random() > 0.3;
        
        mockTimeSlots.push({
          id: hour - startHour + 1,
          startTime: `${hour.toString().padStart(2, '0')}:00`,
          endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
          available,
          price,
          isPeak,
        });
      }
      
      setTimeSlots(mockTimeSlots);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching time slots:", error);
      setLoading(false);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    setSelectedSlots([]);
    setTotalPrice(0);
    setLoading(true);
  };

  const handleSlotSelection = (slotId: number, price: number) => {
    setSelectedSlots(prev => {
      if (prev.includes(slotId)) {
        // Deselect slot
        const newSelection = prev.filter(id => id !== slotId);
        calculateTotalPrice(newSelection);
        return newSelection;
      } else {
        // Select slot
        const newSelection = [...prev, slotId];
        calculateTotalPrice(newSelection);
        return newSelection;
      }
    });
  };

  const calculateTotalPrice = (selectedSlotIds: number[]) => {
    const total = selectedSlotIds.reduce((sum, slotId) => {
      const slot = timeSlots.find(slot => slot.id === slotId);
      return sum + (slot?.price || 0);
    }, 0);
    setTotalPrice(total);
  };

  const handleBooking = async () => {
    if (selectedSlots.length === 0) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      // In a real implementation, this would call an API to create the booking
      console.log("Booking data:", {
        courtId,
        date: selectedDate,
        slots: selectedSlots.map(slotId => {
          const slot = timeSlots.find(s => s.id === slotId);
          return {
            startTime: slot?.startTime,
            endTime: slot?.endTime,
            price: slot?.price,
          };
        }),
        totalPrice,
      });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to booking confirmation page
      router.push(`/bookings/confirmation?courtId=${courtId}&date=${selectedDate}&slots=${selectedSlots.join(',')}&total=${totalPrice}`);
    } catch (error) {
      console.error("Error creating booking:", error);
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
          <h1 className="text-2xl font-bold text-gray-900">Book a Court</h1>
          <UserProfile />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl p-4">
        <div className="mb-6 flex justify-start">
          <button
            onClick={() => router.push("/courts")}
            className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
          >
            Back to Courts
          </button>
        </div>

        {court && (
          <div className="mb-6 overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{court.name}</h2>
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                  {court.courtType}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">{court.businessName}</p>
              <p className="mt-2 text-gray-600">{court.description}</p>
              <div className="mt-4">
                <div className="flex flex-wrap gap-1">
                  {court.features.map((feature, index) => (
                    <span key={index} className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <span className="text-lg font-medium text-gray-900">
                  Starting from ${court.pricePerHour.toFixed(2)}/hour
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Date Selection */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Select Date</h3>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            min={new Date().toISOString().split('T')[0]}
            className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>

        {/* Time Slots */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Select Time Slots</h3>
          
          {timeSlots.length === 0 ? (
            <p className="text-gray-500">No time slots available for the selected date.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {timeSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => slot.available && handleSlotSelection(slot.id, slot.price)}
                  disabled={!slot.available}
                  className={`flex flex-col items-center rounded-md border p-3 ${
                    !slot.available
                      ? 'cursor-not-allowed border-gray-200 bg-gray-100 opacity-50'
                      : selectedSlots.includes(slot.id)
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-300 hover:border-indigo-300 hover:bg-indigo-50'
                  }`}
                >
                  <span className="text-sm font-medium">
                    {slot.startTime} - {slot.endTime}
                  </span>
                  <span className="mt-1 text-xs">
                    ${slot.price.toFixed(2)}
                  </span>
                  {slot.isPeak && (
                    <span className="mt-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800">
                      Peak
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Booking Summary */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Booking Summary</h3>
          
          {selectedSlots.length === 0 ? (
            <p className="text-gray-500">No time slots selected.</p>
          ) : (
            <>
              <div className="mb-4 space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Date:</span>
                  <span>{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Time Slots:</span>
                  <span>
                    {selectedSlots
                      .sort((a, b) => a - b)
                      .map(slotId => {
                        const slot = timeSlots.find(s => s.id === slotId);
                        return `${slot?.startTime} - ${slot?.endTime}`;
                      })
                      .join(', ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Duration:</span>
                  <span>{selectedSlots.length} hour{selectedSlots.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Total Price:</span>
                  <span className="text-lg font-bold">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              
              <button
                onClick={handleBooking}
                disabled={submitting}
                className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {submitting ? "Processing..." : "Confirm Booking"}
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
