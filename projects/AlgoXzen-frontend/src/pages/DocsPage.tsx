import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Footer from '@/components/Footer';
import { BookOpen, Code2, Download, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

const DocsPage = () => {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold gradient-text mb-4">
            Documentation & API
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive guides and API references for AlgoXzen integration
          </p>
        </motion.div>

        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="api">API Reference</TabsTrigger>
            <TabsTrigger value="wallet">Wallet Integration</TabsTrigger>
            <TabsTrigger value="sdk">SDK</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="glass-panel border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  What is AlgoXzen?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  AlgoXzen is an AI-powered blockchain companion built on Algorand that provides developers,
                  creators, and enterprises with comprehensive tools for document verification, smart contract
                  development, blockchain exploration, and on-chain auditing.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="glass-panel p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Key Features</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Document & Media Verification</li>
                      <li>• Smart Contract Generation</li>
                      <li>• Blockchain Query Bot</li>
                      <li>• Automated Security Auditing</li>
                    </ul>
                  </div>
                  <div className="glass-panel p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Technology Stack</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Algorand Blockchain</li>
                      <li>• Pera Wallet Integration</li>
                      <li>• IPFS Storage</li>
                      <li>• AI-Powered Analysis</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api">
            <Card className="glass-panel border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-primary" />
                  API Endpoints
                </CardTitle>
                <CardDescription>REST API for AlgoXzen integration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="glass-panel p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-mono">
                        POST
                      </span>
                      <code className="text-sm font-mono">/api/verify</code>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Upload and verify documents, returns IPFS hash and metadata
                    </p>
                  </div>
                  <div className="glass-panel p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-mono">
                        POST
                      </span>
                      <code className="text-sm font-mono">/api/mint</code>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Mint NFT/ASA from verified document
                    </p>
                  </div>
                  <div className="glass-panel p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-mono">
                        POST
                      </span>
                      <code className="text-sm font-mono">/api/audit</code>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Analyze smart contract for vulnerabilities
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wallet">
            <Card className="glass-panel border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  Pera Wallet Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Connect your Algorand wallet using Pera Wallet for secure transaction signing:
                  </p>
                  <div className="bg-card/50 p-4 rounded-lg border border-primary/20">
                    <code className="text-sm">
                      <pre className="text-muted-foreground">{`import { PeraWalletConnect } from '@perawallet/connect';

const peraWallet = new PeraWalletConnect();

// Connect wallet
const accounts = await peraWallet.connect();

// Sign transaction
const signedTxn = await peraWallet.signTransaction([txn]);`}</pre>
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sdk">
            <Card className="glass-panel border-primary/20">
              <CardHeader>
                <CardTitle>Developer SDK</CardTitle>
                <CardDescription>
                  React hooks and utilities for AlgoXzen integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-card/50 p-4 rounded-lg border border-primary/20">
                  <code className="text-sm">
                    <pre className="text-muted-foreground">{`import { useWallet } from '@/context/WalletContext';

function MyComponent() {
  const { accountAddress, isConnected, connect } = useWallet();
  
  return (
    <button onClick={connect}>
      {isConnected ? accountAddress : 'Connect Wallet'}
    </button>
  );
}`}</pre>
                  </code>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center">
          <Button size="lg" className="gradient-bg">
            <Download className="mr-2 h-5 w-5" />
            Download Full Documentation (PDF)
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DocsPage;
