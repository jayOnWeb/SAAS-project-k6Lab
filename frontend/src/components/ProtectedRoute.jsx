import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black text-white flex-col gap-4 font-sans">
        <div className="w-10 h-10 rounded-full border-2 border-gray-800 border-t-red-500 animate-spin" />
        <p className="text-sm font-medium tracking-wide text-gray-400">Loading stress telemetry session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
