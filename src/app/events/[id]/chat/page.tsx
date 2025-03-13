// src/app/events/[id]/chat/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import UserProfile from "@/components/auth/UserProfile";

type Participant = {
  id: number;
  name: string;
  isOnline: boolean;
};

type EventDetails = {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  courtName: string;
  businessName: string;
  participants: Participant[];
  organizerId: number;
};

type Message = {
  id: number;
  userId: number;
  userName: string;
  text: string;
  timestamp: string;
  isOrganizer: boolean;
};

export default function EventChatPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id ? parseInt(params.id as string) : 0;
  
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentUserId, setCurrentUserId] = useState<number>(0);

  useEffect(() => {
    // Check if user is authenticated
    if (authStatus === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (authStatus === "loading") {
      return;
    }

    // Set current user ID (in a real app, this would come from the session)
    setCurrentUserId(2); // Mock user ID for demo

    // Fetch event details and messages
    const fetchEventData = async () => {
      try {
        // In a real implementation, this would call APIs to fetch event details and messages
        // For now, we'll use mock data
        
        // Mock event details
        const mockEvent: EventDetails = {
          id: eventId,
          title: "Friendly Doubles Match",
          date: "2025-03-20",
          time: "15:00 - 17:00",
          location: "Demo Badminton Club",
          courtName: "Court A",
          businessName: "Demo Badminton Club",
          participants: [
            { id: 2, name: "John Doe (You)", isOnline: true },
            { id: 3, name: "Jane Smith", isOnline: true },
            { id: 4, name: "Mike Johnson", isOnline: false },
            { id: 5, name: "Sarah Williams", isOnline: false },
          ],
          organizerId: 2, // Current user is the organizer
        };
        
        setEvent(mockEvent);
        
        // Mock messages
        const mockMessages: Message[] = [
          {
            id: 1,
            userId: 2,
            userName: "John Doe",
            text: "Welcome everyone to our Friendly Doubles Match group chat!",
            timestamp: "2025-03-13T08:00:00Z",
            isOrganizer: true,
          },
          {
            id: 2,
            userId: 3,
            userName: "Jane Smith",
            text: "Thanks for organizing this! Looking forward to it.",
            timestamp: "2025-03-13T08:15:00Z",
            isOrganizer: false,
          },
          {
            id: 3,
            userId: 4,
            userName: "Mike Johnson",
            text: "Me too! It's been a while since I played doubles.",
            timestamp: "2025-03-13T09:30:00Z",
            isOrganizer: false,
          },
          {
            id: 4,
            userId: 5,
            userName: "Sarah Williams",
            text: "Should we bring our own shuttlecocks?",
            timestamp: "2025-03-13T10:45:00Z",
            isOrganizer: false,
          },
          {
            id: 5,
            userId: 2,
            userName: "John Doe",
            text: "I'll bring plenty of shuttlecocks for everyone, no need to worry about that.",
            timestamp: "2025-03-13T11:15:00Z",
            isOrganizer: true,
          },
          {
            id: 6,
            userId: 3,
            userName: "Jane Smith",
            text: "Great! Should we meet 15 minutes before the start time?",
            timestamp: "2025-03-13T12:30:00Z",
            isOrganizer: false,
          },
          {
            id: 7,
            userId: 2,
            userName: "John Doe",
            text: "Yes, that's a good idea. Let's meet at 2:45pm to warm up.",
            timestamp: "2025-03-13T13:00:00Z",
            isOrganizer: true,
          },
        ];
        
        setMessages(mockMessages);
      } catch (error) {
        console.error("Error fetching event data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventData();
    } else {
      router.push("/events");
    }
  }, [authStatus, router, eventId]);

  useEffect(() => {
    // Scroll to bottom of messages when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!event || !newMessage.trim()) return;
    
    const timestamp = new Date().toISOString();
    
    // Add message to current conversation
    const newMsg: Message = {
      id: Math.floor(Math.random() * 1000) + 100,
      userId: currentUserId,
      userName: "John Doe", // In a real app, this would come from the session
      text: newMessage.trim(),
      timestamp,
      isOrganizer: event.organizerId === currentUserId,
    };
    
    setMessages(prev => [...prev, newMsg]);
    
    // Clear input
    setNewMessage("");
    
    // In a real implementation, this would call an API to send the message
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + 
           ' | ' + 
           date.toLocaleDateString([], { month: 'short', day: 'numeric' });
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
          <h1 className="text-2xl font-bold text-gray-900">Event Chat</h1>
          <UserProfile />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl p-4">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.push(`/events/${eventId}`)}
            className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
          >
            Back to Event
          </button>
          <h2 className="text-xl font-semibold text-gray-900">{event.title}</h2>
          <div></div> {/* Empty div for flex alignment */}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Event Details */}
          <div className="lg:col-span-1">
            <div className="rounded-lg bg-white p-4 shadow">
              <h3 className="mb-4 text-lg font-medium text-gray-900">Event Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="text-gray-900">{event.date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Time</p>
                  <p className="text-gray-900">{event.time}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-gray-900">{event.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Court</p>
                  <p className="text-gray-900">{event.courtName}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-white p-4 shadow">
              <h3 className="mb-4 text-lg font-medium text-gray-900">Participants</h3>
              <ul className="space-y-3">
                {event.participants.map((participant) => (
                  <li key={participant.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="relative flex-shrink-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                          {participant.name.charAt(0)}
                        </div>
                        {participant.isOnline && (
                          <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-400 ring-1 ring-white"></span>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {participant.name}
                          {participant.id === event.organizerId && (
                            <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-800">
                              Organizer
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <span className={`h-2 w-2 rounded-full ${participant.isOnline ? 'bg-green-400' : 'bg-gray-300'}`}></span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Chat */}
          <div className="flex h-[calc(80vh-8rem)] flex-col rounded-lg bg-white shadow lg:col-span-3">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="flex">
                    <div className="flex-shrink-0">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        message.isOrganizer ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {message.userName.charAt(0)}
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="flex items-baseline space-x-2">
                        <span className={`font-medium ${message.isOrganizer ? 'text-indigo-600' : 'text-gray-900'}`}>
                          {message.userName}
                          {message.isOrganizer && (
                            <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-800">
                              Organizer
                            </span>
                          )}
                        </span>
                        <span className="text-xs text-gray-500">{formatTimestamp(message.timestamp)}</span>
                      </div>
                      <div className="mt-1 text-sm text-gray-800">
                        {message.text}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="rounded-md bg-indigo-600 p-2 text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
