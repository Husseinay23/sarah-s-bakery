"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/admin/components/AuthProvider";
import { FlavorEditor } from "@/admin/components/FlavorEditor";
import { TierEditor } from "@/admin/components/TierEditor";
import { SettingsEditor } from "@/admin/components/SettingsEditor";
import { OrderLogPanel } from "@/admin/components/OrderLogPanel";

type Tab = "flavors" | "tiers" | "settings" | "orders";

const tabs: { id: Tab; label: string }[] = [
  { id: "flavors", label: "Flavors" },
  { id: "tiers", label: "Package prices" },
  { id: "settings", label: "Settings & Mini Box" },
  { id: "orders", label: "Orders" },
];

export default function AdminDashboardPage() {
  const { user, loading, isAdmin, logout } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("flavors");

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.replace("/admin");
    }
  }, [user, loading, isAdmin, router]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-espresso/60">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-espresso">Dashboard</h1>
          <p className="text-sm text-espresso/60">Signed in as {user.email}</p>
        </div>
        <button
          type="button"
          onClick={() => logout().then(() => router.push("/admin"))}
          className="rounded-full border border-cinnamon/30 px-4 py-2 text-sm font-medium"
        >
          Sign out
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-cinnamon/20 pb-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              tab === t.id
                ? "bg-espresso text-white"
                : "bg-white text-espresso hover:bg-blush/50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "flavors" && <FlavorEditor />}
      {tab === "tiers" && <TierEditor />}
      {tab === "settings" && <SettingsEditor />}
      {tab === "orders" && <OrderLogPanel />}
    </div>
  );
}
