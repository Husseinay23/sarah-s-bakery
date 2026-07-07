import type { Metadata } from "next";
import { AuthProvider } from "@/admin/components/AuthProvider";

export const metadata: Metadata = {
  title: "Admin | Sarah's Bakery",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-cream">{children}</div>
    </AuthProvider>
  );
}
