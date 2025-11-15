import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Code, Download, ExternalLink, Wallet } from "lucide-react";

export default function Docs() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Documentation & API
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Complete technical documentation for developers and integrators
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="api">API Reference</TabsTrigger>
            <TabsTrigger value="wallet">Wallet Integration</TabsTrigger>
            <TabsTrigger value="sdk">SDK</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  What is AlgoXzen API?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  AlgoXzen API provides a comprehensive set of endpoints to interact with the Algorand blockchain,
                  verify documents, audit smart contracts, and mint on-chain assets programmatically.
                </p>
                <p>
                  Built on top of Algorand's infrastructure with AI-powered enhancements, our API makes it easy
                  to integrate blockchain verification and smart contract capabilities into your applications.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">Base URL</h4>
                    <code className="text-sm text-primary">https://api.algoxzen.com/v1</code>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">Authentication</h4>
                    <code className="text-sm text-primary">Bearer {"{API_KEY}"}</code>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">1. Get Your API Key</h4>
                  <p className="text-sm text-muted-foreground">
                    Sign up for an account and generate your API key from the dashboard.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">2. Install SDK</h4>
                  <div className="bg-background/50 p-4 rounded-lg font-mono text-sm">
                    npm install @algoxzen/sdk
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">3. Make Your First Request</h4>
                  <div className="bg-background/50 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <code>{`import { AlgoXzen } from '@algoxzen/sdk';

const client = new AlgoXzen({
  apiKey: 'your-api-key'
});

const result = await client.verify({
  file: myFile
});`}</code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Reference Tab */}
          <TabsContent value="api" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle>Endpoints</CardTitle>
                <CardDescription>Available API endpoints and their usage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Verify Endpoint */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-lg text-sm font-mono font-semibold">
                      POST
                    </span>
                    <code className="text-sm font-mono">/verify</code>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Verify uploaded files and generate cryptographic hash
                  </p>
                  <div className="bg-background/50 p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">Request Body:</p>
                    <pre className="text-xs font-mono overflow-x-auto">
{`{
  "file": "base64_encoded_file",
  "metadata": {
    "title": "Document Title",
    "description": "Optional description"
  }
}`}
                    </pre>
                  </div>
                </div>

                {/* Mint Endpoint */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-lg text-sm font-mono font-semibold">
                      POST
                    </span>
                    <code className="text-sm font-mono">/mint</code>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Mint NFT or ASA on Algorand blockchain
                  </p>
                  <div className="bg-background/50 p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">Request Body:</p>
                    <pre className="text-xs font-mono overflow-x-auto">
{`{
  "hash": "file_hash_from_verify",
  "type": "nft" | "asa",
  "metadata": {
    "name": "Asset Name",
    "description": "Asset Description"
  }
}`}
                    </pre>
                  </div>
                </div>

                {/* Audit Endpoint */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-lg text-sm font-mono font-semibold">
                      POST
                    </span>
                    <code className="text-sm font-mono">/audit</code>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Perform security audit on smart contract
                  </p>
                  <div className="bg-background/50 p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">Request Body:</p>
                    <pre className="text-xs font-mono overflow-x-auto">
{`{
  "contract": "contract_code",
  "type": "pyteal" | "teal"
}`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wallet Integration Tab */}
          <TabsContent value="wallet" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-primary" />
                  Pera Wallet Integration
                </CardTitle>
                <CardDescription>
                  Connect and interact with Pera Wallet in your application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Installation</h4>
                  <div className="bg-background/50 p-4 rounded-lg font-mono text-sm">
                    npm install @perawallet/connect
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Basic Setup</h4>
                  <div className="bg-background/50 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <code>{`import { PeraWalletConnect } from "@perawallet/connect";

const peraWallet = new PeraWalletConnect();

// Connect wallet
async function connectWallet() {
  const accounts = await peraWallet.connect();
  console.log("Connected:", accounts[0]);
}

// Sign transaction
async function signTransaction(txn) {
  const signedTxn = await peraWallet.signTransaction([txn]);
  return signedTxn;
}`}</code>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Using Algorand Signer</h4>
                  <div className="bg-background/50 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <code>{`import algosdk from "algosdk";

const algodClient = new algosdk.Algodv2(
  "",
  "https://testnet-api.algonode.cloud",
  ""
);

// Create transaction
const params = await algodClient.getTransactionParams().do();
const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
  from: senderAddress,
  to: receiverAddress,
  amount: 1000000,
  suggestedParams: params
});

// Sign with Pera Wallet
const signedTxn = await peraWallet.signTransaction([[{txn}]]);`}</code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SDK Tab */}
          <TabsContent value="sdk" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary" />
                  AlgoXzen SDK
                </CardTitle>
                <CardDescription>
                  Official SDK for integrating AlgoXzen into your applications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-background/50 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <code>{`import { AlgoXzen } from '@algoxzen/sdk';

const client = new AlgoXzen({
  apiKey: process.env.ALGOXZEN_API_KEY,
  network: 'testnet' // or 'mainnet'
});

// Example: Verify and mint
async function verifyAndMint(file) {
  // Step 1: Verify file
  const verification = await client.verify(file);
  
  // Step 2: Mint as NFT
  const mintResult = await client.mint({
    hash: verification.hash,
    type: 'nft',
    metadata: {
      name: 'My Verified Document',
      description: 'Important document'
    }
  });
  
  return mintResult.txId;
}

// Example: Audit contract
async function auditContract(contractCode) {
  const audit = await client.audit({
    contract: contractCode,
    type: 'pyteal'
  });
  
  return audit.report;
}`}</code>
                </div>

                <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-background">
                  <Download className="w-4 h-4 mr-2" />
                  Download Full Documentation PDF
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Additional Resources */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="text-lg">Additional Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-between" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  GitHub Repository
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <a href="https://docs.algorand.com" target="_blank" rel="noopener noreferrer">
                  Algorand Docs
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <a href="https://developer.algorand.org" target="_blank" rel="noopener noreferrer">
                  Developer Portal
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="text-lg">Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Need help? Our team is here to support you.
              </p>
              <div className="space-y-2 pt-2">
                <div>
                  <span className="font-medium text-foreground">Email:</span> support@algoxzen.com
                </div>
                <div>
                  <span className="font-medium text-foreground">Telegram:</span> @AlgoXzenBot
                </div>
                <div>
                  <span className="font-medium text-foreground">Discord:</span> AlgoXzen Community
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
