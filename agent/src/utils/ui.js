// Terminal UI and formatting utility for K6 Lab Agent

const ESC = "\x1b[";
export const colors = {
  reset: `${ESC}0m`,
  bold: `${ESC}1m`,
  dim: `${ESC}2m`,
  italic: `${ESC}3m`,
  underline: `${ESC}4m`,
  
  // Foreground colors
  black: `${ESC}30m`,
  red: `${ESC}31m`,
  green: `${ESC}32m`,
  yellow: `${ESC}33m`,
  blue: `${ESC}34m`,
  magenta: `${ESC}35m`,
  cyan: `${ESC}36m`,
  white: `${ESC}37m`,
  brightCyan: `${ESC}96m`,
  brightGreen: `${ESC}92m`,
  brightYellow: `${ESC}93m`,
  brightMagenta: `${ESC}95m`,
  brightWhite: `${ESC}97m`,
  gray: `${ESC}90m`,
  
  // Background colors
  bgBlue: `${ESC}44m${ESC}37m`,
  bgCyan: `${ESC}46m${ESC}30m`,
  bgGreen: `${ESC}42m${ESC}30m`,
  bgRed: `${ESC}41m${ESC}37m`,
  bgMagenta: `${ESC}45m${ESC}37m`,
  bgYellow: `${ESC}43m${ESC}30m`,
  bgGray: `${ESC}100m${ESC}37m`
};

export const symbols = {
  check: "✔",
  cross: "✖",
  info: "ℹ",
  warning: "⚠",
  lightning: "⚡",
  pulse: "🟢",
  idle: "🟡",
  stop: "🔴",
  chart: "📊",
  clock: "⏱",
  rocket: "🚀",
  gear: "⚙",
  network: "📡",
  boxTL: "┌",
  boxTR: "┐",
  boxBL: "└",
  boxBR: "┘",
  boxH: "─",
  boxV: "│",
  boxT: "┬",
  boxB: "┴",
  boxL: "├",
  boxR: "┤",
  boxX: "┼"
};

export function badge(text, type = "info") {
  switch (type) {
    case "success":
    case "online":
      return `${colors.bgGreen}${colors.bold} ${text} ${colors.reset}`;
    case "running":
    case "warning":
      return `${colors.bgYellow}${colors.bold} ${text} ${colors.reset}`;
    case "error":
    case "offline":
      return `${colors.bgRed}${colors.bold} ${text} ${colors.reset}`;
    case "job":
    case "accent":
      return `${colors.bgMagenta}${colors.bold} ${text} ${colors.reset}`;
    case "info":
    default:
      return `${colors.bgBlue}${colors.bold} ${text} ${colors.reset}`;
  }
}

export function drawBanner(version = "1.0.3", status = "ONLINE") {
  const line = `${colors.cyan}${symbols.boxH.repeat(60)}${colors.reset}`;
  const statusBadge = status === "ONLINE" ? badge("🟢 ONLINE", "success") : badge("🔴 OFFLINE", "error");
  
  console.log("");
  console.log(line);
  console.log(
    `${colors.cyan}${symbols.boxV}${colors.reset}  ${colors.bold}${colors.brightMagenta}⚡ K6 LAB AGENT${colors.reset} ${colors.dim}v${version}${colors.reset}`.padEnd(54) +
    `${statusBadge} ${colors.cyan}${symbols.boxV}${colors.reset}`
  );
  console.log(line);
}

export function drawCard(title, items, borderBg = colors.cyan) {
  const width = 64;
  const innerWidth = width - 4;
  
  const top = `${borderBg}${symbols.boxTL}${symbols.boxH.repeat(width - 2)}${symbols.boxTR}${colors.reset}`;
  const bottom = `${borderBg}${symbols.boxBL}${symbols.boxH.repeat(width - 2)}${symbols.boxBR}${colors.reset}`;
  const divider = `${borderBg}${symbols.boxL}${symbols.boxH.repeat(width - 2)}${symbols.boxR}${colors.reset}`;

  console.log(top);
  if (title) {
    console.log(`${borderBg}${symbols.boxV}${colors.reset}  ${colors.bold}${title}${colors.reset}`);
    console.log(divider);
  }

  for (const item of items) {
    if (item === "---") {
      console.log(divider);
      continue;
    }
    let label = item.label ? `${colors.gray}${item.label.padEnd(16)}${colors.reset}` : "";
    let val = item.value !== undefined ? `${colors.brightWhite}${item.value}${colors.reset}` : "";
    if (item.color) {
      val = `${item.color}${item.value}${colors.reset}`;
    }
    const content = label ? `${label} : ${val}` : val;
    console.log(`${borderBg}${symbols.boxV}${colors.reset}  ${content}`);
  }

  console.log(bottom);
}

export function drawSummaryTable(summary) {
  if (!summary || !summary.metrics) {
    return;
  }

  const m = summary.metrics;
  const reqs = m.http_reqs ? m.http_reqs.values.count : (m.iterations ? m.iterations.values.count : 0);
  const rps = m.http_reqs ? (m.http_reqs.values.rate || 0).toFixed(1) : "N/A";
  
  const reqDuration = m.http_req_duration ? m.http_req_duration.values : null;
  const avgLat = reqDuration ? `${reqDuration.avg.toFixed(1)} ms` : "N/A";
  const p95Lat = reqDuration && reqDuration["p(95)"] ? `${reqDuration["p(95)"].toFixed(1)} ms` : "N/A";
  const minLat = reqDuration ? `${reqDuration.min.toFixed(1)} ms` : "N/A";
  const maxLat = reqDuration ? `${reqDuration.max.toFixed(1)} ms` : "N/A";
  
  const failedReqs = m.http_req_failed ? m.http_req_failed.values.passes || 0 : 0;
  const totalHttp = m.http_req_failed ? (m.http_req_failed.values.passes + m.http_req_failed.values.fails) : reqs;
  const successRate = totalHttp > 0 ? (((totalHttp - failedReqs) / totalHttp) * 100).toFixed(1) + "%" : "100%";

  const items = [
    { label: "Total Requests", value: `${reqs} reqs`, color: colors.brightCyan },
    { label: "Throughput (RPS)", value: `${rps} req/s`, color: colors.brightGreen },
    { label: "Success Rate", value: successRate, color: failedReqs === 0 ? colors.brightGreen : colors.yellow },
    "---",
    { label: "Avg Latency", value: avgLat, color: colors.brightWhite },
    { label: "p95 Latency", value: p95Lat, color: colors.brightYellow },
    { label: "Min / Max", value: `${minLat} / ${maxLat}`, color: colors.gray }
  ];

  drawCard(`${symbols.chart}  TEST PERFORMANCE SUMMARY`, items, colors.magenta);
}

export function logInfo(msg) {
  console.log(`${colors.cyan}${symbols.info}${colors.reset}  ${msg}`);
}

export function logSuccess(msg) {
  console.log(`${colors.green}${symbols.check}${colors.reset}  ${colors.bold}${colors.brightGreen}${msg}${colors.reset}`);
}

export function logWarn(msg) {
  console.log(`${colors.yellow}${symbols.warning}${colors.reset}  ${colors.yellow}${msg}${colors.reset}`);
}

export function logError(msg) {
  console.log(`${colors.red}${symbols.cross}${colors.reset}  ${colors.red}${colors.bold}${msg}${colors.reset}`);
}
