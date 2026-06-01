import { useNavigate } from "react-router-dom";
import useTests from "../hooks/useTests";
import { formatNumber } from "../utils/format";
import { getStatusStyle } from "../utils/getStatusStyle";
import { Activity, Trash2, Calendar, Clock, Inbox } from "lucide-react";

export default function History() {
  const { tests, loading, deleteTest } = useTests();
  const navigate = useNavigate();

  const getMethodBadgeStyle = (method) => {
    switch (method?.toUpperCase()) {
      case "GET":
        return "bg-emerald-950/20 border-emerald-900/40 text-emerald-400";
      case "POST":
        return "bg-amber-950/20 border-amber-900/40 text-amber-400";
      case "PUT":
        return "bg-blue-950/20 border-blue-900/40 text-blue-400";
      case "DELETE":
        return "bg-red-950/20 border-red-900/40 text-red-400";
      default:
        return "bg-zinc-900 border-zinc-800 text-zinc-400";
    }
  };

  if (loading && tests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-zinc-950 text-white gap-4 font-sans">
        <div className="w-8 h-8 rounded-full border-2 border-zinc-900 border-t-red-600 animate-spin" />
        <span className="text-sm text-zinc-500">Loading stress telemetry history...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-4 py-8 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-red-950/40 border border-red-900/30 flex items-center justify-center">
            <Activity className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-none">
              Test History
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Historical ledger of sandbox stress testing diagnostics
            </p>
          </div>

          {/* COUNT PILL */}
          {Array.isArray(tests) && tests.length > 0 && (
            <span className="ml-auto text-xs font-semibold bg-zinc-900 text-zinc-400 border border-zinc-800 px-3.5 py-1 rounded-full">
              {tests.length} {tests.length === 1 ? "run" : "runs"}
            </span>
          )}
        </div>

        {/* TABLE CARD */}
        {Array.isArray(tests) && tests.length > 0 ? (
          <div className="rounded-2xl border border-zinc-900 bg-zinc-900/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">

                {/* HEADER */}
                <thead>
                  <tr className="border-b border-zinc-900 bg-zinc-900/40 text-left">
                    {["Method", "URL", "Avg (ms)", "Fail %", "Status", "Date", "Time", ""].map((col) => (
                      <th
                        key={col}
                        className="px-4 py-3.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* BODY */}
                <tbody className="divide-y divide-zinc-900">
                  {tests.map((test) => {
                    const date = new Date(test.createdAt);

                    return (
                      <tr
                        key={test._id}
                        onClick={() => navigate(`/dashboard/run-test?jobId=${test._id}`)}
                        className="hover:bg-zinc-900/30 transition-all duration-150 cursor-pointer"
                      >
                        {/* METHOD */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold font-mono tracking-wider border ${getMethodBadgeStyle(
                              test.method
                            )}`}
                          >
                            {test.method}
                          </span>
                        </td>

                        {/* URL */}
                        <td className="px-4 py-3.5 max-w-[200px]">
                          <span className="text-xs font-mono text-zinc-300 truncate block" title={test.url}>
                            {test.url}
                          </span>
                        </td>

                        {/* AVG */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="text-sm font-mono font-bold text-white">
                            {formatNumber(test.avgResponseTime)}
                          </span>
                          <span className="text-xs text-zinc-500 ml-1">ms</span>
                        </td>

                        {/* FAILURE RATE */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span
                            className={`text-sm font-mono font-semibold ${
                              test.failureRate > 5
                                ? "text-red-400"
                                : test.failureRate > 0
                                ? "text-amber-400"
                                : "text-emerald-400"
                            }`}
                          >
                            {formatNumber(test.failureRate)}%
                          </span>
                        </td>

                        {/* STATUS */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyle(test.healthStatus).replace("text-black", "text-zinc-900")}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
                            {test.healthStatus}
                          </span>
                        </td>

                        {/* DATE */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="text-xs text-zinc-400 font-medium">
                            {date.toLocaleDateString()}
                          </span>
                        </td>

                        {/* TIME */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="text-xs font-mono text-zinc-500">
                            {date.toLocaleTimeString()}
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td className="px-4 py-3.5 whitespace-nowrap text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteTest(test._id);
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-950/50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="rounded-2xl border border-dashed border-zinc-900 bg-zinc-950 flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 text-zinc-700">
              <Inbox className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-zinc-400">No stress logs recorded</p>
            <p className="text-xs text-zinc-600">Run a telemetry load query to register results here</p>
          </div>
        )}
      </div>
    </div>
  );
}