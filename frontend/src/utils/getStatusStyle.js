export const getStatusStyle = (status) => {
  if (!status) return "bg-gray-600";

  if (status.includes("Healthy")) {
    return "bg-green-600";
  }

  if (status.includes("Slow")) {
    return "bg-yellow-500 text-black";
  }

  if (status.includes("Unstable")) {
    return "bg-orange-500";
  }

  if (status.includes("Critical")) {
    return "bg-red-600";
  }

  return "bg-gray-600";
};