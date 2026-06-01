const getHealthStatus = (metrics) => {
  const { avgResponseTime, failureRate } = metrics;

  if (failureRate > 50 || avgResponseTime > 2000) {
    return "Critical 🔴";
  }

  if (failureRate > 10) {
    return "Unstable ⚠️";
  }

  if (avgResponseTime > 1000) {
    return "Slow 🟡";
  }

  return "Healthy 🟢";
};

module.exports = {
  getHealthStatus
};