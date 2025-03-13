// src/app/business/schedule/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserProfile from "@/components/auth/UserProfile";

type ScheduleSlot = {
  id: number;
  courtId: number;
  courtName: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  pricePerHour: number;
  isPeak: boolean;
};

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function CourtSchedule() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Mock data for courts
  const [courts, setCourts] = useState([
    { id: 1, name: "Court A" },
    { id: 2, name: "Court B" },
    { id: 3, name: "Court C" },
  ]);
  
  // Mock data for schedule slots
  const [scheduleSlots, setScheduleSlots] = useState<ScheduleSlot[]>([
    {
      id: 1,
      courtId: 1,
      courtName: "Court A",
      dayOfWeek: 1, // Monday
      startTime: "08:00",
      endTime: "12:00",
      pricePerHour: 15.00,
      isPeak: false,
    },
    {
      id: 2,
      courtId: 1,
      courtName: "Court A",
      dayOfWeek: 1, // Monday
      startTime: "12:00",
      endTime: "20:00",
      pricePerHour: 25.00,
      isPeak: true,
    },
    {
      id: 3,
      courtId: 2,
      courtName: "Court B",
      dayOfWeek: 2, // Tuesday
      startTime: "08:00",
      endTime: "12:00",
      pricePerHour: 15.00,
      isPeak: false,
    },
    {
      id: 4,
      courtId: 2,
      courtName: "Court B",
      dayOfWeek: 2, // Tuesday
      startTime: "12:00",
      endTime: "20:00",
      pricePerHour: 25.00,
      isPeak: true,
    },
    {
      id: 5,
      courtId: 3,
      courtName: "Court C",
      dayOfWeek: 3, // Wednesday
      startTime: "08:00",
      endTime: "12:00",
      pricePerHour: 15.00,
      isPeak: false,
    },
    {
      id: 6,
      courtId: 3,
      courtName: "Court C",
      dayOfWeek: 3, // Wednesday
      startTime: "12:00",
      endTime: "20:00",
      pricePerHour: 25.00,
      isPeak: true,
    },
  ]);

  // State for the new schedule slot form
  const [newSlot, setNewSlot] = useState({
    courtId: 1,
    dayOfWeek: 1,
    startTime: "08:00",
    endTime: "10:00",
    pricePerHour: 15.00,
    isPeak: false,
  });

  // State for form visibility
  const [showForm, setShowForm] = useState(false);

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

  const handleAddSlot = () => {
    setShowForm(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setNewSlot(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else {
      setNewSlot(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) : value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real implementation, this would call an API to create the schedule slot
    const newId = Math.max(...scheduleSlots.map(slot => slot.id)) + 1;
    const courtName = courts.find(court => court.id === Number(newSlot.courtId))?.name || "";
    
    const newScheduleSlot: ScheduleSlot = {
      id: newId,
      courtId: Number(newSlot.courtId),
      courtName,
      dayOfWeek: Number(newSlot.dayOfWeek),
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
      pricePerHour: Number(newSlot.pricePerHour),
      isPeak: newSlot.isPeak,
    };
    
    setScheduleSlots(prev => [...prev, newScheduleSlot]);
    setShowForm(false);
    
    // Reset form
    setNewSlot({
      courtId: 1,
      dayOfWeek: 1,
      startTime: "08:00",
      endTime: "10:00",
      pricePerHour: 15.00,
      isPeak: false,
    });
  };

  const handleDeleteSlot = (id: number) => {
    // In a real implementation, this would call an API to delete the schedule slot
    setScheduleSlots(prev => prev.filter(slot => slot.id !== id));
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
          <h1 className="text-2xl font-bold text-gray-900">Court Schedule</h1>
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
            onClick={handleAddSlot}
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Add Schedule Slot
          </button>
        </div>

        {/* Add Schedule Slot Form */}
        {showForm && (
          <div className="mb-6 rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-medium text-gray-900">Add Schedule Slot</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="courtId" className="block text-sm font-medium text-gray-700">
                    Court
                  </label>
                  <select
                    id="courtId"
                    name="courtId"
                    value={newSlot.courtId}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  >
                    {courts.map(court => (
                      <option key={court.id} value={court.id}>{court.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="dayOfWeek" className="block text-sm font-medium text-gray-700">
                    Day of Week
                  </label>
                  <select
                    id="dayOfWeek"
                    name="dayOfWeek"
                    value={newSlot.dayOfWeek}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  >
                    {daysOfWeek.map((day, index) => (
                      <option key={index} value={index}>{day}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                    Start Time
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={newSlot.startTime}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                    End Time
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={newSlot.endTime}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="pricePerHour" className="block text-sm font-medium text-gray-700">
                    Price Per Hour
                  </label>
                  <input
                    type="number"
                    id="pricePerHour"
                    name="pricePerHour"
                    min="0"
                    step="0.01"
                    value={newSlot.pricePerHour}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPeak"
                    name="isPeak"
                    checked={newSlot.isPeak}
                    onChange={(e) => setNewSlot(prev => ({ ...prev, isPeak: e.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="isPeak" className="ml-2 text-sm text-gray-700">
                    Peak Hours
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Add Slot
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Schedule Slots Table */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Court</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Day</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Price/Hour</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Peak</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {scheduleSlots.map((slot) => (
                <tr key={slot.id}>
                  <td className="whitespace-nowrap px-6 py-4">{slot.courtName}</td>
                  <td className="whitespace-nowrap px-6 py-4">{daysOfWeek[slot.dayOfWeek]}</td>
                  <td className="whitespace-nowrap px-6 py-4">{slot.startTime} - {slot.endTime}</td>
                  <td className="whitespace-nowrap px-6 py-4">${slot.pricePerHour.toFixed(2)}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {slot.isPeak ? (
                      <span className="inline-flex rounded-full bg-yellow-100 px-2 text-xs font-semibold leading-5 text-yellow-800">
                        Peak
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                        Off-Peak
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <button
                      onClick={() => handleDeleteSlot(slot.id)}
                      className="rounded bg-red-100 px-2 py-1 text-xs text-red-800 hover:bg-red-200"
                    >
                      Delete
                    </button>
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
