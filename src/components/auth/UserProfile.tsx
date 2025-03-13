// src/components/auth/UserProfile.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function UserProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  if (status === "loading") {
    return <div className="p-4">Loading...</div>;
  }
  
  if (status === "unauthenticated") {
    return (
      <div className="p-4">
        <button
          onClick={() => router.push("/auth/signin")}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Sign In
        </button>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <div className="flex items-center space-x-4">
        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
          <span className="text-indigo-800 font-medium">
            {session?.user?.firstName?.charAt(0) || ""}
            {session?.user?.lastName?.charAt(0) || ""}
          </span>
        </div>
        <div>
          <p className="font-medium">
            {session?.user?.firstName} {session?.user?.lastName}
          </p>
          <p className="text-sm text-gray-500">{session?.user?.role}</p>
        </div>
        <button
          onClick={() => router.push("/auth/signout")}
          className="rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-300"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
