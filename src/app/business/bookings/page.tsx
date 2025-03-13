// src/app/business/bookings/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserProfile from "@/components/auth/UserProfile";

type Booking = {
  id: number;
  courtId: number;
  courtName: string;
  userId: number;
  userName: string;
  startDateTime: string;
  endDateTime: string;
  totalPrice: number;
  status: string;
  paymentStatus: string;
};

export default function BusinessBookings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Mock data for bookings
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 1,
      courtId: 1,
      courtName: "Court A",
      userId: 3,
      userName: "John Doe",
      startDateTime: "2025-03-14T10:00:00",
      endDateTime: "2025-03-14T11:00:00",
      totalPrice: 15.00,
      status: "confirmed",
      paymentStatus: "paid",
    },
    {
      id: 2,
      courtId: 2,
      courtName: "Court B",
      userId: 4,
      userName: "Jane Smith",
      startDateTime: "2025-03-14T14:00:00",
      endDateTime: "2025-03-14T16:00:00",
      totalPrice: 50.00,
      status: "confirmed",
      paymentStatus: "paid",
    },
    {
      id: 3,
      courtId: 3,
      courtName: "Court C",
      userId: 5,
      userName: "Mike Johnson",
      startDateTime: "2025-03-15T09:00:00",
      endDateTime: "2025-03-15T10:00:00",
      totalPrice: 15.00,
      status: "pending",
      paymentStatus: "pending",
    },
    {
      id: 4,
      courtId: 1,
      courtName: "Court A",
      userId: 6,
      userName: "Sarah Williams",
      startDateTime: "2025-03-16T11:00:00",
      endDateTime: "2025-03-16T13:00:00",
      totalPrice: 30.00,
      status: "confirmed",
      paymentStatus: "paid",
    },
    {
      id: 5,
      courtId: 2,
      courtName: "Court B",
      userId: 7,
      userName: "David Brown",
      startDateTime: "2025-03-17T16:00:00",
      endDateTime: "2025-03-17T18:00:00",
      totalPrice: 50.00,
      status: "cancelled",
      paymentStatus: "refunded",
    },
  ]);

  // Filter state
  const [filter, setFilter] = useState({
    court: "all",
    status: "all",
    paymentStatus: "all",
    dateFrom: "",
    dateTo: "",
  });

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

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleUpdateStatus = (id: number, newStatus: string) => {
    // In a real implementation, this would call an API to update the booking status
    setBookings(prev => prev.map(booking => 
      booking.id === id ? { ...booking, status: newStatus } : booking
    ));
  };

  // Apply filters to bookings
  const filteredBookings = bookings.filter(booking => {
    // Filter by court
    if (filter.court !== "all" && booking.courtName !== filter.court) {
      return false;
    }
    
    // Filter by status
    if (filter.status !== "all" && booking.status !== filter.status) {
      return false;
    }
    
    // Filter by payment status
    if (filter.paymentStatus !== "all" && booking.paymentStatus !== filter.paymentStatus) {
      return false;
    }
    
    // Filter by date range
    if (filter.dateFrom) {
      const bookingDate = new Date(booking.startDateTime);
      const fromDate = new Date(filter.dateFrom);
      if (bookingDate < fromDate) {
        return false;
      }
    }
    
    if (filter.dateTo) {
      const bookingDate = new Date(booking.startDateTime);
      const toDate = new Date(filter.dateTo);
      toDate.setHours(23, 59, 59); // End of the day
      if (bookingDate > toDate) {
        return false;
      }
    }
    
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
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <UserProfile />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl p-4">
        <div className="mb-6 flex justify-start">
          <button
            onClick={() => router.push("/business/dashboard")}
            className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-lg bg-white p-4 shadow">
          <h2 className="mb-4 text-lg font-medium text-gray-900">Filters</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div>
              <label htmlFor="court" className="block text-sm font-medium text-gray-700">
                Court
              </label>
              <select
                id="court"
                name="court"
                value={filter.court}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              >
                <option value="all">All Courts</option>
                <option value="Court A">Court A</option>
                <option value="Court B">Court B</option>
                <option value="Court C">Court C</option>
              </select>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={filter.status}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700">
                Payment Status
              </label>
              <select
                id="paymentStatus"
                name="paymentStatus"
                value={filter.paymentStatus}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              >
                <option value="all">All Payment Statuses</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            <div>
              <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700">
                From Date
              </label>
              <input
                type="date"
                id="dateFrom"
                name="dateFrom"
                value={filter.dateFrom}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700">
                To Date
              </label>
              <input
                type="date"
                id="dateTo"
                name="dateTo"
                value={filter.dateTo}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Court</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    No bookings found matching the filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => {
                  // Calculate duration in hours
                  const start = new Date(booking.startDateTime);
                  const end = new Date(booking.endDateTime);
                  const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                  
                  return (
                    <tr key={booking.id}>
                      <td className="whitespace-nowrap px-6 py-4">{booking.courtName}</td>
                      <td className="whitespace-nowrap px-6 py-4">{booking.userName}</td>
                      <td className="whitespace-nowrap px-6 py-4">{formatDateTime(booking.startDateTime)}</td>
                      <td className="whitespace-nowrap px-6 py-4">{durationHours} hour{durationHours !== 1 ? 's' : ''}</td>
                      <td className="whitespace-nowrap px-6 py-4">${booking.totalPrice.toFixed(2)}</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : booking.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : booking.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          booking.paymentStatus === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : booking.paymentStatus === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.paymentStatus}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex space-x-2">
                          {booking.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                                className="rounded bg-green-100 px-2 py-1 text-xs text-green-800 hover:bg-green-200"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                                className="rounded bg-red-100 px-2 py-1 text-xs text-red-800 hover:bg-red-200"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {booking.status === 'confirmed' && (
                            <button
                              onClick={() => handleUpdateStatus(booking.id, 'completed')}
                              className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800 hover:bg-blue-200"
                            >
                              Mark Completed
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
