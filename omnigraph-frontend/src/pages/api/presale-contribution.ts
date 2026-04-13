import type { NextApiRequest, NextApiResponse } from "next";

const PRESALE_WALLET = (process.env.NEXT_PUBLIC_PRESALE_WALLET || "0x7A329d5A159f4025ddCfB1a78aE3809Fa824659c").toLowerCase();
const USDC_ADDRESS = (process.env.NEXT_PUBLIC_USDC_ADDRESS || "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913").toLowerCase();

const RPC_URLS = [
  "https://mainnet.base.org",
  "https://base.llamarpc.com",
  "https://base-rpc.publicnode.com",
];

const TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

function padAddress(address: string): string {
  return "0x" + address.toLowerCase().replace("0x", "").padStart(64, "0");
}

function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
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

  const { address } = req.query;

  if (!address || typeof address !== "string" || !isValidAddress(address)) {
    return res.status(400).json({ error: "Invalid wallet address" });
  }

  const senderAddress = address.toLowerCase();

  try {
    const latestHex = await rpcWithFallback("eth_blockNumber", []);
    const latest = parseInt(latestHex, 16);

    // Base produces blocks every 2s. Scan ~30 days = ~1.3M blocks.
    // Base RPCs support large ranges with indexed topics, so we do
    // 2-3 large chunks instead of many small ones.
    const scanDepth = 1_300_000;
    const from = Math.max(0, latest - scanDepth);

    const topics = [
      TRANSFER_TOPIC,
      padAddress(senderAddress),
      padAddress(PRESALE_WALLET),
    ];

    // Split into 2 chunks to stay within RPC limits
    const mid = from + Math.floor(scanDepth / 2);
    const chunks = [
      { from: "0x" + from.toString(16), to: "0x" + mid.toString(16) },
      { from: "0x" + (mid + 1).toString(16), to: "0x" + latest.toString(16) },
    ];

    const results = await Promise.allSettled(
      chunks.map((c) =>
        rpcWithFallback("eth_getLogs", [
          { fromBlock: c.from, toBlock: c.to, address: USDC_ADDRESS, topics },
        ])
      )
    );

    const allLogs: any[] = [];
    for (const r of results) {
      if (r.status === "fulfilled" && Array.isArray(r.value)) {
        allLogs.push(...r.value);
      }
    }

    let totalUsdc = BigInt(0);
    const usdcTransfers: { amount: number; txHash: string; block: number }[] = [];

    for (const log of allLogs) {
      const amount = BigInt(log.data);
      totalUsdc += amount;
      usdcTransfers.push({
        amount: Number(amount) / 1e6,
        txHash: log.transactionHash,
        block: parseInt(log.blockNumber, 16),
      });
    }

    const totalUsdcAmount = Number(totalUsdc) / 1e6;

    res.setHeader("Cache-Control", "s-maxage=15, stale-while-revalidate=30");

    return res.status(200).json({
      address: senderAddress,
      presaleWallet: PRESALE_WALLET,
      usdc: {
        total: parseFloat(totalUsdcAmount.toFixed(2)),
        transfers: usdcTransfers,
        count: usdcTransfers.length,
      },
      eth: {
        total: 0,
        transfers: [],
        count: 0,
        note: "ETH transfers are tracked on-chain. For full ETH contribution history, verify on BaseScan.",
      },
      estimatedTokens: Math.floor(totalUsdcAmount / 0.02),
      totalContributions: usdcTransfers.length,
    });
  } catch (error) {
    console.error("Error fetching contribution:", error);
    return res.status(500).json({ error: "Failed to fetch contribution data" });
  }
}
