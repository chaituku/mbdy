// src/app/events/create/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserProfile from "@/components/auth/UserProfile";

type Court = {
  id: number;
  name: string;
  businessName: string;
  pricePerHour: number;
};

type TimeSlot = {
  id: number;
  startTime: string;
  endTime: string;
  available: boolean;
  price: number;
};

export default function CreateEvent() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Mock data for courts
  const [courts, setCourts] = useState<Court[]>([
    {
      id: 1,
      name: "Court A",
      businessName: "Demo Badminton Club",
      pricePerHour: 15.00,
    },
    {
      id: 2,
      name: "Court B",
      businessName: "Demo Badminton Club",
      pricePerHour: 25.00,
    },
    {
      id: 3,
      name: "Court C",
      businessName: "Demo Badminton Club",
      pricePerHour: 15.00,
    },
  ]);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courtId: 1,
    date: "",
    startTime: "",
    endTime: "",
    maxParticipants: 4,
    costPerPerson: 0,
    isPrivate: false,
    inviteEmails: "",
  });

  // Time slots state
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
  const [totalCost, setTotalCost] = useState(0);

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

  useEffect(() => {
    // Calculate cost per person based on selected slots and max participants
    if (selectedSlots.length > 0 && formData.maxParticipants > 0) {
      const totalSlotCost = selectedSlots.reduce((sum, slotId) => {
        const slot = timeSlots.find(s => s.id === slotId);
        return sum + (slot?.price || 0);
      }, 0);
      
      setTotalCost(totalSlotCost);
      setFormData(prev => ({
        ...prev,
        costPerPerson: parseFloat((totalSlotCost / formData.maxParticipants).toFixed(2))
      }));
    } else {
      setTotalCost(0);
      setFormData(prev => ({
        ...prev,
        costPerPerson: 0
      }));
    }
  }, [selectedSlots, formData.maxParticipants, timeSlots]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleCourtChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const courtId = parseInt(e.target.value);
    setFormData(prev => ({
      ...prev,
      courtId
    }));
    
    // Reset selected slots when court changes
    setSelectedSlots([]);
    
    // If date is already selected, fetch time slots for the new court
    if (formData.date) {
      fetchTimeSlots(courtId, formData.date);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setFormData(prev => ({
      ...prev,
      date
    }));
    
    // Reset selected slots when date changes
    setSelectedSlots([]);
    
    // Fetch time slots for the selected court and date
    if (date) {
      fetchTimeSlots(formData.courtId, date);
    } else {
      setTimeSlots([]);
    }
  };

  const fetchTimeSlots = async (courtId: number, date: string) => {
    try {
      // In a real implementation, this would call an API to fetch available time slots
      // For now, we'll generate mock time slots
      const mockTimeSlots: TimeSlot[] = [];
      const startHour = 8; // 8 AM
      const endHour = 20; // 8 PM
      
      for (let hour = startHour; hour < endHour; hour++) {
        // Make some slots unavailable randomly
        const available = Math.random() > 0.3;
        
        // Get price from selected court
        const court = courts.find(c => c.id === courtId);
        const price = court?.pricePerHour || 15.00;
        
        mockTimeSlots.push({
          id: hour - startHour + 1,
          startTime: `${hour.toString().padStart(2, '0')}:00`,
          endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
          available,
          price,
        });
      }
      
      setTimeSlots(mockTimeSlots);
    } catch (error) {
      console.error("Error fetching time slots:", error);
      setTimeSlots([]);
    }
  };

  const handleSlotSelection = (slotId: number) => {
    setSelectedSlots(prev => {
      if (prev.includes(slotId)) {
        // Deselect slot
        return prev.filter(id => id !== slotId);
      } else {
        // Select slot
        return [...prev, slotId];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedSlots.length === 0) {
      alert("Please select at least one time slot.");
      return;
    }
    
    setSubmitting(true);
    
    try {
      // In a real implementation, this would call an API to create the event
      console.log("Event data to be submitted:", {
        ...formData,
        slots: selectedSlots.map(slotId => {
          const slot = timeSlots.find(s => s.id === slotId);
          return {
            startTime: slot?.startTime,
            endTime: slot?.endTime,
            price: slot?.price,
          };
        }),
        totalCost,
      });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to events page
      router.push("/events");
    } catch (error) {
      console.error("Error creating event:", error);
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
          <h1 className="text-2xl font-bold text-gray-900">Create Event</h1>
          <UserProfile />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-3xl p-4">
        <div className="mb-6 flex justify-start">
          <button
            onClick={() => router.push("/events")}
            className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
          >
            Back to Events
          </button>
        </div>

        {/* Event Form */}
        <div className="rounded-lg bg-white p-6 shadow">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Event Details</h2>
              <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>
                <div className="sm:col-span-6">
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
                <div className="sm:col-span-3">
                  <label htmlFor="courtId" className="block text-sm font-medium text-gray-700">
                    Court *
                  </label>
                  <select
                    id="courtId"
                    name="courtId"
                    required
                    value={formData.courtId}
                    onChange={handleCourtChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  >
                    {courts.map(court => (
                      <option key={court.id} value={court.id}>
                        {court.name} - {court.businessName} (${court.pricePerHour}/hour)
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-3">
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.date}
                    onChange={handleDateChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700">
                    Maximum Participants *
                  </label>
                  <input
                    type="number"
                    id="maxParticipants"
                    name="maxParticipants"
                    required
                    min={2}
                    max={20}
                    value={formData.maxParticipants}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>
                <div className="sm:col-span-3">
                  <div className="flex items-start pt-5">
                    <div className="flex h-5 items-center">
                      <input
                        id="isPrivate"
                        name="isPrivate"
                        type="checkbox"
                        checked={formData.isPrivate}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="isPrivate" className="font-medium text-gray-700">
                        Private Event
                      </label>
                      <p className="text-gray-500">Only invited participants can join.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Time Slots */}
            {timeSlots.length > 0 && (
              <div>
                <h2 className="text-lg font-medium text-gray-900">Select Time Slots</h2>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => slot.available && handleSlotSelection(slot.id)}
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
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Invite Participants */}
            {formData.isPrivate && (
              <div>
                <h2 className="text-lg font-medium text-gray-900">Invite Participants</h2>
                <div className="mt-4">
                  <label htmlFor="inviteEmails" className="block text-sm font-medium text-gray-700">
                    Email Addresses (comma separated)
                  </label>
                  <textarea
                    id="inviteEmails"
                    name="inviteEmails"
                    rows={2}
                    value={formData.inviteEmails}
                    onChange={handleChange}
                    placeholder="email1@example.com, email2@example.com"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* Cost Summary */}
            {selectedSlots.length > 0 && (
              <div>
                <h2 className="text-lg font-medium text-gray-900">Cost Summary</h2>
                <div className="mt-4 rounded-md bg-gray-50 p-4">
                  <div className="flex justify-between">
                    <span>Total Court Cost:</span>
                    <span>${totalCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost Per Person:</span>
                    <span>${formData.costPerPerson.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => router.push("/events")}
                className="mr-3 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || selectedSlots.length === 0}
                className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {submitting ? "Creating..." : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
