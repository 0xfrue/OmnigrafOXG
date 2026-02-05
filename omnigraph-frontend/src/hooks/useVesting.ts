import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACT_ADDRESSES } from "@/contracts/addresses";
import { vestingAggregatorABI } from "@/contracts/abis";

export function useVesting(userAddress: `0x${string}` | undefined) {
  const { data: releasable, isLoading: loadingReleasable, refetch: refetchReleasable } = useReadContract({
    address: CONTRACT_ADDRESSES.vestingAggregator as `0x${string}`,
    abi: vestingAggregatorABI,
    functionName: "totalReleasable",
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
  });

  const { data: vested, isLoading: loadingVested } = useReadContract({
    address: CONTRACT_ADDRESSES.vestingAggregator as `0x${string}`,
    abi: vestingAggregatorABI,
    functionName: "totalVested",
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
  });

  const { data: unvested, isLoading: loadingUnvested } = useReadContract({
    address: CONTRACT_ADDRESSES.vestingAggregator as `0x${string}`,
    abi: vestingAggregatorABI,
    functionName: "totalUnvested",
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
  });

  const { data: vestingInfo, isLoading: loadingInfo } = useReadContract({
    address: CONTRACT_ADDRESSES.vestingAggregator as `0x${string}`,
    abi: vestingAggregatorABI,
    functionName: "getVestingInfo",
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
  });

  const info = vestingInfo as [string[], bigint[], bigint[], bigint[]] | undefined;

  return {
    totalReleasable: releasable as bigint | undefined,
    totalVested: vested as bigint | undefined,
    totalUnvested: unvested as bigint | undefined,
    vestingContracts: info?.[0],
    releasableAmounts: info?.[1],
    vestedAmounts: info?.[2],
    unvestedAmounts: info?.[3],
    isLoading: loadingReleasable || loadingVested || loadingUnvested || loadingInfo,
    refetch: refetchReleasable,
  };
}

export function useClaimVesting() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const claimAll = () => {
    writeContract({
      address: CONTRACT_ADDRESSES.vestingAggregator as `0x${string}`,
      abi: vestingAggregatorABI,
      functionName: "claimAll",
    });
  };

  return {
    claimAll,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}
