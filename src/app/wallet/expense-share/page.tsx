// src/app/wallet/expense-share/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserProfile from "@/components/auth/UserProfile";

type Event = {
  id: number;
  title: string;
  date: string;
  courtName: string;
  businessName: string;
  totalCost: number;
};

type Participant = {
  id: number;
  name: string;
  email: string;
  hasPaid: boolean;
  amountDue: number;
  selected: boolean;
};

export default function ExpenseSharePage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [customAmount, setCustomAmount] = useState("");
  const [splitMethod, setSplitMethod] = useState<"equal" | "custom">("equal");
  const [processing, setProcessing] = useState(false);
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

    // Fetch wallet balance and events
    const fetchData = async () => {
      try {
        // In a real implementation, this would call APIs to fetch wallet data and events
        // For now, we'll use mock data
        const mockBalance = 150.75;
        setBalance(mockBalance);
        
        // Mock events
        const mockEvents: Event[] = [
          {
            id: 1,
            title: "Friendly Doubles Match",
            date: "2025-03-20",
            courtName: "Court A",
            businessName: "Demo Badminton Club",
            totalCost: 60.00,
          },
          {
            id: 2,
            title: "Competitive Singles Practice",
            date: "2025-03-22",
            courtName: "Court B",
            businessName: "Demo Badminton Club",
            totalCost: 50.00,
          },
          {
            id: 3,
            title: "Beginners Training Session",
            date: "2025-03-25",
            courtName: "Court C",
            businessName: "Demo Badminton Club",
            totalCost: 60.00,
          },
        ];
        
        setEvents(mockEvents);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authStatus, router]);

  const handleEventSelect = async (eventId: number) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    setSelectedEvent(event);
    
    try {
      // In a real implementation, this would call an API to fetch participants
      // For now, we'll use mock data
      const mockParticipants: Participant[] = [
        {
          id: 2,
          name: "John Doe (You)",
          email: "john@example.com",
          hasPaid: true,
          amountDue: 0,
          selected: false,
        },
        {
          id: 5,
          name: "Sarah Williams",
          email: "sarah@example.com",
          hasPaid: false,
          amountDue: 0,
          selected: true,
        },
        {
          id: 6,
          name: "David Brown",
          email: "david@example.com",
          hasPaid: false,
          amountDue: 0,
          selected: true,
        },
      ];
      
      if (event.id === 3) {
        mockParticipants.push(
          {
            id: 7,
            name: "Emily Davis",
            email: "emily@example.com",
            hasPaid: false,
            amountDue: 0,
            selected: true,
          }
        );
      }
      
      // Calculate equal split
      const totalParticipants = mockParticipants.filter(p => !p.hasPaid).length + 1;
      const equalShare = event.totalCost / totalParticipants;
      
      const updatedParticipants = mockParticipants.map(p => ({
        ...p,
        amountDue: p.hasPaid ? 0 : equalShare,
      }));
      
      setParticipants(updatedParticipants);
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };

  const handleParticipantToggle = (participantId: number) => {
    setParticipants(prev => prev.map(p => 
      p.id === participantId ? { ...p, selected: !p.selected } : p
    ));
    
    // Recalculate amounts if using equal split
    if (splitMethod === "equal" && selectedEvent) {
      recalculateEqualSplit();
    }
  };

  const recalculateEqualSplit = () => {
    if (!selectedEvent) return;
    
    const selectedParticipants = participants.filter(p => p.selected && !p.hasPaid);
    const totalParticipants = selectedParticipants.length + 1; // +1 for the organizer
    
    if (totalParticipants <= 1) {
      setErrorMessage("You need to select at least one participant to share expenses.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    
    const equalShare = selectedEvent.totalCost / totalParticipants;
    
    setParticipants(prev => prev.map(p => ({
      ...p,
      amountDue: (p.selected && !p.hasPaid) ? equalShare : 0,
    })));
  };

  const handleSplitMethodChange = (method: "equal" | "custom") => {
    setSplitMethod(method);
    
    if (method === "equal" && selectedEvent) {
      recalculateEqualSplit();
    }
  };

  const handleCustomAmountChange = (participantId: number, amount: string) => {
    const numAmount = parseFloat(amount);
    
    setParticipants(prev => prev.map(p => 
      p.id === participantId ? { ...p, amountDue: isNaN(numAmount) ? 0 : numAmount } : p
    ));
  };

  const handleRequestPayment = async () => {
    if (!selectedEvent) {
      setErrorMessage("Please select an event");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    
    const selectedParticipants = participants.filter(p => p.selected && !p.hasPaid);
    if (selectedParticipants.length === 0) {
      setErrorMessage("Please select at least one participant");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    
    // Validate custom amounts if using custom split
    if (splitMethod === "custom") {
      const totalRequested = selectedParticipants.reduce((sum, p) => sum + p.amountDue, 0);
      if (totalRequested <= 0) {
        setErrorMessage("Total requested amount must be greater than 0");
        setTimeout(() => setErrorMessage(""), 3000);
        return;
      }
      
      if (Math.abs(totalRequested - selectedEvent.totalCost) > 0.01) {
        setErrorMessage("Total requested amount must equal the event cost");
        setTimeout(() => setErrorMessage(""), 3000);
        return;
      }
    }
    
    setProcessing(true);
    
    try {
      // In a real implementation, this would call an API to send payment requests
      // For now, we'll just simulate it
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const requestedParticipants = selectedParticipants.map(p => p.name).join(", ");
      setSuccessMessage(`Payment requests sent to ${requestedParticipants}`);
      setTimeout(() => {
        setSuccessMessage("");
        router.push("/wallet");
      }, 3000);
    } catch (error) {
      console.error("Error sending payment requests:", error);
      setErrorMessage("Failed to send payment requests. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setProcessing(false);
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
          <h1 className="text-2xl font-bold text-gray-900">Share Expenses</h1>
          <UserProfile />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-3xl p-4">
        <div className="mb-6 flex justify-start">
          <button
            onClick={() => router.push("/wallet")}
            className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
          >
            Back to Wallet
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

        {/* Step 1: Select Event */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-medium text-gray-900">Step 1: Select Event</h2>
          {events.length === 0 ? (
            <p className="mt-4 text-gray-500">You don't have any events to share expenses for.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {events.map(event => (
                <div 
                  key={event.id}
                  onClick={() => handleEventSelect(event.id)}
                  className={`cursor-pointer rounded-md border p-4 ${
                    selectedEvent?.id === event.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(event.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="text-sm text-gray-500">{event.businessName} - {event.courtName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${event.totalCost.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">Total Cost</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Step 2: Select Participants */}
        {selectedEvent && (
          <div className="mb-6 rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-medium text-gray-900">Step 2: Select Participants</h2>
            <div className="mt-4 space-y-3">
              {participants.map(participant => (
                <div key={participant.id} className="rounded-md border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {!participant.hasPaid && (
                        <input
                          type="checkbox"
                          checked={participant.selected}
                          onChange={() => handleParticipantToggle(participant.id)}
                          className="mr-3 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{participant.name}</p>
                        <p className="text-sm text-gray-500">{participant.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {participant.hasPaid ? (
                        <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                          Paid
                        </span>
                      ) : (
                        splitMethod === "custom" ? (
                          <div className="flex items-center">
                            <span className="mr-2 text-sm text-gray-500">$</span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={participant.amountDue.toString()}
                              onChange={(e) => handleCustomAmountChange(participant.id, e.target.value)}
                              disabled={!participant.selected}
                              className="w-20 rounded-md border-gray-300 text-right shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50"
                            />
                          </div>
                        ) : (
                          <span className="font-medium text-gray-900">
                            ${participant.amountDue.toFixed(2)}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Choose Split Method */}
        {selectedEvent && participants.some(p => p.selected && !p.hasPaid) && (
          <div className="mb-6 rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-medium text-gray-900">Step 3: Choose Split Method</h2>
            <div className="mt-4 space-y-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleSplitMethodChange("equal")}
                  className={`flex-1 rounded-md border px-4 py-2 text-center ${
                    splitMethod === "equal"
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Equal Split
                </button>
                <button
                  onClick={() => handleSplitMethodChange("custom")}
                  className={`flex-1 rounded-md border px-4 py-2 text-center ${
                    splitMethod === "custom"
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Custom Split
                </button>
              </div>
              
              <div className="rounded-md bg-gray-50 p-4">
                <div className="flex justify-between">
                  <span className="font-medium">Total Event Cost:</span>
                  <span>${selectedEvent.totalCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Your Share:</span>
                  <span>${(selectedEvent.totalCost - participants.filter(p => p.selected && !p.hasPaid).reduce((sum, p) => sum + p.amountDue, 0)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">To Be Collected:</span>
                  <span>${participants.filter(p => p.selected && !p.hasPaid).reduce((sum, p) => sum + p.amountDue, 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Request Payment Button */}
        {selectedEvent && participants.some(p => p.selected && !p.hasPaid) && (
          <div className="flex justify-end">
            <button
              onClick={handleRequestPayment}
              disabled={processing}
              className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {processing ? "Processing..." : "Request Payment"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
