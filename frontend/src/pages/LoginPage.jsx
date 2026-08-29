import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import AuthLayout from "../layouts/AuthLayout";

import ElectricBorder from "../components/ElectricBorder";

import SEO from "../components/SEO";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message || "Failed to log in. Please check credentials.");
    }
  };

  return (
    <AuthLayout>
      <SEO 
        title="Sign In — Access Your Load Testing Workstation"
        description="Sign in to your K6 LAB account to connect your local agents, manage projects, and view live telemetry."
      />
      <ElectricBorder
        color="#ef4444"
        speed={1}
        chaos={0.12}
        thickness={2}
        style={{ borderRadius: 28 }}
      >
        {/* Form Glass Card Container */}
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/80 p-8 sm:p-10 rounded-[28px] shadow-2xl relative">
        
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/60 border border-zinc-700/50 text-zinc-300 text-xs font-mono mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
            <span>Secure Authentication</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 leading-relaxed">
            Enter your credentials to access your telemetry workspace
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-950/50 border border-red-500/40 text-red-400 text-xs px-4 py-3 rounded-xl flex items-center gap-2.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 animate-ping" />
            <p className="font-medium leading-snug">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email field */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-red-400" />
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all font-sans"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-red-400" />
                Password
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl pl-4 pr-11 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold text-sm rounded-xl py-3.5 px-4 shadow-lg shadow-red-900/30 border border-red-500/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Authenticating session...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                Access Account
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </button>
        </form>

        {/* Switch Link */}
        <div className="mt-8 text-center text-xs text-zinc-400 border-t border-zinc-800/60 pt-5">
          New to k6lab?{" "}
          <Link to="/signup" className="text-red-400 hover:text-red-300 font-semibold hover:underline transition-colors">
            Create an account
          </Link>
        </div>

        </div>
      </ElectricBorder>
    </AuthLayout>
  );
}
