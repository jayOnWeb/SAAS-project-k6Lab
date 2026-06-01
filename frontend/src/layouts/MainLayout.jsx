import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";

export default function MainLayout() {
  return (
    <div className="flex h-screen w-screen bg-zinc-950 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar />
      
      {/* Scrollable telemetric panel workspace */}
      <div className="flex-1 overflow-y-auto bg-zinc-950">
        <div className="min-h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}