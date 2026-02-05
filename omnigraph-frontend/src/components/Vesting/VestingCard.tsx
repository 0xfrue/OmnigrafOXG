"use client";

import { useAccount } from "wagmi";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useVesting, useClaimVesting } from "@/hooks/useVesting";
import { formatTokenAmount } from "@/utils/format";
import toast from "react-hot-toast";

export function VestingCard() {
  const { address } = useAccount();
  const {
    totalReleasable,
    totalVested,
    totalUnvested,
    vestingContracts,
    releasableAmounts,
    vestedAmounts,
    unvestedAmounts,
    isLoading,
    refetch,
  } = useVesting(address);

  const { claimAll, isPending, isConfirming, isSuccess } = useClaimVesting();

  const handleClaim = async () => {
    try {
      claimAll();
      toast.success("Claim submitted");
    } catch (e) {
      toast.error("Claim failed");
    }
  };

  // Calculate progress
  const totalAllocated = totalVested && totalUnvested ? totalVested + totalUnvested : 0n;
  const progress =
    totalAllocated > 0n && totalVested
      ? Number((totalVested * 100n) / totalAllocated)
      : 0;

  if (!address) {
    return (
      <Card>
        <CardHeader title="Vesting" subtitle="Connect wallet to view your vesting" />
        <p className="text-gray-400 text-center py-8">
          Connect your wallet to view vesting schedules
        </p>
      </Card>
    );
  }

  if (totalAllocated === 0n && !isLoading) {
    return (
      <Card>
        <CardHeader title="Vesting" subtitle="Your token vesting schedule" />
        <p className="text-gray-400 text-center py-8">
          No vesting schedules found for your address
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title="Vesting" subtitle="Your token vesting schedule" />

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Vesting Progress</span>
          <span className="text-white font-medium">{progress.toFixed(1)}%</span>
        </div>
        <div className="h-3 bg-dark-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-dark-200 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-400 mb-1">Vested</p>
          <p className="text-lg font-bold text-green-400">
            {formatTokenAmount(totalVested)} OGX
          </p>
        </div>
        <div className="bg-dark-200 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-400 mb-1">Claimable</p>
          <p className="text-lg font-bold text-primary-400">
            {formatTokenAmount(totalReleasable)} OGX
          </p>
        </div>
        <div className="bg-dark-200 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-400 mb-1">Locked</p>
          <p className="text-lg font-bold text-gray-300">
            {formatTokenAmount(totalUnvested)} OGX
          </p>
        </div>
      </div>

      {/* Vesting Breakdown */}
      {vestingContracts && vestingContracts.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-400 mb-3">Vesting Contracts</h4>
          <div className="space-y-2">
            {vestingContracts.map((contract, i) => (
              <div
                key={contract}
                className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0"
              >
                <span className="text-gray-400 text-sm font-mono">
                  {contract.slice(0, 6)}...{contract.slice(-4)}
                </span>
                <div className="text-right">
                  <span className="text-green-400 text-sm">
                    {formatTokenAmount(releasableAmounts?.[i])} claimable
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Claim Button */}
      <Button
        onClick={handleClaim}
        loading={isPending || isConfirming}
        disabled={!totalReleasable || totalReleasable === 0n}
        className="w-full"
      >
        Claim {formatTokenAmount(totalReleasable)} OGX
      </Button>
    </Card>
  );
}
