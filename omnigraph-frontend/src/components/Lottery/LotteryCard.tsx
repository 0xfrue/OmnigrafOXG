"use client";

import { useAccount } from "wagmi";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useLottery, useClaimPrize } from "@/hooks/useLottery";
import { formatTokenAmount, formatTimeRemaining } from "@/utils/format";
import { formatUnits } from "viem";
import toast from "react-hot-toast";

export function LotteryCard() {
  const { address } = useAccount();
  const {
    currentEpochId,
    isActive,
    prizePool,
    epoch,
    userEntries,
    winProbability,
    refetch,
  } = useLottery(address);

  const { claimPrize, isPending, isConfirming } = useClaimPrize();

  const canClaim =
    epoch &&
    epoch.fulfilled &&
    !epoch.claimed &&
    epoch.winner.toLowerCase() === address?.toLowerCase();

  const handleClaim = () => {
    if (currentEpochId) {
      claimPrize(currentEpochId);
      toast.success("Claim submitted");
    }
  };

  const winChance = winProbability
    ? (Number(formatUnits(winProbability, 18)) * 100).toFixed(4)
    : "0";

  return (
    <Card>
      <CardHeader
        title="Weekly Lottery"
        subtitle={isActive ? "Epoch is active" : "Waiting for next epoch"}
        action={
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              isActive
                ? "bg-green-500/20 text-green-400"
                : "bg-gray-500/20 text-gray-400"
            }`}
          >
            {isActive ? "LIVE" : "ENDED"}
          </span>
        }
      />

      {/* Prize Pool */}
      <div className="bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-xl p-6 mb-6 text-center">
        <p className="text-sm text-gray-400 mb-2">Current Prize Pool</p>
        <p className="text-4xl font-bold gradient-text">
          ${formatTokenAmount(prizePool, 6, 2)}
        </p>
        <p className="text-sm text-gray-400 mt-2">USDC</p>
      </div>

      {/* Epoch Info */}
      {epoch && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-dark-200 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Total Entries</p>
            <p className="text-xl font-bold">{epoch.totalEntries.toString()}</p>
          </div>
          <div className="bg-dark-200 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">
              {isActive ? "Time Remaining" : "Status"}
            </p>
            <p className="text-xl font-bold">
              {isActive
                ? formatTimeRemaining(Number(epoch.endTime))
                : epoch.fulfilled
                ? "Winner Selected"
                : "Drawing..."}
            </p>
          </div>
        </div>
      )}

      {/* User Entries */}
      {address && (
        <div className="bg-dark-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Your Entries</span>
            <span className="font-medium">{userEntries?.toString() || "0"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Win Probability</span>
            <span className="font-medium text-primary-400">{winChance}%</span>
          </div>
        </div>
      )}

      {/* How to Enter */}
      <div className="bg-dark-200 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-medium text-white mb-2">How to Earn Entries</h4>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• Stake OGX tokens to earn entries</li>
          <li>• Stake LP tokens for bonus entries</li>
          <li>• Complete quests for additional entries</li>
        </ul>
      </div>

      {/* Winner Display */}
      {epoch?.fulfilled && epoch.winner !== "0x0000000000000000000000000000000000000000" && (
        <div className="bg-gradient-to-br from-accent-500/20 to-primary-500/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-400 mb-1">Winner</p>
          <p className="font-mono text-sm text-white">
            {epoch.winner.slice(0, 10)}...{epoch.winner.slice(-8)}
          </p>
          {canClaim && (
            <p className="text-green-400 text-sm mt-2">That's you! Claim your prize below.</p>
          )}
        </div>
      )}

      {/* Claim Button (for winner) */}
      {canClaim && (
        <Button
          onClick={handleClaim}
          loading={isPending || isConfirming}
          className="w-full"
        >
          Claim Prize
        </Button>
      )}
    </Card>
  );
}
