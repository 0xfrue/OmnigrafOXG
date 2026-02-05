"use client";

import { useProtocolStats } from "@/hooks/useProtocolStats";
import { formatTokenAmount, formatTimeRemaining, formatPercentage } from "@/utils/format";
import { Card, CardHeader } from "@/components/ui/Card";

export function ProtocolStats() {
  const {
    totalFeesCollected,
    totalUsdcDistributed,
    feeCollectorBurned,
    pendingFees,
    polShareBps,
    treasuryShareBps,
    burnShareBps,
    lotteryShareBps,
    lockedLpBalance,
    lpTimeUntilRelease,
    isLoading,
  } = useProtocolStats();

  const feeSplits = [
    { label: "POL", value: polShareBps, color: "bg-primary-500" },
    { label: "Treasury", value: treasuryShareBps, color: "bg-accent-500" },
    { label: "Burn", value: burnShareBps, color: "bg-orange-500" },
    { label: "Lottery", value: lotteryShareBps, color: "bg-green-500" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Fee Distribution */}
      <Card>
        <CardHeader title="Fee Distribution" subtitle="Current tax allocation" />
        <div className="space-y-4">
          {/* Visual bar */}
          <div className="h-4 rounded-full overflow-hidden flex">
            {feeSplits.map((split, i) => (
              <div
                key={split.label}
                className={`${split.color} h-full`}
                style={{ width: `${(split.value || 0) / 100}%` }}
              />
            ))}
          </div>
          {/* Legend */}
          <div className="grid grid-cols-2 gap-2">
            {feeSplits.map((split) => (
              <div key={split.label} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded ${split.color}`} />
                <span className="text-sm text-gray-400">{split.label}</span>
                <span className="text-sm font-medium text-white ml-auto">
                  {formatPercentage(split.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Protocol Metrics */}
      <Card>
        <CardHeader title="Protocol Metrics" subtitle="Cumulative statistics" />
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-800">
            <span className="text-gray-400">Total Fees Collected</span>
            <span className="font-medium">{formatTokenAmount(totalFeesCollected)} OGX</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-800">
            <span className="text-gray-400">USDC Distributed</span>
            <span className="font-medium">${formatTokenAmount(totalUsdcDistributed, 6)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-800">
            <span className="text-gray-400">Tokens Burned (via fees)</span>
            <span className="font-medium">{formatTokenAmount(feeCollectorBurned)} OGX</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-800">
            <span className="text-gray-400">Pending Fees</span>
            <span className="font-medium">{formatTokenAmount(pendingFees)} OGX</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-400">Locked LP</span>
            <span className="font-medium">
              {formatTokenAmount(lockedLpBalance)} LP
              {lpTimeUntilRelease && lpTimeUntilRelease > 0n && (
                <span className="text-gray-500 ml-2">
                  (unlocks in {formatTimeRemaining(Number(lpTimeUntilRelease) + Math.floor(Date.now() / 1000))})
                </span>
              )}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
