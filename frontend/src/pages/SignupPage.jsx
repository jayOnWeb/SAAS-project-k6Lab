import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, User, Mail, Lock, Eye, EyeOff, UserPlus } from "lucide-react";
import AuthLayout from "../layouts/AuthLayout";

import ElectricBorder from "../components/ElectricBorder";

import SEO from "../components/SEO";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    const result = await signup(name, email, password);
    setLoading(false);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error || "Failed to create account.");
    }
  };

  return (
    <AuthLayout>
      <SEO 
        title="Create Account — Start Local Load Testing"
        description="Create your free K6 LAB account and start executing local performance tests with real-time telemetry."
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
            <UserPlus className="w-3.5 h-3.5 text-red-400" />
            <span>Instant Workspace Setup</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Create your account
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 leading-relaxed">
            Start running production-grade k6 stress testing sessions
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-950/50 border border-red-500/40 text-red-400 text-xs px-4 py-3 rounded-xl flex items-center gap-2.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 animate-ping" />
            <p className="font-medium leading-snug">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-red-400" />
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Mercer"
              required
              className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all font-sans"
            />
          </div>

          {/* Email field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-red-400" />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
              className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all font-sans"
            />
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-red-400" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
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
            className="w-full mt-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold text-sm rounded-xl py-3.5 px-4 shadow-lg shadow-red-900/30 border border-red-500/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating credentials key...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                Register Workspace
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </button>
        </form>

        {/* Switch Link */}
        <div className="mt-8 text-center text-xs text-zinc-400 border-t border-zinc-800/60 pt-5">
          Already registered?{" "}
          <Link to="/login" className="text-red-400 hover:text-red-300 font-semibold hover:underline transition-colors">
            Access Account
          </Link>
        </div>

        </div>
      </ElectricBorder>
    </AuthLayout>
  );
}
