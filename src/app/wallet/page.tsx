// src/app/wallet/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserProfile from "@/components/auth/UserProfile";

type Transaction = {
  id: number;
  type: 'deposit' | 'withdrawal' | 'payment' | 'refund' | 'transfer';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  relatedEntityId?: number;
  relatedEntityType?: string;
};

export default function WalletPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
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

    // Fetch wallet data
    const fetchWalletData = async () => {
      try {
        // In a real implementation, this would call an API to fetch wallet data
        // For now, we'll use mock data
        
        // Mock balance
        const mockBalance = 150.75;
        setBalance(mockBalance);
        
        // Mock transactions
        const mockTransactions: Transaction[] = [
          {
            id: 1,
            type: 'deposit',
            amount: 100.00,
            description: 'Wallet top-up',
            date: '2025-03-10T14:30:00Z',
            status: 'completed',
          },
          {
            id: 2,
            type: 'payment',
            amount: 25.00,
            description: 'Court A booking - Demo Badminton Club',
            date: '2025-03-12T09:15:00Z',
            status: 'completed',
            relatedEntityId: 12345,
            relatedEntityType: 'booking',
          },
          {
            id: 3,
            type: 'payment',
            amount: 15.00,
            description: 'Friendly Doubles Match - Event Payment',
            date: '2025-03-13T16:45:00Z',
            status: 'completed',
            relatedEntityId: 1,
            relatedEntityType: 'event',
          },
          {
            id: 4,
            type: 'deposit',
            amount: 50.00,
            description: 'Wallet top-up',
            date: '2025-03-15T11:20:00Z',
            status: 'completed',
          },
          {
            id: 5,
            type: 'transfer',
            amount: 7.50,
            description: 'Expense sharing - Competitive Singles Practice',
            date: '2025-03-16T18:30:00Z',
            status: 'completed',
            relatedEntityId: 2,
            relatedEntityType: 'event',
          },
          {
            id: 6,
            type: 'withdrawal',
            amount: 30.00,
            description: 'Withdrawal to bank account',
            date: '2025-03-17T10:00:00Z',
            status: 'pending',
          },
        ];
        
        setTransactions(mockTransactions);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [authStatus, router]);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      setErrorMessage("Please enter a valid amount");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    
    setProcessing(true);
    
    try {
      // In a real implementation, this would call an API to process the deposit
      // For now, we'll just simulate it
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update balance
      setBalance(prevBalance => prevBalance + amount);
      
      // Add transaction
      const newTransaction: Transaction = {
        id: Math.floor(Math.random() * 1000) + 100,
        type: 'deposit',
        amount,
        description: 'Wallet top-up',
        date: new Date().toISOString(),
        status: 'completed',
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      // Reset form and show success message
      setDepositAmount("");
      setSuccessMessage(`Successfully deposited $${amount.toFixed(2)}`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error processing deposit:", error);
      setErrorMessage("Failed to process deposit. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setProcessing(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(withdrawAmount);
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
      // In a real implementation, this would call an API to process the withdrawal
      // For now, we'll just simulate it
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update balance
      setBalance(prevBalance => prevBalance - amount);
      
      // Add transaction
      const newTransaction: Transaction = {
        id: Math.floor(Math.random() * 1000) + 100,
        type: 'withdrawal',
        amount,
        description: 'Withdrawal to bank account',
        date: new Date().toISOString(),
        status: 'pending',
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      // Reset form and show success message
      setWithdrawAmount("");
      setSuccessMessage(`Withdrawal of $${amount.toFixed(2)} initiated. Processing may take 1-2 business days.`);
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      setErrorMessage("Failed to process withdrawal. Please try again.");
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
          <h1 className="text-2xl font-bold text-gray-900">My Wallet</h1>
          <UserProfile />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl p-4">
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Balance Card */}
          <div className="col-span-1 rounded-lg bg-white p-6 shadow lg:col-span-3">
            <h2 className="text-lg font-medium text-gray-900">Current Balance</h2>
            <div className="mt-2 text-3xl font-bold text-indigo-600">${balance.toFixed(2)}</div>
            <p className="mt-1 text-sm text-gray-500">
              Use your wallet balance to pay for court bookings and events.
            </p>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => router.push("/events")}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                View Events
              </button>
              <button
                onClick={() => router.push("/courts")}
                className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                Book a Court
              </button>
            </div>
          </div>

          {/* Deposit Form */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-medium text-gray-900">Deposit Funds</h2>
            <form onSubmit={handleDeposit} className="mt-4">
              <div className="mb-4">
                <label htmlFor="depositAmount" className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    id="depositAmount"
                    min="0.01"
                    step="0.01"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={processing}
                className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {processing ? "Processing..." : "Deposit"}
              </button>
            </form>
          </div>

          {/* Withdraw Form */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-medium text-gray-900">Withdraw Funds</h2>
            <form onSubmit={handleWithdraw} className="mt-4">
              <div className="mb-4">
                <label htmlFor="withdrawAmount" className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    id="withdrawAmount"
                    min="0.01"
                    step="0.01"
                    max={balance}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={processing}
                className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {processing ? "Processing..." : "Withdraw"}
              </button>
            </form>
          </div>

          {/* Quick Actions */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
            <div className="mt-4 space-y-3">
              <button
                onClick={() => router.push("/wallet/transfer")}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Transfer to Friend
              </button>
              <button
                onClick={() => router.push("/wallet/expense-share")}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Share Expenses
              </button>
              <button
                onClick={() => router.push("/wallet/settings")}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Wallet Settings
              </button>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="mt-6 rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-medium text-gray-900">Transaction History</h2>
          {transactions.length === 0 ? (
            <p className="mt-4 text-gray-500">No transactions yet.</p>
          ) : (
            <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          transaction.type === 'deposit' || transaction.type === 'refund'
                            ? 'bg-green-100 text-green-800'
                            : transaction.type === 'withdrawal' || transaction.type === 'payment'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {transaction.description}
                        {transaction.relatedEntityType && (
                          <button
                            onClick={() => router.push(`/${transaction.relatedEntityType}s/${transaction.relatedEntityId}`)}
                            className="ml-2 text-indigo-600 hover:text-indigo-900"
                          >
                            View
                          </button>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        <span className={
                          transaction.type === 'deposit' || transaction.type === 'refund'
                            ? 'text-green-600'
                            : transaction.type === 'withdrawal' || transaction.type === 'payment'
                            ? 'text-red-600'
                            : 'text-blue-600'
                        }>
                          {transaction.type === 'deposit' || transaction.type === 'refund'
                            ? '+'
                            : transaction.type === 'withdrawal' || transaction.type === 'payment'
                            ? '-'
                            : ''}
                          ${transaction.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          transaction.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
