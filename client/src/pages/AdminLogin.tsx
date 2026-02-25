import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Scale, Lock, User, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const loginMutation = trpc.adminAuth.login.useMutation({
    onSuccess: () => {
      // Use hard redirect so the admin page gets a fresh page load with the new cookie
      window.location.href = "/admin";
    },
    onError: (err) => {
      setError(err.message || "Invalid username or password");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      return;
    }
    loginMutation.mutate({ username: username.trim(), password });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "oklch(0.12 0.05 250)" }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, oklch(0.72 0.12 75) 0%, transparent 50%),
                            radial-gradient(circle at 75% 75%, oklch(0.72 0.12 75) 0%, transparent 50%)`,
        }}
      />

      <div className="relative w-full max-w-md px-6">
        {/* Logo */}
        <div className="text-center mb-10">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "oklch(0.72 0.12 75)" }}
          >
            <Scale size={24} style={{ color: "oklch(0.12 0.05 250)" }} />
          </div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "white", fontFamily: "'Playfair Display', serif" }}
          >
            Admin Panel
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "oklch(0.975 0.008 80 / 0.5)", fontFamily: "'DM Sans', sans-serif" }}
          >
            Compare the Conveyancing Market
          </p>
        </div>

        {/* Login card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "oklch(0.18 0.06 250)",
            border: "1px solid oklch(0.72 0.12 75 / 0.2)",
            boxShadow: "0 25px 50px oklch(0.08 0.04 250 / 0.5)",
          }}
        >
          <h2
            className="text-lg font-semibold mb-6"
            style={{ color: "white", fontFamily: "'DM Sans', sans-serif" }}
          >
            Sign in to continue
          </h2>

          {error && (
            <div
              className="flex items-center gap-2 p-3 rounded-lg mb-5 text-sm"
              style={{
                background: "oklch(0.35 0.15 25 / 0.2)",
                border: "1px solid oklch(0.55 0.18 25 / 0.4)",
                color: "oklch(0.75 0.12 25)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <AlertCircle size={15} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label
                htmlFor="username"
                className="text-sm font-medium mb-1.5 block"
                style={{ color: "oklch(0.975 0.008 80 / 0.7)", fontFamily: "'DM Sans', sans-serif" }}
              >
                Username
              </Label>
              <div className="relative">
                <User
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "oklch(0.975 0.008 80 / 0.4)" }}
                />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  autoComplete="username"
                  className="pl-9"
                  style={{
                    background: "oklch(0.12 0.05 250)",
                    border: "1px solid oklch(0.975 0.008 80 / 0.15)",
                    color: "white",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="password"
                className="text-sm font-medium mb-1.5 block"
                style={{ color: "oklch(0.975 0.008 80 / 0.7)", fontFamily: "'DM Sans', sans-serif" }}
              >
                Password
              </Label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "oklch(0.975 0.008 80 / 0.4)" }}
                />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="pl-9 pr-10"
                  style={{
                    background: "oklch(0.12 0.05 250)",
                    border: "1px solid oklch(0.975 0.008 80 / 0.15)",
                    color: "white",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "oklch(0.975 0.008 80 / 0.4)", background: "none", border: "none", cursor: "pointer" }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full font-semibold py-2.5"
              style={{
                background: "oklch(0.72 0.12 75)",
                color: "oklch(0.12 0.05 250)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {loginMutation.isPending ? "Signing in…" : "Sign In"}
            </Button>
          </form>
        </div>

        <p
          className="text-center text-xs mt-6"
          style={{ color: "oklch(0.975 0.008 80 / 0.25)", fontFamily: "'DM Sans', sans-serif" }}
        >
          Authorised personnel only. All access is logged.
        </p>
      </div>
    </div>
  );
}
