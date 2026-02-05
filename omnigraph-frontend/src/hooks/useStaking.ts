import { useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACT_ADDRESSES } from "@/contracts/addresses";
import { stakingSingleABI, stakingLPABI, tokenABI, erc20ABI } from "@/contracts/abis";
import { parseUnits } from "viem";

export function useStakingSingle(userAddress: `0x${string}` | undefined) {
  const contracts: unknown[] = [
    {
      address: CONTRACT_ADDRESSES.stakingSingle as `0x${string}`,
      abi: stakingSingleABI,
      functionName: "totalSupply",
    },
    {
      address: CONTRACT_ADDRESSES.stakingSingle as `0x${string}`,
      abi: stakingSingleABI,
      functionName: "rewardRate",
    },
    {
      address: CONTRACT_ADDRESSES.stakingSingle as `0x${string}`,
      abi: stakingSingleABI,
      functionName: "periodFinish",
    },
    {
      address: CONTRACT_ADDRESSES.stakingSingle as `0x${string}`,
      abi: stakingSingleABI,
      functionName: "estimatedAPR",
    },
  ];

  if (userAddress) {
    contracts.push(
      {
        address: CONTRACT_ADDRESSES.stakingSingle as `0x${string}`,
        abi: stakingSingleABI,
        functionName: "balances",
        args: [userAddress],
      },
      {
        address: CONTRACT_ADDRESSES.stakingSingle as `0x${string}`,
        abi: stakingSingleABI,
        functionName: "earned",
        args: [userAddress],
      }
    );
  }

  const { data, isLoading, refetch } = useReadContracts({
    contracts: contracts as any,
  });

  return {
    totalStaked: data?.[0]?.result as bigint | undefined,
    rewardRate: data?.[1]?.result as bigint | undefined,
    periodFinish: data?.[2]?.result as bigint | undefined,
    estimatedAPR: data?.[3]?.result as bigint | undefined,
    userStaked: userAddress ? (data?.[4]?.result as bigint | undefined) : undefined,
    userEarned: userAddress ? (data?.[5]?.result as bigint | undefined) : undefined,
    isLoading,
    refetch,
  };
}

export function useStakingLP(userAddress: `0x${string}` | undefined) {
  const contracts: unknown[] = [
    {
      address: CONTRACT_ADDRESSES.stakingLP as `0x${string}`,
      abi: stakingLPABI,
      functionName: "totalSupply",
    },
    {
      address: CONTRACT_ADDRESSES.stakingLP as `0x${string}`,
      abi: stakingLPABI,
      functionName: "rewardRate",
    },
    {
      address: CONTRACT_ADDRESSES.stakingLP as `0x${string}`,
      abi: stakingLPABI,
      functionName: "estimatedAPR",
    },
  ];

  if (userAddress) {
    contracts.push(
      {
        address: CONTRACT_ADDRESSES.stakingLP as `0x${string}`,
        abi: stakingLPABI,
        functionName: "balances",
        args: [userAddress],
      },
      {
        address: CONTRACT_ADDRESSES.stakingLP as `0x${string}`,
        abi: stakingLPABI,
        functionName: "earnedWithBonus",
        args: [userAddress],
      },
      {
        address: CONTRACT_ADDRESSES.stakingLP as `0x${string}`,
        abi: stakingLPABI,
        functionName: "qualifiesForBonus",
        args: [userAddress],
      },
      {
        address: CONTRACT_ADDRESSES.stakingLP as `0x${string}`,
        abi: stakingLPABI,
        functionName: "timeUntilBonus",
        args: [userAddress],
      }
    );
  }

  const { data, isLoading, refetch } = useReadContracts({
    contracts: contracts as any,
  });

  const earnedResult = userAddress ? (data?.[4]?.result as [bigint, bigint] | undefined) : undefined;

  return {
    totalStaked: data?.[0]?.result as bigint | undefined,
    rewardRate: data?.[1]?.result as bigint | undefined,
    estimatedAPR: data?.[2]?.result as bigint | undefined,
    userStaked: userAddress ? (data?.[3]?.result as bigint | undefined) : undefined,
    userEarned: earnedResult?.[0],
    userBonus: earnedResult?.[1],
    qualifiesForBonus: userAddress ? (data?.[5]?.result as boolean | undefined) : undefined,
    timeUntilBonus: userAddress ? (data?.[6]?.result as bigint | undefined) : undefined,
    isLoading,
    refetch,
  };
}

export function useStakingActions() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const stake = (amount: string, isLP: boolean = false) => {
    const parsedAmount = parseUnits(amount, 18);
    writeContract({
      address: (isLP ? CONTRACT_ADDRESSES.stakingLP : CONTRACT_ADDRESSES.stakingSingle) as `0x${string}`,
      abi: isLP ? stakingLPABI : stakingSingleABI,
      functionName: "stake",
      args: [parsedAmount],
    });
  };

  const withdraw = (amount: string, isLP: boolean = false) => {
    const parsedAmount = parseUnits(amount, 18);
    writeContract({
      address: (isLP ? CONTRACT_ADDRESSES.stakingLP : CONTRACT_ADDRESSES.stakingSingle) as `0x${string}`,
      abi: isLP ? stakingLPABI : stakingSingleABI,
      functionName: "withdraw",
      args: [parsedAmount],
    });
  };

  const claimRewards = (isLP: boolean = false) => {
    writeContract({
      address: (isLP ? CONTRACT_ADDRESSES.stakingLP : CONTRACT_ADDRESSES.stakingSingle) as `0x${string}`,
      abi: isLP ? stakingLPABI : stakingSingleABI,
      functionName: "getReward",
    });
  };

  const exit = (isLP: boolean = false) => {
    writeContract({
      address: (isLP ? CONTRACT_ADDRESSES.stakingLP : CONTRACT_ADDRESSES.stakingSingle) as `0x${string}`,
      abi: isLP ? stakingLPABI : stakingSingleABI,
      functionName: "exit",
    });
  };

  const approve = (spender: string, amount: bigint, isLP: boolean = false) => {
    writeContract({
      address: (isLP ? CONTRACT_ADDRESSES.lpPair : CONTRACT_ADDRESSES.token) as `0x${string}`,
      abi: tokenABI,
      functionName: "approve",
      args: [spender as `0x${string}`, amount],
    });
  };

  return {
    stake,
    withdraw,
    claimRewards,
    exit,
    approve,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}
