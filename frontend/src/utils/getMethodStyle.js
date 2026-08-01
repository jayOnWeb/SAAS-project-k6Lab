export const getMethodBadgeStyle = (method) => {
  const m = method?.toUpperCase() || "GET";
  switch (m) {
    case "GET":
      return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
    case "POST":
      return "bg-blue-500/10 border-blue-500/30 text-blue-400";
    case "PUT":
      return "bg-amber-500/10 border-amber-500/30 text-amber-400";
    case "PATCH":
      return "bg-purple-500/10 border-purple-500/30 text-purple-400";
    case "DELETE":
      return "bg-red-500/10 border-red-500/30 text-red-400";
    case "HEAD":
    case "OPTIONS":
      return "bg-cyan-500/10 border-cyan-500/30 text-cyan-400";
    default:
      return "bg-zinc-500/10 border-zinc-500/30 text-zinc-400";
  }
};
