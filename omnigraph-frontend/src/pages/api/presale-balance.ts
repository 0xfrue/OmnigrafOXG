import type { NextApiRequest, NextApiResponse } from "next";
import { Connection, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";

const PRESALE_WALLET = new PublicKey(
  process.env.NEXT_PUBLIC_PRESALE_WALLET || "663atiZucS388vR1i1p7vQAt5EHtLLMxf885FVLJmkgf"
);
const USDC_MINT = new PublicKey(
  process.env.NEXT_PUBLIC_USDC_MINT || "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
);
const RPC = process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.mainnet-beta.solana.com";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const connection = new Connection(RPC, { commitment: "confirmed" });

    const [lamports, usdcAta] = await Promise.all([
      connection.getBalance(PRESALE_WALLET),
      getAssociatedTokenAddress(USDC_MINT, PRESALE_WALLET),
    ]);

    let usdc = 0;
    try {
      const tokenAcct = await connection.getTokenAccountBalance(usdcAta);
      usdc = Number(tokenAcct.value.uiAmount || 0);
    } catch {
      // ATA may not exist yet — treat as 0
      usdc = 0;
    }

    const sol = lamports / 1_000_000_000;

    res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");
    return res.status(200).json({
      wallet: PRESALE_WALLET.toBase58(),
      sol: parseFloat(sol.toFixed(6)),
      usdc: parseFloat(usdc.toFixed(2)),
    });
  } catch (error) {
    console.error("Error fetching Solana presale balance:", error);
    return res.status(500).json({ error: "Failed to fetch balance" });
  }
}
