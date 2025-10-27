import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as algosdk from "npm:algosdk@3.5.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      accountAddress, 
      title, 
      description, 
      fileHash,
      ipfsUrl 
    } = await req.json();

    // Use TestNet for demonstration
    const algodToken = "";
    const algodServer = "https://testnet-api.algonode.cloud";
    const algodPort = 443;
    
    const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

    // Get suggested params
    const params = await algodClient.getTransactionParams().do();

    // Create ASA (Algorand Standard Asset) as NFT
    const assetName = title.substring(0, 32); // Max 32 bytes
    const unitName = "ALGOXZEN"; // Max 8 bytes
    const assetURL = ipfsUrl || `https://algoxzen.com/${fileHash}`;
    
    // Convert hash to bytes
    const encoder = new TextEncoder();
    const hashBytes = encoder.encode(fileHash.substring(0, 32));
    const assetMetadataHash = hashBytes;

    // Note: This creates an unsigned transaction
    // The frontend will sign it using Pera Wallet
    const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
      sender: accountAddress,
      total: 1, // NFT has supply of 1
      decimals: 0,
      assetName,
      unitName,
      assetURL,
      assetMetadataHash,
      manager: accountAddress,
      reserve: accountAddress,
      freeze: accountAddress,
      clawback: accountAddress,
      defaultFrozen: false,
      suggestedParams: params,
      note: encoder.encode(`AlgoXzen Verified: ${title}`)
    });

    // Return unsigned transaction for client to sign
    const txnBytes = txn.toByte();
    const txnB64 = btoa(String.fromCharCode(...txnBytes));

    return new Response(
      JSON.stringify({ 
        transaction: txnB64,
        message: "Transaction ready for signing"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Mint NFT error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
