import { useReadContracts } from "wagmi";
import { CONTRACT_ADDRESSES } from "@/contracts/addresses";
import { feeCollectorABI, lpTimelockABI, tokenABI, erc20ABI } from "@/contracts/abis";

export function useProtocolStats() {
  const { data, isLoading, error } = useReadContracts({
    contracts: [
      // Token stats
      {
        address: CONTRACT_ADDRESSES.token as `0x${string}`,
        abi: tokenABI,
        functionName: "totalSupply",
      },
      {
        address: CONTRACT_ADDRESSES.token as `0x${string}`,
        abi: tokenABI,
        functionName: "totalBurned",
      },
      // Fee collector stats
      {
        address: CONTRACT_ADDRESSES.feeCollector as `0x${string}`,
        abi: feeCollectorABI,
        functionName: "totalFeesCollected",
      },
      {
        address: CONTRACT_ADDRESSES.feeCollector as `0x${string}`,
        abi: feeCollectorABI,
        functionName: "totalUsdcDistributed",
      },
      {
        address: CONTRACT_ADDRESSES.feeCollector as `0x${string}`,
        abi: feeCollectorABI,
        functionName: "totalTokensBurned",
      },
      {
        address: CONTRACT_ADDRESSES.feeCollector as `0x${string}`,
        abi: feeCollectorABI,
        functionName: "pendingFees",
      },
      // Fee splits
      {
        address: CONTRACT_ADDRESSES.feeCollector as `0x${string}`,
        abi: feeCollectorABI,
        functionName: "polShareBps",
      },
      {
        address: CONTRACT_ADDRESSES.feeCollector as `0x${string}`,
        abi: feeCollectorABI,
        functionName: "treasuryShareBps",
      },
      {
        address: CONTRACT_ADDRESSES.feeCollector as `0x${string}`,
        abi: feeCollectorABI,
        functionName: "burnShareBps",
      },
      {
        address: CONTRACT_ADDRESSES.feeCollector as `0x${string}`,
        abi: feeCollectorABI,
        functionName: "lotteryShareBps",
      },
      // LP Timelock
      {
        address: CONTRACT_ADDRESSES.lpTimelock as `0x${string}`,
        abi: lpTimelockABI,
        functionName: "lockedBalance",
      },
      {
        address: CONTRACT_ADDRESSES.lpTimelock as `0x${string}`,
        abi: lpTimelockABI,
        functionName: "releaseTime",
      },
      {
        address: CONTRACT_ADDRESSES.lpTimelock as `0x${string}`,
        abi: lpTimelockABI,
        functionName: "timeUntilRelease",
      },
    ],
  });

  return {
    // Token
    totalSupply: data?.[0].result as bigint | undefined,
    totalBurned: data?.[1].result as bigint | undefined,

    // Fee Collector
    totalFeesCollected: data?.[2].result as bigint | undefined,
    totalUsdcDistributed: data?.[3].result as bigint | undefined,
    feeCollectorBurned: data?.[4].result as bigint | undefined,
    pendingFees: data?.[5].result as bigint | undefined,

    // Fee Splits
    polShareBps: data?.[6].result as number | undefined,
    treasuryShareBps: data?.[7].result as number | undefined,
    burnShareBps: data?.[8].result as number | undefined,
    lotteryShareBps: data?.[9].result as number | undefined,

    // LP Lock
    lockedLpBalance: data?.[10].result as bigint | undefined,
    lpReleaseTime: data?.[11].result as bigint | undefined,
    lpTimeUntilRelease: data?.[12].result as bigint | undefined,

    isLoading,
    error,
  };
}

export function useLpPoolStats() {
  const { data, isLoading } = useReadContracts({
    contracts: [
      {
        address: CONTRACT_ADDRESSES.lpPair as `0x${string}`,
        abi: erc20ABI,
        functionName: "totalSupply",
      },
      {
        address: CONTRACT_ADDRESSES.token as `0x${string}`,
        abi: erc20ABI,
        functionName: "balanceOf",
        args: [CONTRACT_ADDRESSES.lpPair as `0x${string}`],
      },
      {
        address: CONTRACT_ADDRESSES.usdc as `0x${string}`,
        abi: erc20ABI,
        functionName: "balanceOf",
        args: [CONTRACT_ADDRESSES.lpPair as `0x${string}`],
      },
    ],
  });

  const lpTotalSupply = data?.[0].result as bigint | undefined;
  const tokenReserve = data?.[1].result as bigint | undefined;
  const usdcReserve = data?.[2].result as bigint | undefined;

  return {
    lpTotalSupply,
    tokenReserve,
    usdcReserve,
    isLoading,
  };
}
