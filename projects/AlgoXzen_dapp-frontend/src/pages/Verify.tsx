import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileCheck, Hash, Coins, QrCode, Clock, CheckCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useWallet } from "@/contexts/WalletContext";
import algosdk from "algosdk";
import { algodClient, waitForConfirmation, getExplorerUrl, PLATFORM_FEE, PLATFORM_ADDRESS } from "@/lib/algorand";

export default function Verify() {
  const [file, setFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState("");
  const [isMinting, setIsMinting] = useState(false);
  const [txId, setTxId] = useState("");
  const [assetTitle, setAssetTitle] = useState("");
  const [assetDescription, setAssetDescription] = useState("");
  const { peraWallet, accountAddress, isConnected } = useWallet();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      
      // Generate actual SHA-256 hash
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      const hash = `SHA256:${hashHex}`;
      
      setFileHash(hash);
      toast.success("File uploaded and hash generated!");
    }
  };

  const handleMint = async () => {
    if (!isConnected || !accountAddress || !peraWallet) {
      toast.error("Please connect your Pera Wallet first!");
      return;
    }

    if (!assetTitle.trim()) {
      toast.error("Please enter an asset title!");
      return;
    }

    setIsMinting(true);

    try {
      const params = await algodClient.getTransactionParams().do();
      
      // Create ASA (Algorand Standard Asset) with metadata
      const note = new TextEncoder().encode(JSON.stringify({
        fileHash,
        fileName: file?.name,
        description: assetDescription,
        timestamp: new Date().toISOString()
      }));

      // Transaction 1: Platform fee payment
      const feeTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        sender: accountAddress,
        receiver: PLATFORM_ADDRESS,
        amount: PLATFORM_FEE,
        suggestedParams: params,
        note: new TextEncoder().encode("AlgoXzen Platform Fee")
      });

      // Transaction 2: Create ASA
      const asaTxn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
        sender: accountAddress,
        total: 1,
        decimals: 0,
        defaultFrozen: false,
        manager: accountAddress,
        reserve: accountAddress,
        freeze: accountAddress,
        clawback: accountAddress,
        unitName: "AXNFT",
        assetName: assetTitle,
        assetURL: `ipfs://${fileHash}`,
        assetMetadataHash: new Uint8Array(32), // In production, use actual IPFS hash
        suggestedParams: params,
        note
      });

      // Group transactions
      const txns = [feeTxn, asaTxn];
      algosdk.assignGroupID(txns);

      // Sign with Pera Wallet
      const signedTxns = await peraWallet.signTransaction([
        txns.map(txn => ({ txn }))
      ]);
      
      // Send to network
      const response = await algodClient.sendRawTransaction(signedTxns).do();
      const sentTxId = response.txid;
      
      toast.info("Transaction sent! Waiting for confirmation...");
      
      // Wait for confirmation
      await waitForConfirmation(sentTxId);
      
      setTxId(sentTxId);
      toast.success("Asset minted successfully on Algorand TestNet!");
      
    } catch (error: any) {
      console.error("Minting error:", error);
      toast.error(error.message || "Failed to mint asset");
    } finally {
      setIsMinting(false);
    }
  };

  const verificationHistory = [
    { file: "contract_v1.pdf", status: "Verified", date: "2025-01-10", txId: "TX1234ABCD" },
    { file: "certificate.png", status: "Verified", date: "2025-01-09", txId: "TX5678EFGH" },
    { file: "audio_proof.mp3", status: "Pending", date: "2025-01-08", txId: "" },
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Verify & Mint
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload documents and media to verify authenticity and mint as on-chain assets
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  File Upload
                </CardTitle>
                <CardDescription>
                  Upload documents, images, audio, or video files for verification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.png,.jpg,.jpeg,.mp3,.mp4,.wav"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-medium mb-2">
                        {file ? file.name : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        PDF, Images, Audio, Video (max 50MB)
                      </p>
                    </label>
                  </div>

                  {file && (
                    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileCheck className="w-5 h-5 text-primary" />
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-primary" />
                          File Hash
                        </Label>
                        <div className="bg-background/50 p-3 rounded-lg font-mono text-sm break-all">
                          {fileHash}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {file && (
              <Card className="bg-card/50 backdrop-blur-sm border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-primary" />
                    Mint as NFT / ASA
                  </CardTitle>
                  <CardDescription>
                    Tokenize your verified file on Algorand blockchain
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="nft">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="nft">NFT</TabsTrigger>
                      <TabsTrigger value="asa">ASA</TabsTrigger>
                    </TabsList>
                    <TabsContent value="nft" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Asset Title</Label>
                        <Input
                          id="title"
                          value={assetTitle}
                          onChange={(e) => setAssetTitle(e.target.value)}
                          placeholder="Enter asset title..."
                          className="bg-background/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                          id="description"
                          value={assetDescription}
                          onChange={(e) => setAssetDescription(e.target.value)}
                          placeholder="Enter description..."
                          className="bg-background/50"
                        />
                      </div>
                      <div className="p-3 bg-muted/30 rounded-lg text-sm space-y-1">
                        <p className="text-muted-foreground">Platform Fee: 0.3 ALGO</p>
                        <p className="text-muted-foreground">Network: Algorand TestNet</p>
                      </div>
                      <Button
                        onClick={handleMint}
                        disabled={isMinting || !isConnected}
                        className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-background"
                      >
                        {isMinting ? "Minting..." : isConnected ? "Mint on Algorand TestNet" : "Connect Wallet First"}
                      </Button>
                    </TabsContent>
                    <TabsContent value="asa" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="asset-name">Asset Name</Label>
                        <Input
                          id="asset-name"
                          placeholder="Enter asset name..."
                          className="bg-background/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="total-supply">Total Supply</Label>
                        <Input
                          id="total-supply"
                          type="number"
                          placeholder="1000"
                          className="bg-background/50"
                        />
                      </div>
                      <Button
                        onClick={handleMint}
                        disabled={isMinting}
                        className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-background"
                      >
                        {isMinting ? "Creating ASA..." : "Create ASA"}
                      </Button>
                    </TabsContent>
                  </Tabs>

                  {txId && (
                    <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <p className="text-sm font-medium text-green-500 mb-2">
                        ✓ Transaction Confirmed
                      </p>
                      <p className="text-xs text-muted-foreground break-all">
                        TxID: {txId}
                      </p>
                      <Button
                        variant="link"
                        className="p-0 h-auto text-primary mt-2"
                        asChild
                      >
                        <a 
                          href={getExplorerUrl(txId)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          View on AlgoExplorer TestNet
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-primary" />
                  QR Code
                </CardTitle>
                <CardDescription>Scan to verify</CardDescription>
              </CardHeader>
              <CardContent>
                {txId ? (
                  <div className="bg-background/50 p-8 rounded-lg flex items-center justify-center">
                    <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center">
                      <QrCode className="w-16 h-16 text-primary/50" />
                    </div>
                  </div>
                ) : (
                  <div className="bg-background/50 p-8 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">
                      QR code will appear after minting
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Recent Verifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {verificationHistory.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 bg-background/50 rounded-lg space-y-1"
                  >
                    <p className="text-sm font-medium truncate">{item.file}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{item.date}</span>
                      <span
                        className={
                          item.status === "Verified"
                            ? "text-green-500"
                            : "text-yellow-500"
                        }
                      >
                        {item.status}
                        {item.status === "Verified" && " ✓"}
                      </span>
                    </div>
                    {item.txId && (
                      <Button
                        variant="link"
                        className="p-0 h-auto text-xs text-primary"
                        asChild
                      >
                        <a href="#" className="flex items-center gap-1">
                          View
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
