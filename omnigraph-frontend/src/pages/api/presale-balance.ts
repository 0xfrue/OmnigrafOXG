import type { NextApiRequest, NextApiResponse } from "next";

const PRESALE_WALLET = process.env.NEXT_PUBLIC_PRESALE_WALLET || "0x7A329d5A159f4025ddCfB1a78aE3809Fa824659c";
const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS || "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

const RPC_URLS = [
  "https://mainnet.base.org",
  "https://base.llamarpc.com",
  "https://base-rpc.publicnode.com",
];

function encodeBalanceOf(address: string): string {
  const addr = address.toLowerCase().replace("0x", "").padStart(64, "0");
  return "0x70a08231" + addr;
}

async function rpcCall(url: string, method: string, params: unknown[]) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
      signal: controller.signal,
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.result;
  } finally {
    clearTimeout(timeout);
  }
}

async function rpcWithFallback(method: string, params: unknown[]) {
  for (const url of RPC_URLS) {
    try {
      return await rpcCall(url, method, params);
    } catch {
      continue;
    }
  }
  throw new Error(`All RPCs failed for ${method}`);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const [ethHex, usdcHex] = await Promise.all([
      rpcWithFallback("eth_getBalance", [PRESALE_WALLET, "latest"]),
      rpcWithFallback("eth_call", [
        { to: USDC_ADDRESS, data: encodeBalanceOf(PRESALE_WALLET) },
        "latest",
      ]),
    ]);

    const ethBalance = Number(BigInt(ethHex)) / 1e18;
    const usdcBalance = Number(BigInt(usdcHex || "0x0")) / 1e6;

    res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");

    return res.status(200).json({
      wallet: PRESALE_WALLET,
      eth: parseFloat(ethBalance.toFixed(6)),
      usdc: parseFloat(usdcBalance.toFixed(2)),
    });
  } catch (error) {
    console.error("Error fetching presale balance:", error);
    return res.status(500).json({ error: "Failed to fetch balance" });
  }
}
