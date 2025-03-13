// src/app/wallet/transfer/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserProfile from "@/components/auth/UserProfile";

type User = {
  id: number;
  name: string;
  email: string;
};

export default function TransferFundsPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [transferAmount, setTransferAmount] = useState("");
  const [note, setNote] = useState("");
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

    // Fetch wallet balance
    const fetchWalletData = async () => {
      try {
        // In a real implementation, this would call an API to fetch wallet data
        // For now, we'll use mock data
        const mockBalance = 150.75;
        setBalance(mockBalance);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [authStatus, router]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      // In a real implementation, this would call an API to search for users
      // For now, we'll use mock data
      const mockUsers: User[] = [
        { id: 3, name: "Jane Smith", email: "jane@example.com" },
        { id: 4, name: "Mike Johnson", email: "mike@example.com" },
        { id: 5, name: "Sarah Williams", email: "sarah@example.com" },
        { id: 6, name: "David Brown", email: "david@example.com" },
        { id: 7, name: "Emily Davis", email: "emily@example.com" },
      ];

      // Filter users based on search term
      const filteredUsers = mockUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setSearchResults(filteredUsers);
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults([]);
    }
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setSearchResults([]);
    setSearchTerm("");
  };

  const handleClearSelection = () => {
    setSelectedUser(null);
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser) {
      setErrorMessage("Please select a recipient");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    
    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      setErrorMessage("Please enter a valid amount");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    
    if (amount > balance) {
      setErrorMessage("Insufficient balance");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    
    setProcessing(true);
    
    try {
      // In a real implementation, this would call an API to process the transfer
      // For now, we'll just simulate it
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update balance
      setBalance(prevBalance => prevBalance - amount);
      
      // Reset form and show success message
      setTransferAmount("");
      setNote("");
      setSelectedUser(null);
      setSuccessMessage(`Successfully transferred $${amount.toFixed(2)} to ${selectedUser.name}`);
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("Error processing transfer:", error);
      setErrorMessage("Failed to process transfer. Please try again.");
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
          <h1 className="text-2xl font-bold text-gray-900">Transfer Funds</h1>
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

        {/* Balance Card */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-medium text-gray-900">Available Balance</h2>
          <div className="mt-2 text-3xl font-bold text-indigo-600">${balance.toFixed(2)}</div>
        </div>

        {/* Transfer Form */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-medium text-gray-900">Transfer Details</h2>
          
          {/* Recipient Selection */}
          {!selectedUser ? (
            <div className="mt-4">
              <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700">
                Search for a recipient (by name or email)
              </label>
              <div className="mt-1 flex space-x-2">
                <input
                  type="text"
                  id="searchTerm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Search by name or email"
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  Search
                </button>
              </div>
              
              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-2 rounded-md border border-gray-200">
                  <ul className="divide-y divide-gray-200">
                    {searchResults.map(user => (
                      <li 
                        key={user.id}
                        className="cursor-pointer p-3 hover:bg-gray-50"
                        onClick={() => handleSelectUser(user)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                          <button className="rounded-md bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700">
                            Select
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {searchTerm && searchResults.length === 0 && (
                <p className="mt-2 text-sm text-gray-500">No users found. Try a different search term.</p>
              )}
            </div>
          ) : (
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Recipient</p>
                  <p className="text-base font-medium text-gray-900">{selectedUser.name}</p>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
                >
                  Change
                </button>
              </div>
            </div>
          )}
          
          {/* Transfer Form */}
          <form onSubmit={handleTransfer} className="mt-6">
            <div className="mb-4">
              <label htmlFor="transferAmount" className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  id="transferAmount"
                  min="0.01"
                  step="0.01"
                  max={balance}
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                Note (optional)
              </label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="What's this for?"
              />
            </div>
            
            <button
              type="submit"
              disabled={processing || !selectedUser}
              className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {processing ? "Processing..." : "Transfer Funds"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
