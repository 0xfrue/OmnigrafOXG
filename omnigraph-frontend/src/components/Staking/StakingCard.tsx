"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useStakingSingle, useStakingLP, useStakingActions } from "@/hooks/useStaking";
import { useTokenBalance, useTokenAllowance } from "@/hooks/useToken";
import { formatTokenAmount, parseTokenAmount } from "@/utils/format";
import { CONTRACT_ADDRESSES } from "@/contracts/addresses";
import { formatUnits } from "viem";
import toast from "react-hot-toast";

interface StakingCardProps {
  isLP?: boolean;
}

export function StakingCard({ isLP = false }: StakingCardProps) {
  const { address } = useAccount();
  const [amount, setAmount] = useState("");
  const [isWithdraw, setIsWithdraw] = useState(false);

  const stakingAddress = isLP ? CONTRACT_ADDRESSES.stakingLP : CONTRACT_ADDRESSES.stakingSingle;

  const singleStaking = useStakingSingle(address);
  const lpStaking = useStakingLP(address);
  const staking = isLP ? lpStaking : singleStaking;

  const { data: balance } = useTokenBalance(address);
  const { data: allowance } = useTokenAllowance(address, stakingAddress);

  const { stake, withdraw, claimRewards, approve, isPending, isConfirming, isSuccess, error } =
    useStakingActions();

  const needsApproval =
    !isWithdraw && amount && allowance !== undefined && parseTokenAmount(amount) > allowance;

  const handleAction = async () => {
    if (!amount) return;

    try {
      if (needsApproval) {
        approve(stakingAddress, parseTokenAmount(amount) * 10n, isLP);
        toast.success("Approval submitted");
        return;
      }

      if (isWithdraw) {
        withdraw(amount, isLP);
      } else {
        stake(amount, isLP);
      }
      toast.success(`${isWithdraw ? "Withdraw" : "Stake"} submitted`);
    } catch (e) {
      toast.error("Transaction failed");
    }
  };

  const handleClaim = async () => {
    try {
      claimRewards(isLP);
      toast.success("Claim submitted");
    } catch (e) {
      toast.error("Claim failed");
    }
  };

  const setMax = () => {
    if (isWithdraw && staking.userStaked) {
      setAmount(formatUnits(staking.userStaked, 18));
    } else if (!isWithdraw && balance) {
      setAmount(formatUnits(balance, 18));
    }
  };

  const apr = staking.estimatedAPR
    ? (Number(formatUnits(staking.estimatedAPR, 18)) * 100).toFixed(2)
    : "0";

  return (
    <Card>
      <CardHeader
        title={isLP ? "LP Staking" : "Token Staking"}
        subtitle={`Stake ${isLP ? "LP tokens" : "OGX"} to earn rewards`}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-dark-200 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Total Staked</p>
          <p className="text-xl font-bold">
            {formatTokenAmount(staking.totalStaked)} {isLP ? "LP" : "OGX"}
          </p>
        </div>
        <div className="bg-dark-200 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">APR</p>
          <p className="text-xl font-bold text-green-400">{apr}%</p>
        </div>
      </div>

      {/* User Stats */}
      {address && (
        <div className="bg-dark-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Your Staked</span>
            <span className="font-medium">
              {formatTokenAmount(staking.userStaked)} {isLP ? "LP" : "OGX"}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Rewards Earned</span>
            <span className="font-medium text-green-400">
              {formatTokenAmount(staking.userEarned)} OGX
            </span>
          </div>
          {isLP && "userBonus" in staking && staking.userBonus && staking.userBonus > 0n && (
            <div className="flex justify-between">
              <span className="text-gray-400">Bonus</span>
              <span className="font-medium text-accent-400">
                +{formatTokenAmount(staking.userBonus)} OGX
              </span>
            </div>
          )}
        </div>
      )}

      {/* Action Tabs */}
      <div className="flex mb-4 bg-dark-200 rounded-lg p-1">
        <button
          onClick={() => setIsWithdraw(false)}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            !isWithdraw ? "bg-primary-500 text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          Stake
        </button>
        <button
          onClick={() => setIsWithdraw(true)}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            isWithdraw ? "bg-primary-500 text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          Withdraw
        </button>
      </div>

      {/* Input */}
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-400">Amount</span>
          <button onClick={setMax} className="text-sm text-primary-400 hover:text-primary-300">
            Max:{" "}
            {isWithdraw
              ? formatTokenAmount(staking.userStaked)
              : formatTokenAmount(balance)}
          </button>
        </div>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.0"
          suffix={isLP ? "LP" : "OGX"}
        />
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button
          onClick={handleAction}
          loading={isPending || isConfirming}
          disabled={!amount || !address}
          className="w-full"
        >
          {needsApproval ? "Approve" : isWithdraw ? "Withdraw" : "Stake"}
        </Button>

        {staking.userEarned && staking.userEarned > 0n && (
          <Button
            variant="secondary"
            onClick={handleClaim}
            loading={isPending || isConfirming}
            className="w-full"
          >
            Claim {formatTokenAmount(staking.userEarned)} OGX
          </Button>
        )}
      </div>
    </Card>
  );
}
