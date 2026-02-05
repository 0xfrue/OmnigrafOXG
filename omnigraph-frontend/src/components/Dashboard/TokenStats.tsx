"use client";

import { useTokenInfo } from "@/hooks/useToken";
import { formatTokenAmount, formatPercentage } from "@/utils/format";
import { StatCard } from "@/components/ui/StatCard";

export function TokenStats() {
  const {
    totalSupply,
    totalBurned,
    circulatingSupply,
    burnedPercentage,
    buyTaxBps,
    sellTaxBps,
    isLoading,
  } = useTokenInfo();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Supply"
        value={`${formatTokenAmount(totalSupply, 18, 0)} OGX`}
        loading={isLoading}
      />
      <StatCard
        label="Circulating Supply"
        value={`${formatTokenAmount(circulatingSupply, 18, 0)} OGX`}
        loading={isLoading}
      />
      <StatCard
        label="Total Burned"
        value={`${formatTokenAmount(totalBurned, 18, 0)} OGX`}
        change={burnedPercentage ? `${burnedPercentage.toFixed(2)}% of supply` : undefined}
        changeType="positive"
        loading={isLoading}
      />
      <StatCard
        label="Current Taxes"
        value={`${formatPercentage(buyTaxBps)} / ${formatPercentage(sellTaxBps)}`}
        change="Buy / Sell"
        loading={isLoading}
      />
    </div>
  );
}
