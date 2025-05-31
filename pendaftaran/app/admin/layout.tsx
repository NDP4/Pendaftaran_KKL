"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Cookies from "js-cookie";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    // Clear session data
    localStorage.removeItem("adminSession");
    Cookies.remove("adminSession");
    router.push("/admin/login");
  };

  const isLoginPage = pathname === "/admin/login";

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar - hidden on login page */}
      {!isLoginPage && (
        <nav className="bg-card border-b">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/admin/dashboard">
                  <span className="text-lg font-bold">Admin Panel</span>
                </Link>
              </div>

              {/* Desktop menu */}
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/admin/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Link href="/admin/data">
                  <Button variant="ghost">Data</Button>
                </Link>
                <Button onClick={handleLogout} variant="destructive">
                  Logout
                </Button>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X /> : <Menu />}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t">
              <div className="container mx-auto px-4 py-2 space-y-2">
                <Link href="/admin/dashboard" className="block">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Button>
                </Link>
                <Link href="/admin/data" className="block">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Data
                  </Button>
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full"
                >
                  Logout
                </Button>
              </div>
            </div>
          )}
        </nav>
      )}

      {/* Main content */}
      <main>{children}</main>
    </div>
  );
}
