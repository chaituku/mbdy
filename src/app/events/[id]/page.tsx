// src/app/events/[id]/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
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
  isPrivate: boolean;
};

type Participant = {
  id: number;
  name: string;
  email: string;
  status: string;
  hasPaid: boolean;
};

export default function EventDetails() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const params = useParams();
  const eventId = params.id;
  
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isParticipant, setIsParticipant] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (authStatus === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (authStatus === "loading") {
      return;
    }

    // Fetch event data
    const fetchEventData = async () => {
      try {
        // In a real implementation, this would call an API to fetch the event data
        // For now, we'll use mock data
        const mockEvents = [
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
            isPrivate: false,
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
            isPrivate: false,
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
            isPrivate: true,
          },
        ];

        const foundEvent = mockEvents.find(e => e.id === Number(eventId));
        
        if (foundEvent) {
          setEvent(foundEvent);
          
          // Mock participants data
          const mockParticipants = [
            {
              id: 2,
              name: "John Doe",
              email: "john@example.com",
              status: "confirmed",
              hasPaid: true,
            },
            {
              id: 5,
              name: "Sarah Williams",
              email: "sarah@example.com",
              status: "confirmed",
              hasPaid: true,
            },
          ];
          
          if (foundEvent.id === 3) {
            mockParticipants.push(
              {
                id: 6,
                name: "David Brown",
                email: "david@example.com",
                status: "confirmed",
                hasPaid: false,
              },
              {
                id: 7,
                name: "Emily Davis",
                email: "emily@example.com",
                status: "pending",
                hasPaid: false,
              }
            );
          }
          
          setParticipants(mockParticipants);
          
          // Check if current user is a participant
          const userId = session?.user?.id;
          setIsParticipant(mockParticipants.some(p => p.id === userId));
          
          // Check if current user is the organizer
          setIsOrganizer(foundEvent.organizerId === userId);
        } else {
          router.push("/events");
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
        router.push("/events");
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId, router, authStatus, session]);

  const handleJoinEvent = () => {
    router.push(`/events/${eventId}/join`);
  };

  const handleLeaveEvent = () => {
    // In a real implementation, this would call an API to leave the event
    if (confirm("Are you sure you want to leave this event?")) {
      // Simulate API call
      setTimeout(() => {
        router.push("/events");
      }, 500);
    }
  };

  const handleManageEvent = () => {
    router.push(`/events/${eventId}/manage`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Event not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
          <h1 className="text-2xl font-bold text-gray-900">Event Details</h1>
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

        {/* Event Details */}
        <div className="mb-6 overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{event.title}</h2>
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
            {event.isPrivate && (
              <span className="mt-2 inline-flex rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                Private Event
              </span>
            )}
            <p className="mt-4 text-gray-600">{event.description}</p>
            <div className="mt-6 space-y-4">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium">Location:</span>
                <span className="ml-2">{event.businessName} - {event.courtName}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">Date:</span>
                <span className="ml-2">
                  {new Date(event.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Time:</span>
                <span className="ml-2">{event.startTime} - {event.endTime} ({event.duration} hours)</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="font-medium">Participants:</span>
                <span className="ml-2">{event.currentParticipants}/{event.maxParticipants}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Cost per person:</span>
                <span className="ml-2">${event.costPerPerson.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-6 flex space-x-3">
              {!isParticipant && !isOrganizer && event.currentParticipants < event.maxParticipants && (
                <button
                  onClick={handleJoinEvent}
                  className="flex-1 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                  Join Event
                </button>
              )}
              {isParticipant && !isOrganizer && (
                <button
                  onClick={handleLeaveEvent}
                  className="flex-1 rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
                >
                  Leave Event
                </button>
              )}
              {isOrganizer && (
                <button
                  onClick={handleManageEvent}
                  className="flex-1 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                  Manage Event
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Participants */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Participants</h3>
          {participants.length === 0 ? (
            <p className="text-gray-500">No participants yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {participants.map((participant) => (
                <li key={participant.id} className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{participant.name}</p>
                      <p className="text-sm text-gray-500">{participant.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                        participant.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {participant.status}
                      </span>
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                        participant.hasPaid
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {participant.hasPaid ? "Paid" : "Unpaid"}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
