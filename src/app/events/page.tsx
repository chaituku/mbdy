// src/app/events/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserProfile from "@/components/auth/UserProfile";

type Event = {
  id: number;
  title: string;
  description: string;
  courtId: number;
  courtName: string;
  businessName: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  maxParticipants: number;
  currentParticipants: number;
  costPerPerson: number;
  status: string;
  organizerId: number;
  organizerName: string;
};

export default function EventsListing() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Mock data for events
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: "Friendly Doubles Match",
      description: "Looking for players to join a friendly doubles match. All skill levels welcome!",
      courtId: 1,
      courtName: "Court A",
      businessName: "Demo Badminton Club",
      date: "2025-03-20",
      startTime: "18:00",
      endTime: "20:00",
      duration: 2,
      maxParticipants: 4,
      currentParticipants: 2,
      costPerPerson: 15.00,
      status: "open",
      organizerId: 2,
      organizerName: "John Doe",
    },
    {
      id: 2,
      title: "Competitive Singles Practice",
      description: "Practice session for competitive singles players. Intermediate to advanced level.",
      courtId: 2,
      courtName: "Court B",
      businessName: "Demo Badminton Club",
      date: "2025-03-22",
      startTime: "16:00",
      endTime: "18:00",
      duration: 2,
      maxParticipants: 2,
      currentParticipants: 1,
      costPerPerson: 25.00,
      status: "open",
      organizerId: 3,
      organizerName: "Jane Smith",
    },
    {
      id: 3,
      title: "Beginners Training Session",
      description: "Training session for beginners. Learn the basics and have fun!",
      courtId: 3,
      courtName: "Court C",
      businessName: "Demo Badminton Club",
      date: "2025-03-25",
      startTime: "10:00",
      endTime: "12:00",
      duration: 2,
      maxParticipants: 6,
      currentParticipants: 3,
      costPerPerson: 10.00,
      status: "open",
      organizerId: 4,
      organizerName: "Mike Johnson",
    },
    {
      id: 4,
      title: "Mixed Doubles Tournament",
      description: "Small tournament for mixed doubles. Prizes for winners!",
      courtId: 1,
      courtName: "Court A",
      businessName: "Demo Badminton Club",
      date: "2025-03-15",
      startTime: "14:00",
      endTime: "18:00",
      duration: 4,
      maxParticipants: 8,
      currentParticipants: 8,
      costPerPerson: 20.00,
      status: "full",
      organizerId: 2,
      organizerName: "John Doe",
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

  const handleCreateEvent = () => {
    router.push("/events/create");
  };

  const handleJoinEvent = (eventId: number) => {
    // In a real implementation, this would call an API to join the event
    router.push(`/events/${eventId}/join`);
  };

  const handleViewEvent = (eventId: number) => {
    router.push(`/events/${eventId}`);
  };

  // Apply filter to events
  const filteredEvents = events.filter(event => {
    if (filter === "all") return true;
    if (filter === "open") return event.status === "open" && event.currentParticipants < event.maxParticipants;
    if (filter === "full") return event.status === "full" || event.currentParticipants >= event.maxParticipants;
    if (filter === "my") return event.organizerId === session?.user?.id;
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
          <h1 className="text-2xl font-bold text-gray-900">Badminton Events</h1>
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
              All Events
            </button>
            <button
              onClick={() => handleFilterChange("open")}
              className={`rounded-md px-4 py-2 ${
                filter === "open"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Open Events
            </button>
            <button
              onClick={() => handleFilterChange("my")}
              className={`rounded-md px-4 py-2 ${
                filter === "my"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              My Events
            </button>
          </div>
          <button
            onClick={handleCreateEvent}
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Create Event
          </button>
        </div>

        {/* Events List */}
        {filteredEvents.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center shadow">
            <h2 className="text-xl font-medium text-gray-900">No events found</h2>
            <p className="mt-2 text-gray-600">
              {filter === "my" 
                ? "You haven't organized any events yet." 
                : filter === "open" 
                ? "There are no open events available at the moment."
                : "There are no events available at the moment."}
            </p>
            <button
              onClick={handleCreateEvent}
              className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              Create an Event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <div key={event.id} className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                      event.currentParticipants >= event.maxParticipants
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}>
                      {event.currentParticipants >= event.maxParticipants ? "Full" : "Open"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Organized by {event.organizerName}
                  </p>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{event.description}</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="mr-1.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.businessName} - {event.courtName}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="mr-1.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(event.date).toLocaleDateString('en-US', { 
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
                      {event.startTime} - {event.endTime} ({event.duration} hours)
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="mr-1.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {event.currentParticipants}/{event.maxParticipants} participants
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="mr-1.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      ${event.costPerPerson.toFixed(2)} per person
                    </div>
                  </div>
                  <div className="mt-6 flex space-x-2">
                    <button
                      onClick={() => handleViewEvent(event.id)}
                      className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                      View Details
                    </button>
                    {event.currentParticipants < event.maxParticipants && event.organizerId !== session?.user?.id && (
                      <button
                        onClick={() => handleJoinEvent(event.id)}
                        className="flex-1 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                      >
                        Join Event
                      </button>
                    )}
                    {event.organizerId === session?.user?.id && (
                      <button
                        onClick={() => router.push(`/events/${event.id}/manage`)}
                        className="flex-1 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                      >
                        Manage
                      </button>
                    )}
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
