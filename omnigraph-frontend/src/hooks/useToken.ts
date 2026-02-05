import { useReadContract, useReadContracts } from "wagmi";
import { CONTRACT_ADDRESSES } from "@/contracts/addresses";
import { tokenABI } from "@/contracts/abis";
import { formatUnits } from "viem";

export function useTokenInfo() {
  const { data, isLoading, error } = useReadContracts({
    contracts: [
      {
        address: CONTRACT_ADDRESSES.token as `0x${string}`,
        abi: tokenABI,
        functionName: "name",
      },
      {
        address: CONTRACT_ADDRESSES.token as `0x${string}`,
        abi: tokenABI,
        functionName: "symbol",
      },
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
      {
        address: CONTRACT_ADDRESSES.token as `0x${string}`,
        abi: tokenABI,
        functionName: "maxBurnable",
      },
      {
        address: CONTRACT_ADDRESSES.token as `0x${string}`,
        abi: tokenABI,
        functionName: "buyTaxBps",
      },
      {
        address: CONTRACT_ADDRESSES.token as `0x${string}`,
        abi: tokenABI,
        functionName: "sellTaxBps",
      },
      {
        address: CONTRACT_ADDRESSES.token as `0x${string}`,
        abi: tokenABI,
        functionName: "tradingEnabled",
      },
    ],
  });

  const name = data?.[0].result as string | undefined;
  const symbol = data?.[1].result as string | undefined;
  const totalSupply = data?.[2].result as bigint | undefined;
  const totalBurned = data?.[3].result as bigint | undefined;
  const maxBurnable = data?.[4].result as bigint | undefined;
  const buyTaxBps = data?.[5].result as number | undefined;
  const sellTaxBps = data?.[6].result as number | undefined;
  const tradingEnabled = data?.[7].result as boolean | undefined;

  const circulatingSupply = totalSupply && totalBurned ? totalSupply - totalBurned : undefined;
  const burnedPercentage =
    totalBurned && totalSupply
      ? Number(formatUnits(totalBurned * BigInt(10000) / totalSupply, 2))
      : undefined;

  return {
    name,
    symbol,
    totalSupply,
    totalBurned,
    maxBurnable,
    circulatingSupply,
    burnedPercentage,
    buyTaxBps,
    sellTaxBps,
    tradingEnabled,
    isLoading,
    error,
  };
}

export function useTokenBalance(address: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.token as `0x${string}`,
    abi: tokenABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
}

export function useTokenAllowance(owner: `0x${string}` | undefined, spender: string) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.token as `0x${string}`,
    abi: tokenABI,
    functionName: "allowance",
    args: owner ? [owner, spender as `0x${string}`] : undefined,
    query: {
      enabled: !!owner,
    },
  });
}
