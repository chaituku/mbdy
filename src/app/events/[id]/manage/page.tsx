// src/app/events/[id]/manage/page.tsx
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

export default function ManageEvent() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const params = useParams();
  const eventId = params.id;
  
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
          
          // Check if current user is the organizer
          const userId = session?.user?.id;
          const isUserOrganizer = foundEvent.organizerId === userId;
          setIsOrganizer(isUserOrganizer);
          
          if (!isUserOrganizer) {
            // Redirect if not the organizer
            router.push(`/events/${eventId}`);
          }
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

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteEmail.trim()) {
      setErrorMessage("Please enter an email address");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    
    // In a real implementation, this would call an API to send an invitation
    // For now, we'll just simulate it
    setSuccessMessage(`Invitation sent to ${inviteEmail}`);
    setInviteEmail("");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleRemoveParticipant = (participantId: number) => {
    if (confirm("Are you sure you want to remove this participant?")) {
      // In a real implementation, this would call an API to remove the participant
      setParticipants(prev => prev.filter(p => p.id !== participantId));
      
      if (event) {
        setEvent({
          ...event,
          currentParticipants: event.currentParticipants - 1
        });
      }
    }
  };

  const handleMarkAsPaid = (participantId: number) => {
    // In a real implementation, this would call an API to mark the participant as paid
    setParticipants(prev => prev.map(p => 
      p.id === participantId ? { ...p, hasPaid: true } : p
    ));
  };

  const handleCancelEvent = () => {
    if (confirm("Are you sure you want to cancel this event? This action cannot be undone.")) {
      // In a real implementation, this would call an API to cancel the event
      // For now, we'll just redirect back to the events page
      router.push("/events");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!event || !isOrganizer) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">You don't have permission to manage this event</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
          <h1 className="text-2xl font-bold text-gray-900">Manage Event</h1>
          <UserProfile />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-3xl p-4">
        <div className="mb-6 flex justify-start">
          <button
            onClick={() => router.push(`/events/${eventId}`)}
            className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
          >
            Back to Event Details
          </button>
        </div>

        {successMessage && (
          <div className="mb-6 rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Event Summary */}
        <div className="mb-6 overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900">Event Summary</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-500">Title</p>
                <p className="text-base text-gray-900">{event.title}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p className="text-base text-gray-900">
                  {new Date(event.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Time</p>
                <p className="text-base text-gray-900">{event.startTime} - {event.endTime}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p className="text-base text-gray-900">{event.businessName} - {event.courtName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Participants</p>
                <p className="text-base text-gray-900">{event.currentParticipants}/{event.maxParticipants}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Cost per Person</p>
                <p className="text-base text-gray-900">${event.costPerPerson.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Invite Participants */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Invite Participants</h3>
          <form onSubmit={handleInviteSubmit} className="flex space-x-2">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Enter email address"
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Send Invite
            </button>
          </form>
        </div>

        {/* Manage Participants */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Manage Participants</h3>
          {participants.length === 0 ? (
            <p className="text-gray-500">No participants yet.</p>
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Payment
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {participants.map((participant) => (
                    <tr key={participant.id}>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{participant.name}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-500">{participant.email}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          participant.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {participant.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          participant.hasPaid
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {participant.hasPaid ? "Paid" : "Unpaid"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        <div className="flex space-x-2">
                          {!participant.hasPaid && (
                            <button
                              onClick={() => handleMarkAsPaid(participant.id)}
                              className="rounded bg-green-100 px-2 py-1 text-xs text-green-800 hover:bg-green-200"
                            >
                              Mark as Paid
                            </button>
                          )}
                          <button
                            onClick={() => handleRemoveParticipant(participant.id)}
                            className="rounded bg-red-100 px-2 py-1 text-xs text-red-800 hover:bg-red-200"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Expense Tracking */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Expense Tracking</h3>
          <div className="rounded-md bg-gray-50 p-4">
            <div className="flex justify-between">
              <span className="font-medium">Total Court Cost:</span>
              <span>${(event.costPerPerson * event.maxParticipants).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Collected So Far:</span>
              <span>${(event.costPerPerson * participants.filter(p => p.hasPaid).length).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Remaining to Collect:</span>
              <span>${(event.costPerPerson * participants.filter(p => !p.hasPaid).length).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Cancel Event */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Cancel Event</h3>
          <p className="mb-4 text-sm text-gray-600">
            Cancelling this event will notify all participants and refund any payments made.
            This action cannot be undone.
          </p>
          <button
            onClick={handleCancelEvent}
            className="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
          >
            Cancel Event
          </button>
        </div>
      </main>
    </div>
  );
}
