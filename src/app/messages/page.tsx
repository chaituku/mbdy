// src/app/messages/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import UserProfile from "@/components/auth/UserProfile";

type Conversation = {
  id: number;
  with: {
    id: number;
    name: string;
    avatar?: string;
    isOnline: boolean;
  };
  lastMessage: {
    text: string;
    timestamp: string;
    isRead: boolean;
    sentByMe: boolean;
  };
  unreadCount: number;
};

type Message = {
  id: number;
  text: string;
  timestamp: string;
  sentByMe: boolean;
  isRead: boolean;
};

export default function MessagesPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user is authenticated
    if (authStatus === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (authStatus === "loading") {
      return;
    }

    // Fetch conversations
    const fetchConversations = async () => {
      try {
        // In a real implementation, this would call an API to fetch conversations
        // For now, we'll use mock data
        const mockConversations: Conversation[] = [
          {
            id: 1,
            with: {
              id: 3,
              name: "Jane Smith",
              isOnline: true,
            },
            lastMessage: {
              text: "See you at the court tomorrow!",
              timestamp: "2025-03-13T10:30:00Z",
              isRead: true,
              sentByMe: false,
            },
            unreadCount: 0,
          },
          {
            id: 2,
            with: {
              id: 4,
              name: "Mike Johnson",
              isOnline: false,
            },
            lastMessage: {
              text: "I've sent the payment for the event.",
              timestamp: "2025-03-12T16:45:00Z",
              isRead: false,
              sentByMe: false,
            },
            unreadCount: 2,
          },
          {
            id: 3,
            with: {
              id: 5,
              name: "Sarah Williams",
              isOnline: true,
            },
            lastMessage: {
              text: "Can we reschedule to 7pm?",
              timestamp: "2025-03-11T14:20:00Z",
              isRead: true,
              sentByMe: true,
            },
            unreadCount: 0,
          },
          {
            id: 4,
            with: {
              id: 6,
              name: "Friendly Doubles Match",
              isOnline: false,
            },
            lastMessage: {
              text: "David: I'll bring extra shuttlecocks.",
              timestamp: "2025-03-10T09:15:00Z",
              isRead: true,
              sentByMe: false,
            },
            unreadCount: 0,
          },
        ];
        
        setConversations(mockConversations);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [authStatus, router]);

  useEffect(() => {
    // Scroll to bottom of messages when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    
    try {
      // In a real implementation, this would call an API to fetch messages
      // For now, we'll use mock data
      const mockMessages: Message[] = [];
      
      // Generate mock messages based on conversation id
      if (conversation.id === 1) {
        mockMessages.push(
          {
            id: 1,
            text: "Hi Jane, are we still on for tomorrow's game?",
            timestamp: "2025-03-13T09:15:00Z",
            sentByMe: true,
            isRead: true,
          },
          {
            id: 2,
            text: "Yes, definitely! I've booked Court A for 3pm.",
            timestamp: "2025-03-13T09:20:00Z",
            sentByMe: false,
            isRead: true,
          },
          {
            id: 3,
            text: "Perfect! Should I bring anything?",
            timestamp: "2025-03-13T09:25:00Z",
            sentByMe: true,
            isRead: true,
          },
          {
            id: 4,
            text: "Just your racquet and some water. I have plenty of shuttlecocks.",
            timestamp: "2025-03-13T09:30:00Z",
            sentByMe: false,
            isRead: true,
          },
          {
            id: 5,
            text: "Sounds good. Looking forward to it!",
            timestamp: "2025-03-13T10:00:00Z",
            sentByMe: true,
            isRead: true,
          },
          {
            id: 6,
            text: "See you at the court tomorrow!",
            timestamp: "2025-03-13T10:30:00Z",
            sentByMe: false,
            isRead: true,
          }
        );
      } else if (conversation.id === 2) {
        mockMessages.push(
          {
            id: 7,
            text: "Hey Mike, just a reminder about the payment for Saturday's event.",
            timestamp: "2025-03-12T14:30:00Z",
            sentByMe: true,
            isRead: true,
          },
          {
            id: 8,
            text: "Oh right, let me do that now.",
            timestamp: "2025-03-12T15:45:00Z",
            sentByMe: false,
            isRead: true,
          },
          {
            id: 9,
            text: "Thanks!",
            timestamp: "2025-03-12T15:50:00Z",
            sentByMe: true,
            isRead: true,
          },
          {
            id: 10,
            text: "I've sent the payment for the event.",
            timestamp: "2025-03-12T16:45:00Z",
            sentByMe: false,
            isRead: false,
          },
          {
            id: 11,
            text: "Also, can I bring a friend along?",
            timestamp: "2025-03-12T16:46:00Z",
            sentByMe: false,
            isRead: false,
          }
        );
      } else if (conversation.id === 3) {
        mockMessages.push(
          {
            id: 12,
            text: "Hi Sarah, are you available for a game this Friday at 6pm?",
            timestamp: "2025-03-11T11:00:00Z",
            sentByMe: true,
            isRead: true,
          },
          {
            id: 13,
            text: "Hi! Friday works, but I might be running a bit late from work.",
            timestamp: "2025-03-11T11:30:00Z",
            sentByMe: false,
            isRead: true,
          },
          {
            id: 14,
            text: "No problem. What time would be better for you?",
            timestamp: "2025-03-11T12:15:00Z",
            sentByMe: true,
            isRead: true,
          },
          {
            id: 15,
            text: "Maybe 6:30 or 7pm would be safer?",
            timestamp: "2025-03-11T13:45:00Z",
            sentByMe: false,
            isRead: true,
          },
          {
            id: 16,
            text: "Can we reschedule to 7pm?",
            timestamp: "2025-03-11T14:20:00Z",
            sentByMe: true,
            isRead: true,
          }
        );
      } else if (conversation.id === 4) {
        mockMessages.push(
          {
            id: 17,
            text: "Welcome everyone to our Friendly Doubles Match group chat!",
            timestamp: "2025-03-09T08:00:00Z",
            sentByMe: true,
            isRead: true,
          },
          {
            id: 18,
            text: "Thanks for organizing this! Looking forward to it.",
            timestamp: "2025-03-09T08:15:00Z",
            sentByMe: false,
            isRead: true,
          },
          {
            id: 19,
            text: "Me too! It's been a while since I played doubles.",
            timestamp: "2025-03-09T09:30:00Z",
            sentByMe: false,
            isRead: true,
          },
          {
            id: 20,
            text: "Should we bring our own shuttlecocks?",
            timestamp: "2025-03-10T08:45:00Z",
            sentByMe: false,
            isRead: true,
          },
          {
            id: 21,
            text: "I'll bring extra shuttlecocks.",
            timestamp: "2025-03-10T09:15:00Z",
            sentByMe: false,
            isRead: true,
          }
        );
      }
      
      setMessages(mockMessages);
      
      // Mark conversation as read
      if (conversation.unreadCount > 0) {
        setConversations(prev => 
          prev.map(conv => 
            conv.id === conversation.id 
              ? { 
                  ...conv, 
                  unreadCount: 0,
                  lastMessage: { ...conv.lastMessage, isRead: true }
                } 
              : conv
          )
        );
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = () => {
    if (!selectedConversation || !newMessage.trim()) return;
    
    const timestamp = new Date().toISOString();
    
    // Add message to current conversation
    const newMsg: Message = {
      id: Math.floor(Math.random() * 1000) + 100,
      text: newMessage.trim(),
      timestamp,
      sentByMe: true,
      isRead: false,
    };
    
    setMessages(prev => [...prev, newMsg]);
    
    // Update conversation last message
    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { 
              ...conv, 
              lastMessage: {
                text: newMessage.trim(),
                timestamp,
                isRead: false,
                sentByMe: true,
              }
            } 
          : conv
      )
    );
    
    // Clear input
    setNewMessage("");
    
    // In a real implementation, this would call an API to send the message
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Today - show time
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      // Yesterday
      return 'Yesterday';
    } else if (diffDays < 7) {
      // Within a week - show day name
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      // Older - show date
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
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
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <UserProfile />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl p-4">
        <div className="flex h-[calc(100vh-12rem)] overflow-hidden rounded-lg bg-white shadow">
          {/* Conversations List */}
          <div className="w-1/3 border-r border-gray-200">
            <div className="p-4">
              <h2 className="text-lg font-medium text-gray-900">Conversations</h2>
            </div>
            <div className="h-[calc(100%-4rem)] overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-gray-500">No conversations yet</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {conversations.map((conversation) => (
                    <li 
                      key={conversation.id}
                      onClick={() => handleSelectConversation(conversation)}
                      className={`cursor-pointer p-4 hover:bg-gray-50 ${
                        selectedConversation?.id === conversation.id ? 'bg-indigo-50' : ''
                      } ${conversation.unreadCount > 0 ? 'bg-indigo-50' : ''}`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="relative flex-shrink-0">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                            {conversation.with.name.charAt(0)}
                          </div>
                          {conversation.with.isOnline && (
                            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white"></span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="truncate text-sm font-medium text-gray-900">{conversation.with.name}</p>
                            <p className="text-xs text-gray-500">{formatTimestamp(conversation.lastMessage.timestamp)}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className={`truncate text-sm ${
                              conversation.unreadCount > 0 ? 'font-semibold text-gray-900' : 'text-gray-500'
                            }`}>
                              {conversation.lastMessage.sentByMe ? 'You: ' : ''}{conversation.lastMessage.text}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex w-2/3 flex-col">
            {selectedConversation ? (
              <>
                {/* Conversation Header */}
                <div className="border-b border-gray-200 p-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                        {selectedConversation.with.name.charAt(0)}
                      </div>
                      {selectedConversation.with.isOnline && (
                        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white"></span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{selectedConversation.with.name}</h3>
                      <p className="text-sm text-gray-500">
                        {selectedConversation.with.isOnline ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div 
                        key={message.id}
                        className={`flex ${message.sentByMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs rounded-lg px-4 py-2 ${
                          message.sentByMe 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-gray-200 text-gray-900'
                        }`}>
                          <p>{message.text}</p>
                          <p className={`mt-1 text-right text-xs ${
                            message.sentByMe ? 'text-indigo-200' : 'text-gray-500'
                          }`}>
                            {formatTimestamp(message.timestamp)}
                            {message.sentByMe && (
                              <span className="ml-1">
                                {message.isRead ? '✓✓' : '✓'}
                              </span>
                            )}
                          </p>
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
              </>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No conversation selected</h3>
                  <p className="mt-1 text-sm text-gray-500">Select a conversation to start messaging.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
