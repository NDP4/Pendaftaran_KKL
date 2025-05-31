"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";

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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4 flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                required
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Loading..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
