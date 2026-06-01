export const formatNumber = (num) => {
  if (num === null || num === undefined) return "-";
  return Number(num).toFixed(2);
};