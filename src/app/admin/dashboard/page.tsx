// src/app/admin/dashboard/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserProfile from "@/components/auth/UserProfile";

type Tenant = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  subscriptionPlan: string;
  status: 'active' | 'pending' | 'suspended';
  createdAt: string;
  totalCourts: number;
  totalBookings: number;
};

export default function AdminDashboard() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [stats, setStats] = useState({
    totalTenants: 0,
    activeTenants: 0,
    totalCourts: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (authStatus === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (authStatus === "loading") {
      return;
    }

    // Check if user is an admin
    const userRole = session?.user?.role;
    if (userRole !== "admin") {
      router.push("/dashboard");
      return;
    }

    // Fetch admin dashboard data
    const fetchDashboardData = async () => {
      try {
        // In a real implementation, this would call APIs to fetch dashboard data
        // For now, we'll use mock data
        
        // Mock tenants
        const mockTenants: Tenant[] = [
          {
            id: 1,
            name: "Demo Badminton Club",
            email: "contact@demobadminton.com",
            phone: "555-123-4567",
            address: "123 Main St, Anytown, AN 12345",
            subscriptionPlan: "Premium",
            status: "active",
            createdAt: "2025-01-15T10:00:00Z",
            totalCourts: 3,
            totalBookings: 125,
          },
          {
            id: 2,
            name: "City Sports Center",
            email: "info@citysports.com",
            phone: "555-987-6543",
            address: "456 Oak Ave, Metropolis, MP 67890",
            subscriptionPlan: "Standard",
            status: "active",
            createdAt: "2025-02-10T14:30:00Z",
            totalCourts: 5,
            totalBookings: 210,
          },
          {
            id: 3,
            name: "University Badminton Club",
            email: "sports@university.edu",
            phone: "555-456-7890",
            address: "789 Campus Dr, College Town, CT 54321",
            subscriptionPlan: "Basic",
            status: "active",
            createdAt: "2025-02-25T09:15:00Z",
            totalCourts: 2,
            totalBookings: 78,
          },
          {
            id: 4,
            name: "Elite Racquet Club",
            email: "membership@eliteracquet.com",
            phone: "555-789-0123",
            address: "101 Elite Way, Luxville, LX 98765",
            subscriptionPlan: "Premium",
            status: "pending",
            createdAt: "2025-03-05T16:45:00Z",
            totalCourts: 4,
            totalBookings: 0,
          },
          {
            id: 5,
            name: "Community Sports Hall",
            email: "community@sportshall.org",
            phone: "555-321-6540",
            address: "202 Community Blvd, Townsville, TS 13579",
            subscriptionPlan: "Standard",
            status: "suspended",
            createdAt: "2025-01-20T11:30:00Z",
            totalCourts: 2,
            totalBookings: 45,
          },
        ];
        
        setTenants(mockTenants);
        
        // Calculate stats
        const activeTenants = mockTenants.filter(t => t.status === "active").length;
        const totalCourts = mockTenants.reduce((sum, t) => sum + t.totalCourts, 0);
        const totalBookings = mockTenants.reduce((sum, t) => sum + t.totalBookings, 0);
        
        setStats({
          totalTenants: mockTenants.length,
          activeTenants,
          totalCourts,
          totalBookings,
          totalRevenue: 12450.75, // Mock revenue
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [authStatus, router, session]);

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
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <UserProfile />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl p-4">
        {/* Stats Overview */}
        <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <div className="overflow-hidden rounded-lg bg-white p-6 shadow">
            <div className="text-sm font-medium text-gray-500">Total Tenants</div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalTenants}</div>
          </div>
          <div className="overflow-hidden rounded-lg bg-white p-6 shadow">
            <div className="text-sm font-medium text-gray-500">Active Tenants</div>
            <div className="mt-2 text-3xl font-semibold text-green-600">{stats.activeTenants}</div>
          </div>
          <div className="overflow-hidden rounded-lg bg-white p-6 shadow">
            <div className="text-sm font-medium text-gray-500">Total Courts</div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalCourts}</div>
          </div>
          <div className="overflow-hidden rounded-lg bg-white p-6 shadow">
            <div className="text-sm font-medium text-gray-500">Total Bookings</div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalBookings}</div>
          </div>
          <div className="overflow-hidden rounded-lg bg-white p-6 shadow">
            <div className="text-sm font-medium text-gray-500">Total Revenue</div>
            <div className="mt-2 text-3xl font-semibold text-indigo-600">${stats.totalRevenue.toFixed(2)}</div>
          </div>
        </div>

        {/* Tenants Management */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Tenant Management</h2>
            <button
              onClick={() => router.push("/admin/tenants/create")}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Add New Tenant
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Tenant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Subscription
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Courts
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Bookings
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {tenants.map((tenant) => (
                  <tr key={tenant.id}>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
                          <div className="text-sm text-gray-500">{tenant.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-900">{tenant.subscriptionPlan}</div>
                      <div className="text-sm text-gray-500">
                        Since {new Date(tenant.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {tenant.totalCourts}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {tenant.totalBookings}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        tenant.status === "active"
                          ? "bg-green-100 text-green-800"
                          : tenant.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button
                        onClick={() => router.push(`/admin/tenants/${tenant.id}`)}
                        className="mr-2 text-indigo-600 hover:text-indigo-900"
                      >
                        View
                      </button>
                      <button
                        onClick={() => router.push(`/admin/tenants/${tenant.id}/edit`)}
                        className="mr-2 text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      {tenant.status !== "suspended" ? (
                        <button className="text-red-600 hover:text-red-900">
                          Suspend
                        </button>
                      ) : (
                        <button className="text-green-600 hover:text-green-900">
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-medium text-gray-900">Subscription Plans</h3>
            <p className="mt-2 text-sm text-gray-500">
              Manage subscription plans and pricing for tenants.
            </p>
            <button
              onClick={() => router.push("/admin/subscription-plans")}
              className="mt-4 inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200"
            >
              Manage Plans
            </button>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-medium text-gray-900">System Settings</h3>
            <p className="mt-2 text-sm text-gray-500">
              Configure global settings and preferences for the platform.
            </p>
            <button
              onClick={() => router.push("/admin/settings")}
              className="mt-4 inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200"
            >
              System Settings
            </button>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-medium text-gray-900">User Management</h3>
            <p className="mt-2 text-sm text-gray-500">
              Manage administrators and system users.
            </p>
            <button
              onClick={() => router.push("/admin/users")}
              className="mt-4 inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200"
            >
              Manage Users
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
