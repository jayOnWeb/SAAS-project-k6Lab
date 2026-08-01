import { useNavigate } from "react-router-dom";
import useTests from "../hooks/useTests";
import { formatNumber } from "../utils/format";
import { getStatusStyle } from "../utils/getStatusStyle";
import { getMethodBadgeStyle } from "../utils/getMethodStyle";
import { Activity, Trash2, Calendar, Clock, Inbox } from "lucide-react";
import AnimatedList from "../components/AnimatedList";

export default function History() {
  const { tests, loading, deleteTest } = useTests();
  const navigate = useNavigate();

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

        {/* ANIMATED TEST HISTORY LIST */}
        {Array.isArray(tests) && tests.length > 0 ? (
          <AnimatedList
            items={tests}
            showGradients
            enableArrowNavigation
            displayScrollbar
            maxHeight="620px"
            onItemSelect={(test) => navigate(`/dashboard/run-test?jobId=${test._id}`)}
            renderItem={(test) => {
              const date = new Date(test.createdAt || Date.now());
              return (
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold font-mono tracking-wider border shrink-0 ${getMethodBadgeStyle(test.method)}`}>
                      {test.method}
                    </span>
                    <div className="min-w-0">
                      <span className="text-xs font-mono text-white font-bold truncate block" title={test.url}>
                        {test.url}
                      </span>
                      <span className="text-[11px] text-zinc-500 font-mono">
                        {date.toLocaleDateString()} at {date.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0 font-mono text-xs self-end md:self-auto">
                    <div className="text-right">
                      <span className="text-[10px] text-zinc-500 block">AVG</span>
                      <span className="text-sm font-bold text-white">{formatNumber(test.avgResponseTime)} ms</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-zinc-500 block">FAIL RATE</span>
                      <span className={`text-sm font-semibold ${test.failureRate > 5 ? "text-red-400" : test.failureRate > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                        {formatNumber(test.failureRate)}%
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-zinc-500 block">STATUS</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyle(test.healthStatus).replace("text-black", "text-zinc-900")}`}>
                        {test.healthStatus}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTest(test._id);
                      }}
                      className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-950/50 rounded-lg transition-colors cursor-pointer ml-2"
                      title="Delete Test Run"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            }}
          />
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