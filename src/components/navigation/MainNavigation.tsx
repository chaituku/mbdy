// src/components/navigation/MainNavigation.tsx
"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function MainNavigation() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!session) {
    return null;
  }

  const userRole = session.user?.role || "user";

  const navigation = {
    common: [
      { name: "Dashboard", href: "/dashboard", roles: ["user", "business", "organizer", "admin"] },
      { name: "Courts", href: "/courts", roles: ["user", "organizer"] },
      { name: "Bookings", href: "/bookings", roles: ["user", "organizer"] },
      { name: "Events", href: "/events", roles: ["user", "organizer"] },
      { name: "Messages", href: "/messages", roles: ["user", "business", "organizer", "admin"] },
      { name: "Wallet", href: "/wallet", roles: ["user", "organizer"] },
      { name: "Profile", href: "/profile", roles: ["user", "business", "organizer", "admin"] },
    ],
    business: [
      { name: "Business Dashboard", href: "/business/dashboard", roles: ["business"] },
      { name: "Courts", href: "/business/courts/manage", roles: ["business"] },
      { name: "Schedule", href: "/business/schedule", roles: ["business"] },
      { name: "Bookings", href: "/business/bookings", roles: ["business"] },
      { name: "Settings", href: "/business/settings", roles: ["business"] },
    ],
    admin: [
      { name: "Admin Dashboard", href: "/admin/dashboard", roles: ["admin"] },
      { name: "Tenants", href: "/admin/tenants", roles: ["admin"] },
      { name: "Subscription Plans", href: "/admin/subscription-plans", roles: ["admin"] },
      { name: "System Settings", href: "/admin/settings", roles: ["admin"] },
    ],
  };

  // Filter navigation items based on user role
  const filteredNavigation = [
    ...navigation.common.filter(item => item.roles.includes(userRole)),
    ...navigation.business.filter(item => item.roles.includes(userRole)),
    ...navigation.admin.filter(item => item.roles.includes(userRole)),
  ];

  return (
    <nav className="bg-indigo-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/dashboard" className="text-xl font-bold text-white">
                Badminton Scheduler
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {filteredNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`rounded-md px-3 py-2 text-sm font-medium ${
                      pathname === item.href
                        ? "bg-indigo-700 text-white"
                        : "text-indigo-200 hover:bg-indigo-500 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 p-2 text-indigo-200 hover:bg-indigo-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block rounded-md px-3 py-2 text-base font-medium ${
                  pathname === item.href
                    ? "bg-indigo-700 text-white"
                    : "text-indigo-200 hover:bg-indigo-500 hover:text-white"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
