"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { FiLock } from "react-icons/fi";

export default function AdminLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // First verify that username exists
      const { data: admin, error: adminError } = await supabase
        .from("admin")
        .select("*")
        .eq("username", formData.username)
        .single();

      if (adminError || !admin) {
        throw new Error("Invalid credentials");
      }

      // Check password with pgcrypto
      const { data: verified, error: verifyError } = await supabase.rpc(
        "verify_admin_password",
        {
          username_input: formData.username,
          password_input: formData.password,
        }
      );

      if (verifyError || !verified) {
        throw new Error("Invalid credentials");
      }

      // Set session in both localStorage and cookie for middleware
      const session = {
        isLoggedIn: true,
        username: admin.username,
      };

      localStorage.setItem("adminSession", JSON.stringify(session));
      Cookies.set("adminSession", JSON.stringify(session));

      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError("Username atau password salah");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 rounded-2xl">
          <CardHeader className="flex flex-col items-center gap-2 pt-8 pb-2">
            <div className="bg-blue-100 rounded-full p-3 mb-2">
              <FiLock className="text-blue-600 w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold text-blue-700">
              Admin Login
            </CardTitle>
            <p className="text-gray-500 text-sm text-center max-w-xs mt-1">
              Masuk ke dashboard admin KKL UDINUS. Hanya untuk panitia yang
              berwenang.
            </p>
          </CardHeader>
          <CardContent className="pt-2 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  required
                  autoFocus
                  autoComplete="username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
                  placeholder="Masukkan username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
                  placeholder="Masukkan password"
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm text-center animate-pulse">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2 transition"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Loading...
                  </span>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
            <div className="mt-6 text-xs text-gray-400 text-center">
              &copy; {new Date().getFullYear()} KKL D3-Teknik Informatika UDINUS
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
