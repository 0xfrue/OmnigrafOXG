import type { NextApiRequest, NextApiResponse } from "next";

interface WhitelistEntry {
  wallet_address: string;
  pledge_amount: string;
  payment_token: "USDC" | "ETH";
  email?: string;
  created_at: string;
}

// Supabase client setup
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Simple fetch wrapper for Supabase REST API
async function supabaseRequest(
  table: string,
  method: "GET" | "POST" | "PATCH",
  options?: {
    body?: object;
    filters?: string;
    select?: string;
  }
) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Supabase not configured");
  }

  let url = `${SUPABASE_URL}/rest/v1/${table}`;
  if (options?.filters) {
    url += `?${options.filters}`;
  }
  if (options?.select) {
    url += (options.filters ? "&" : "?") + `select=${options.select}`;
  }

  const headers: HeadersInit = {
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    "Prefer": method === "POST" ? "return=representation" : "return=minimal",
  };

  const response = await fetch(url, {
    method,
    headers,
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Supabase error: ${error}`);
  }

  // For GET requests or POST with return=representation
  if (method === "GET" || method === "POST") {
    return response.json();
  }
  return null;
}

// Validate Ethereum address
function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Validate email (optional)
function isValidEmail(email: string): boolean {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if Supabase is configured
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return res.status(500).json({
      error: "Database not configured. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables."
    });
  }

  // Handle GET request - return count
  if (req.method === "GET") {
    try {
      const entries = await supabaseRequest("whitelist", "GET", {
        select: "id"
      });
      return res.status(200).json({
        count: Array.isArray(entries) ? entries.length : 0,
        message: "Whitelist stats retrieved successfully"
      });
    } catch (error) {
      console.error("Error fetching whitelist count:", error);
      return res.status(500).json({ error: "Failed to fetch whitelist data" });
    }
  }

  // Handle POST request - add new entry
  if (req.method === "POST") {
    try {
      const { walletAddress, pledgeAmount, paymentToken, email } = req.body;

      // Validate required fields
      if (!walletAddress || !pledgeAmount || !paymentToken) {
        return res.status(400).json({
          error: "Missing required fields: walletAddress, pledgeAmount, paymentToken"
        });
      }

      // Validate wallet address
      if (!isValidAddress(walletAddress)) {
        return res.status(400).json({
          error: "Invalid wallet address format"
        });
      }

      // Validate pledge amount
      const amount = parseFloat(pledgeAmount);
      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({
          error: "Invalid pledge amount"
        });
      }

      // Validate payment token
      if (!["USDC", "ETH"].includes(paymentToken)) {
        return res.status(400).json({
          error: "Invalid payment token. Must be USDC or ETH"
        });
      }

      // Validate email if provided
      if (email && !isValidEmail(email)) {
        return res.status(400).json({
          error: "Invalid email format"
        });
      }

      const normalizedAddress = walletAddress.toLowerCase();

      // Check if wallet already exists
      const existing = await supabaseRequest("whitelist", "GET", {
        filters: `wallet_address=eq.${normalizedAddress}`,
        select: "id"
      });

      if (Array.isArray(existing) && existing.length > 0) {
        // Update existing entry using REST API
        const updateUrl = `${SUPABASE_URL}/rest/v1/whitelist?wallet_address=eq.${normalizedAddress}`;
        await fetch(updateUrl, {
          method: "PATCH",
          headers: {
            "apikey": SUPABASE_ANON_KEY!,
            "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal",
          },
          body: JSON.stringify({
            pledge_amount: pledgeAmount,
            payment_token: paymentToken,
            email: email || null,
            updated_at: new Date().toISOString(),
          }),
        });

        return res.status(200).json({
          message: "Whitelist entry updated successfully",
          updated: true
        });
      }

      // Insert new entry
      const newEntry: WhitelistEntry = {
        wallet_address: normalizedAddress,
        pledge_amount: pledgeAmount,
        payment_token: paymentToken,
        email: email || undefined,
        created_at: new Date().toISOString(),
      };

      await supabaseRequest("whitelist", "POST", { body: newEntry });

      // Get position (count of entries)
      const allEntries = await supabaseRequest("whitelist", "GET", {
        select: "id"
      });
      const position = Array.isArray(allEntries) ? allEntries.length : 1;

      return res.status(201).json({
        message: "Successfully added to whitelist!",
        position
      });

    } catch (error) {
      console.error("Error processing whitelist request:", error);
      return res.status(500).json({
        error: "Failed to save to whitelist. Please try again."
      });
    }
  }

  // Method not allowed
  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
