import { formatUnits } from "viem";

export function formatTokenAmount(
  amount: bigint | undefined,
  decimals: number = 18,
  displayDecimals: number = 2
): string {
  if (amount === undefined) return "0";
  const formatted = formatUnits(amount, decimals);
  const num = parseFloat(formatted);

  if (num === 0) return "0";
  if (num < 0.01) return "<0.01";

  return num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: displayDecimals,
  });
}

export function formatUSD(amount: number | undefined, decimals: number = 2): string {
  if (amount === undefined) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

export function formatPercentage(bps: number | undefined): string {
  if (bps === undefined) return "0%";
  return `${(bps / 100).toFixed(2)}%`;
}

export function formatCompactNumber(num: number): string {
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toFixed(2);
}

export function formatAddress(address: string, chars: number = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

export function formatTimeRemaining(endTime: number): string {
  const now = Math.floor(Date.now() / 1000);
  const remaining = endTime - now;

  if (remaining <= 0) return "Ended";

  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining % 86400) / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function parseTokenAmount(amount: string, decimals: number = 18): bigint {
  const parts = amount.split(".");
  const intPart = parts[0] || "0";
  let decPart = parts[1] || "";

  // Pad or truncate decimal part
  if (decPart.length > decimals) {
    decPart = decPart.slice(0, decimals);
  } else {
    decPart = decPart.padEnd(decimals, "0");
  }

  return BigInt(intPart + decPart);
}
