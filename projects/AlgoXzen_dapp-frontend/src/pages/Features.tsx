import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileCheck, Code, Search, Shield, Upload, CheckCircle, QrCode, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function Features() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 backdrop-blur-sm border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Comprehensive Feature Set</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to build, verify, and deploy on Algorand blockchain
          </p>
        </div>

        {/* Feature 1: Document Verification */}
        <section className="mb-20">
          <Card className="bg-card/50 backdrop-blur-sm border-border overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 p-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileCheck className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold">Document & Media Verification</h2>
                </div>
                
                <p className="text-muted-foreground text-lg">
                  Upload any document, image, audio, or video file to generate a cryptographic hash 
                  and mint it as an NFT or ASA on the Algorand blockchain.
                </p>
                
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                    <span>Support for PDF, images, audio, and video files</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                    <span>SHA-256 hash generation for tamper-proof verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                    <span>Mint as NFT or ASA with custom metadata</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                    <span>QR code generation for easy verification</span>
                  </li>
                </ul>
                
                <Link to="/verify">
                  <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-background">
                    Try Verification
                  </Button>
                </Link>
              </div>
              
              <div className="bg-muted/30 rounded-xl p-6 flex flex-col items-center justify-center gap-4">
                <Upload className="w-16 h-16 text-primary/50" />
                <p className="text-center text-sm text-muted-foreground">
                  Drag & drop interface for easy file uploads
                </p>
                <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
                  <div className="bg-background/50 p-3 rounded-lg text-center text-xs">PDF</div>
                  <div className="bg-background/50 p-3 rounded-lg text-center text-xs">Images</div>
                  <div className="bg-background/50 p-3 rounded-lg text-center text-xs">Audio</div>
                  <div className="bg-background/50 p-3 rounded-lg text-center text-xs">Video</div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Feature 2: Smart Contract Assistant */}
        <section className="mb-20">
          <Card className="bg-card/50 backdrop-blur-sm border-border overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 p-8">
              <div className="bg-muted/30 rounded-xl p-6 font-mono text-sm overflow-x-auto">
                <div className="text-primary mb-2"># AI Generated PyTeal Contract</div>
                <div className="text-muted-foreground">
                  <div>from pyteal import *</div>
                  <div className="mt-2">def approval_program():</div>
                  <div className="ml-4">return Seq([</div>
                  <div className="ml-8">Assert(Txn.sender() == creator),</div>
                  <div className="ml-8">App.globalPut("count", Int(0)),</div>
                  <div className="ml-8">Return(Int(1))</div>
                  <div className="ml-4">])</div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Code className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold">Smart Contract Developer Assistant</h2>
                </div>
                
                <p className="text-muted-foreground text-lg">
                  AI-powered code generation for PyTeal and Algopy smart contracts with 
                  real-time syntax highlighting and debugging assistance.
                </p>
                
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                    <span>Generate complete contracts from natural language</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                    <span>Pre-built templates for common use cases (DAO, Escrow, ASA)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                    <span>Real-time code explanation and documentation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                    <span>Integrated debugging and error detection</span>
                  </li>
                </ul>
                
                <Link to="/ai-tools">
                  <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-background">
                    Explore AI Tools
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </section>

        {/* Feature 3: Blockchain Explorer */}
        <section className="mb-20">
          <Card className="bg-card/50 backdrop-blur-sm border-border overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 p-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Search className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold">Blockchain Query Bot</h2>
                </div>
                
                <p className="text-muted-foreground text-lg">
                  Query Algorand blockchain using natural language. Ask questions and get 
                  instant insights about transactions, wallets, and smart contracts.
                </p>
                
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                    <span>Natural language query interface</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                    <span>Real-time blockchain data access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                    <span>Transaction filtering and export</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                    <span>Direct links to AlgoExplorer</span>
                  </li>
                </ul>
                
                <Link to="/explorer">
                  <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-background">
                    Open Explorer
                  </Button>
                </Link>
              </div>
              
              <div className="bg-muted/30 rounded-xl p-6 space-y-4">
                <div className="bg-background/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Example Query:</p>
                  <p className="font-medium">"Show last 5 transactions from wallet ABC..."</p>
                </div>
                <div className="space-y-2">
                  <div className="bg-primary/10 p-3 rounded-lg text-sm">
                    ✓ Transaction #1: Payment - 100 ALGO
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg text-sm">
                    ✓ Transaction #2: Asset Transfer
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg text-sm">
                    ✓ Transaction #3: App Call
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Feature 4: Smart Contract Auditor */}
        <section>
          <Card className="bg-card/50 backdrop-blur-sm border-border overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 p-8">
              <div className="bg-muted/30 rounded-xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-green-500">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">32 Checks Passed</span>
                </div>
                <div className="flex items-center gap-2 text-yellow-500">
                  <Shield className="w-5 h-5" />
                  <span className="font-semibold">3 Warnings Found</span>
                </div>
                <div className="flex items-center gap-2 text-red-500">
                  <Shield className="w-5 h-5" />
                  <span className="font-semibold">1 Vulnerability Detected</span>
                </div>
                <div className="mt-4 p-4 bg-background/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Issue: Reentrancy Risk</p>
                  <p className="text-xs">Line 42: External call before state update</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold">On-Chain Auditor</h2>
                </div>
                
                <p className="text-muted-foreground text-lg">
                  Automated security auditing for smart contracts with AI-powered vulnerability 
                  detection and gas optimization suggestions.
                </p>
                
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                    <span>Upload .teal or .py contract files</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                    <span>Comprehensive security vulnerability scanning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                    <span>Gas optimization recommendations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                    <span>Downloadable audit reports (PDF)</span>
                  </li>
                </ul>
                
                <Link to="/audit">
                  <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-background">
                    Audit Contract
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
