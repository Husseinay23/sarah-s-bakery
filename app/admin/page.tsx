"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminLoginForm } from "@/admin/components/AdminLoginForm";
import { useAuth } from "@/admin/components/AuthProvider";

export default function AdminLoginPage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && isAdmin) {
      router.replace("/admin/dashboard");
    }
  }, [user, loading, isAdmin, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-espresso/60">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-cinnamon/20 bg-white p-8 shadow-sm">
        <h1 className="font-display text-3xl font-semibold text-espresso">Admin</h1>
        <p className="mt-2 text-sm text-espresso/70">Sign in to manage Sarah&apos;s Bakery.</p>
        <div className="mt-8">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
