import { useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACT_ADDRESSES } from "@/contracts/addresses";
import { lotteryABI } from "@/contracts/abis";

export interface Epoch {
  startTime: bigint;
  endTime: bigint;
  prizePool: bigint;
  totalEntries: bigint;
  fulfilled: boolean;
  claimed: boolean;
  winner: string;
  randomWord: bigint;
}

export function useLottery(userAddress: `0x${string}` | undefined) {
  const { data: currentEpochId, refetch: refetchEpochId } = useReadContract({
    address: CONTRACT_ADDRESSES.lottery as `0x${string}`,
    abi: lotteryABI,
    functionName: "currentEpochId",
  });

  const { data: isActive } = useReadContract({
    address: CONTRACT_ADDRESSES.lottery as `0x${string}`,
    abi: lotteryABI,
    functionName: "isEpochActive",
  });

  const { data: prizePool } = useReadContract({
    address: CONTRACT_ADDRESSES.lottery as `0x${string}`,
    abi: lotteryABI,
    functionName: "getCurrentPrizePool",
  });

  const epochId = currentEpochId as bigint | undefined;

  const { data: epoch, refetch: refetchEpoch } = useReadContract({
    address: CONTRACT_ADDRESSES.lottery as `0x${string}`,
    abi: lotteryABI,
    functionName: "getEpoch",
    args: epochId ? [epochId] : undefined,
    query: { enabled: !!epochId },
  });

  const { data: userEntries, refetch: refetchEntries } = useReadContract({
    address: CONTRACT_ADDRESSES.lottery as `0x${string}`,
    abi: lotteryABI,
    functionName: "getUserEntries",
    args: epochId && userAddress ? [epochId, userAddress] : undefined,
    query: { enabled: !!epochId && !!userAddress },
  });

  const { data: winProbability } = useReadContract({
    address: CONTRACT_ADDRESSES.lottery as `0x${string}`,
    abi: lotteryABI,
    functionName: "getWinProbability",
    args: epochId && userAddress ? [epochId, userAddress] : undefined,
    query: { enabled: !!epochId && !!userAddress },
  });

  return {
    currentEpochId: epochId,
    isActive: isActive as boolean | undefined,
    prizePool: prizePool as bigint | undefined,
    epoch: epoch as Epoch | undefined,
    userEntries: userEntries as bigint | undefined,
    winProbability: winProbability as bigint | undefined,
    refetch: () => {
      refetchEpochId();
      refetchEpoch();
      refetchEntries();
    },
  };
}

export function useClaimPrize() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const claimPrize = (epochId: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESSES.lottery as `0x${string}`,
      abi: lotteryABI,
      functionName: "claimPrize",
      args: [epochId],
    });
  };

  return {
    claimPrize,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}
