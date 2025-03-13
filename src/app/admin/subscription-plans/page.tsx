// src/app/admin/subscription-plans/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserProfile from "@/components/auth/UserProfile";

type SubscriptionPlan = {
  id: number;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  maxCourts: number;
  isActive: boolean;
};

export default function SubscriptionPlansPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

    // Fetch subscription plans
    const fetchSubscriptionPlans = async () => {
      try {
        // In a real implementation, this would call an API to fetch subscription plans
        // For now, we'll use mock data
        const mockSubscriptionPlans: SubscriptionPlan[] = [
          {
            id: 1,
            name: "Basic",
            price: 29.99,
            billingCycle: "monthly",
            features: [
              "Up to 2 courts",
              "Basic booking system",
              "Email support",
              "Standard reports"
            ],
            maxCourts: 2,
            isActive: true,
          },
          {
            id: 2,
            name: "Standard",
            price: 49.99,
            billingCycle: "monthly",
            features: [
              "Up to 5 courts",
              "Advanced booking system",
              "Email and phone support",
              "Advanced reports",
              "Custom branding"
            ],
            maxCourts: 5,
            isActive: true,
          },
          {
            id: 3,
            name: "Premium",
            price: 99.99,
            billingCycle: "monthly",
            features: [
              "Unlimited courts",
              "Premium booking system",
              "24/7 priority support",
              "Advanced analytics",
              "Custom branding",
              "API access",
              "Dedicated account manager"
            ],
            maxCourts: 999,
            isActive: true,
          },
          {
            id: 4,
            name: "Enterprise",
            price: 199.99,
            billingCycle: "monthly",
            features: [
              "Unlimited courts",
              "Enterprise booking system",
              "24/7 priority support",
              "Advanced analytics",
              "Custom branding",
              "API access",
              "Dedicated account manager",
              "Custom development",
              "SLA guarantees"
            ],
            maxCourts: 999,
            isActive: false,
          },
        ];
        
        setPlans(mockSubscriptionPlans);
      } catch (error) {
        console.error("Error fetching subscription plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionPlans();
  }, [authStatus, router, session]);

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan({ ...plan });
  };

  const handleCancelEdit = () => {
    setEditingPlan(null);
  };

  const handleUpdatePlan = () => {
    if (!editingPlan) return;
    
    // In a real implementation, this would call an API to update the plan
    // For now, we'll just update the local state
    setPlans(prev => prev.map(plan => 
      plan.id === editingPlan.id ? editingPlan : plan
    ));
    
    setSuccessMessage(`Plan "${editingPlan.name}" updated successfully!`);
    setTimeout(() => setSuccessMessage(""), 3000);
    
    setEditingPlan(null);
  };

  const handleToggleActive = (planId: number) => {
    // In a real implementation, this would call an API to toggle the plan status
    // For now, we'll just update the local state
    setPlans(prev => prev.map(plan => 
      plan.id === planId ? { ...plan, isActive: !plan.isActive } : plan
    ));
    
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      setSuccessMessage(`Plan "${plan.name}" ${plan.isActive ? 'deactivated' : 'activated'} successfully!`);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleAddFeature = () => {
    if (!editingPlan) return;
    
    setEditingPlan({
      ...editingPlan,
      features: [...editingPlan.features, ""]
    });
  };

  const handleRemoveFeature = (index: number) => {
    if (!editingPlan) return;
    
    setEditingPlan({
      ...editingPlan,
      features: editingPlan.features.filter((_, i) => i !== index)
    });
  };

  const handleFeatureChange = (index: number, value: string) => {
    if (!editingPlan) return;
    
    const updatedFeatures = [...editingPlan.features];
    updatedFeatures[index] = value;
    
    setEditingPlan({
      ...editingPlan,
      features: updatedFeatures
    });
  };

  const handleEditingPlanChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingPlan) return;
    
    const { name, value, type } = e.target;
    
    setEditingPlan({
      ...editingPlan,
      [name]: type === 'number' ? parseFloat(value) : value
    });
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
          <h1 className="text-2xl font-bold text-gray-900">Subscription Plans</h1>
          <UserProfile />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl p-4">
        <div className="mb-6 flex justify-start">
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
          >
            Back to Dashboard
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

        {/* Subscription Plans */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Manage Subscription Plans</h2>
            <button
              onClick={() => router.push("/admin/subscription-plans/create")}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Add New Plan
            </button>
          </div>
          
          <div className="space-y-6">
            {plans.map((plan) => (
              <div key={plan.id} className={`rounded-lg border p-6 ${!plan.isActive ? 'bg-gray-50' : ''}`}>
                {editingPlan && editingPlan.id === plan.id ? (
                  // Edit Mode
                  <div>
                    <div className="mb-4 grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Plan Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={editingPlan.name}
                          onChange={handleEditingPlanChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                          Price
                        </label>
                        <div className="relative mt-1 rounded-md shadow-sm">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500">$</span>
                          </div>
                          <input
                            type="number"
                            id="price"
                            name="price"
                            min="0"
                            step="0.01"
                            value={editingPlan.price}
                            onChange={handleEditingPlanChange}
                            className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-1">
                        <label htmlFor="billingCycle" className="block text-sm font-medium text-gray-700">
                          Billing Cycle
                        </label>
                        <select
                          id="billingCycle"
                          name="billingCycle"
                          value={editingPlan.billingCycle}
                          onChange={handleEditingPlanChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        >
                          <option value="monthly">Monthly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="maxCourts" className="block text-sm font-medium text-gray-700">
                          Maximum Courts
                        </label>
                        <input
                          type="number"
                          id="maxCourts"
                          name="maxCourts"
                          min="1"
                          value={editingPlan.maxCourts}
                          onChange={handleEditingPlanChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        />
                        <p className="mt-1 text-xs text-gray-500">Enter 999 for unlimited</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Features
                      </label>
                      <div className="mt-2 space-y-2">
                        {editingPlan.features.map((feature, index) => (
                          <div key={index} className="flex items-center">
                            <input
                              type="text"
                              value={feature}
                              onChange={(e) => handleFeatureChange(index, e.target.value)}
                              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveFeature(index)}
                              className="ml-2 rounded-md bg-red-100 p-2 text-red-600 hover:bg-red-200"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={handleAddFeature}
                          className="inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200"
                        >
                          <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Add Feature
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleUpdatePlan}
                        className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
                        <p className="text-sm text-gray-500">${plan.price}/{plan.billingCycle === 'monthly' ? 'mo' : 'yr'}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          plan.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {plan.isActive ? "Active" : "Inactive"}
                        </span>
                        <button
                          onClick={() => handleEditPlan(plan)}
                          className="rounded-md bg-indigo-100 p-2 text-indigo-600 hover:bg-indigo-200"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleToggleActive(plan.id)}
                          className={`rounded-md p-2 ${
                            plan.isActive
                              ? "bg-red-100 text-red-600 hover:bg-red-200"
                              : "bg-green-100 text-green-600 hover:bg-green-200"
                          }`}
                        >
                          {plan.isActive ? (
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Maximum Courts</h4>
                        <p className="text-base text-gray-900">
                          {plan.maxCourts === 999 ? "Unlimited" : plan.maxCourts}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-500">Features</h4>
                      <ul className="mt-2 space-y-1">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <svg className="mr-1.5 h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
