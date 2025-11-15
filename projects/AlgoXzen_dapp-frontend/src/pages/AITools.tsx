import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Sparkles, FileCode, HelpCircle, Bug, Copy } from "lucide-react";
import { toast } from "sonner";

export default function AITools() {
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const templates = [
    { name: "ARC-4 Standard", description: "Standard Algorand token contract" },
    { name: "ASA Creator", description: "Create Algorand Standard Assets" },
    { name: "DAO Voting", description: "Decentralized voting mechanism" },
    { name: "Escrow Contract", description: "Secure fund escrow system" },
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setCode(`from pyteal import *

def approval_program():
    # ${prompt || "AI-generated smart contract"}
    
    on_creation = Seq([
        App.globalPut(Bytes("owner"), Txn.sender()),
        Return(Int(1))
    ])
    
    on_call = Seq([
        Assert(Txn.sender() == App.globalGet(Bytes("owner"))),
        Return(Int(1))
    ])
    
    program = Cond(
        [Txn.application_id() == Int(0), on_creation],
        [Txn.on_completion() == OnComplete.NoOp, on_call],
    )
    
    return program

def clear_state_program():
    return Return(Int(1))

if __name__ == "__main__":
    print(compileTeal(approval_program(), Mode.Application, version=7))`);
      setIsGenerating(false);
      toast.success("Contract generated successfully!");
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 backdrop-blur-sm border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">AI-Powered Development</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AI Developer Tools
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Generate, explain, and debug smart contracts with AI assistance
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Templates & Tools */}
          <div className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-primary" />
                  Contract Templates
                </CardTitle>
                <CardDescription>Quick start with pre-built templates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {templates.map((template, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start hover:bg-primary/10 hover:border-primary/50"
                    onClick={() => setPrompt(`Generate ${template.name}: ${template.description}`)}
                  >
                    <div className="text-left">
                      <div className="font-medium text-sm">{template.name}</div>
                      <div className="text-xs text-muted-foreground">{template.description}</div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary" />
                  Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-primary mt-0.5" />
                  <span>AI-powered code generation</span>
                </div>
                <div className="flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-primary mt-0.5" />
                  <span>Natural language explanations</span>
                </div>
                <div className="flex items-start gap-2">
                  <Bug className="w-4 h-4 text-primary mt-0.5" />
                  <span>Automatic debugging</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Code Editor */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle>Smart Contract Generator</CardTitle>
                <CardDescription>
                  Describe what you want to build and let AI generate the code
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Example: Generate a DAO contract with voting functionality and token-based governance..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px] bg-background/50 border-border"
                />
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-background"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Code className="w-4 h-4 mr-2" />
                      Generate Contract
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {code && (
              <Card className="bg-card/50 backdrop-blur-sm border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Generated Code</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      className="gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="pyteal">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="pyteal">PyTeal</TabsTrigger>
                      <TabsTrigger value="teal">TEAL</TabsTrigger>
                    </TabsList>
                    <TabsContent value="pyteal" className="mt-4">
                      <div className="bg-background/50 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-sm font-mono">
                          <code>{code}</code>
                        </pre>
                      </div>
                    </TabsContent>
                    <TabsContent value="teal" className="mt-4">
                      <div className="bg-background/50 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-sm font-mono text-muted-foreground">
                          <code>{`#pragma version 7\n// Compiled TEAL output\ntxn ApplicationID\nint 0\n==\nbnz create\n// ... rest of compiled code`}</code>
                        </pre>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {/* Code Explainer Section */}
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  Code Explainer
                </CardTitle>
                <CardDescription>
                  Paste your contract and get a simple explanation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste your PyTeal or TEAL code here..."
                  className="min-h-[100px] bg-background/50 border-border font-mono text-sm"
                />
                <Button variant="outline" className="w-full">
                  Explain Code
                </Button>
              </CardContent>
            </Card>

            {/* Debugging Assistant */}
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bug className="w-5 h-5 text-primary" />
                  Debugging Assistant
                </CardTitle>
                <CardDescription>
                  AI detects logic or syntax issues
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste code with errors or issues..."
                  className="min-h-[100px] bg-background/50 border-border font-mono text-sm"
                />
                <Button variant="outline" className="w-full">
                  Analyze & Debug
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
