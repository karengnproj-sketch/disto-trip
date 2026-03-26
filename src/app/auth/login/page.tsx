"use client";

import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, MapPin, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { sanitizeError, checkRateLimit, isValidEmail } from "@/lib/security";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { user, loading: authLoading } = useAuth();
  const router2 = useRouter();

  // Redirect if already logged in
  if (!authLoading && user) {
    router2.push("/dashboard");
    return null;
  }
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Rate limit check
    const rateCheck = checkRateLimit(`login-${email}`, 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      setMessage({ type: "error", text: `Too many attempts. Try again in ${rateCheck.retryAfterSeconds} seconds.` });
      setLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      setMessage({ type: "error", text: "Please enter a valid email address." });
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setMessage({ type: "error", text: sanitizeError(error) });
      } else {
        setMessage({ type: "success", text: "Logged in! Redirecting..." });
        setTimeout(() => router.push("/dashboard"), 1000);
      }
    } catch (err) {
      setMessage({ type: "error", text: sanitizeError(err) });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-24">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <h1 className="text-4xl font-bold text-white mb-2">LOG IN</h1>
          <p className="text-[#B0B0B0] mb-8">Welcome back! Let&apos;s continue your adventure.</p>

          {message && (
            <div className={`flex items-center gap-2 p-3 rounded-xl mb-4 text-sm ${
              message.type === "success" ? "bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/30" : "bg-red-500/10 text-red-400 border border-red-500/30"
            }`}>
              {message.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-xl text-white placeholder-[#666] focus:outline-none focus:border-[#39FF14] transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-[#2a2a2a] border border-[#333] rounded-xl text-white placeholder-[#666] focus:outline-none focus:border-[#39FF14] transition-colors"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-white transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-[#B0B0B0]">
                <input type="checkbox" className="rounded accent-[#39FF14]" /> Remember me
              </label>
              <Link href="#" className="text-sm text-[#39FF14] hover:underline">Forgot Password?</Link>
            </div>

            <div className="flex gap-3 pt-2">
              <Link
                href="/auth/signup"
                className="flex-1 py-3 text-center border border-[#39FF14] text-[#39FF14] font-semibold rounded-xl hover:bg-[#39FF14] hover:text-black transition-all"
              >
                SIGN UP
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-gradient-to-r from-[#39FF14] to-[#00E676] text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-[#39FF14]/25 transition-all disabled:opacity-50"
              >
                {loading ? "Logging in..." : "LOG IN"}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#333]" />
            <span className="text-[#666] text-sm">or</span>
            <div className="flex-1 h-px bg-[#333]" />
          </div>

          {/* Google Login */}
          <button onClick={handleGoogleLogin} type="button" className="w-full flex items-center justify-center gap-3 py-3 bg-[#1a1a1a] border border-[#333] rounded-xl text-white hover:border-[#39FF14]/50 transition-all">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
        </motion.div>
      </div>

      {/* Right - Image (hidden on mobile) */}
      <div className="hidden lg:block w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1200"
          alt="Egypt"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0a0a0a]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-5xl font-display font-bold text-[#39FF14] mb-4">WELCOME</h2>
            <p className="text-white text-xl">To your adventure!</p>
            <p className="text-[#B0B0B0]">Log in and let&apos;s get started.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
