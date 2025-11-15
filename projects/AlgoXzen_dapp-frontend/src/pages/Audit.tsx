import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, Shield, CheckCircle, AlertTriangle, XCircle, Download, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function Audit() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      toast.success("Contract uploaded successfully!");
    }
  };

  const handleAudit = () => {
    setIsAnalyzing(true);
    setProgress(0);
    
    // Simulate progressive analysis
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          setResults({
            passed: 32,
            warnings: 3,
            vulnerabilities: 1,
            issues: [
              {
                severity: "high",
                type: "Reentrancy Risk",
                line: 42,
                description: "External call before state update can lead to reentrancy attacks",
                recommendation: "Update state variables before making external calls",
              },
              {
                severity: "medium",
                type: "Gas Inefficiency",
                line: 67,
                description: "Loop iteration can be optimized to reduce gas costs",
                recommendation: "Consider using batch processing or caching",
              },
              {
                severity: "medium",
                type: "Access Control",
                line: 89,
                description: "Missing modifier for admin-only function",
                recommendation: "Add onlyOwner or similar access control modifier",
              },
              {
                severity: "low",
                type: "Code Style",
                line: 103,
                description: "Variable naming doesn't follow best practices",
                recommendation: "Use descriptive names for better readability",
              },
            ],
          });
          toast.success("Audit completed!");
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-500 border-red-500/50";
      case "medium":
        return "text-yellow-500 border-yellow-500/50";
      case "low":
        return "text-blue-500 border-blue-500/50";
      default:
        return "text-muted-foreground border-border";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <XCircle className="w-5 h-5" />;
      case "medium":
        return <AlertTriangle className="w-5 h-5" />;
      case "low":
        return <Shield className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Smart Contract Auditor
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Automated security auditing with AI-powered vulnerability detection
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  Upload Contract
                </CardTitle>
                <CardDescription>
                  Upload your .teal or .py smart contract file for analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="contract-upload"
                      accept=".teal,.py"
                    />
                    <label htmlFor="contract-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-medium mb-2">
                        {file ? file.name : "Click to upload contract"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        .teal or .py files only
                      </p>
                    </label>
                  </div>

                  {file && !isAnalyzing && !results && (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleAudit}
                        className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-background"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Run Security Audit
                      </Button>
                      <Button
                        variant="outline"
                        className="gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        AI Deep Scan
                      </Button>
                    </div>
                  )}

                  {isAnalyzing && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Analyzing contract...</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            {results && (
              <>
                <Card className="bg-card/50 backdrop-blur-sm border-border">
                  <CardHeader>
                    <CardTitle>Audit Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                        <div className="flex items-center gap-2 text-green-500 mb-2">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-semibold">Passed</span>
                        </div>
                        <div className="text-3xl font-bold">{results.passed}</div>
                        <div className="text-sm text-muted-foreground">Checks</div>
                      </div>
                      <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                        <div className="flex items-center gap-2 text-yellow-500 mb-2">
                          <AlertTriangle className="w-5 h-5" />
                          <span className="font-semibold">Warnings</span>
                        </div>
                        <div className="text-3xl font-bold">{results.warnings}</div>
                        <div className="text-sm text-muted-foreground">Found</div>
                      </div>
                      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                        <div className="flex items-center gap-2 text-red-500 mb-2">
                          <XCircle className="w-5 h-5" />
                          <span className="font-semibold">Critical</span>
                        </div>
                        <div className="text-3xl font-bold">{results.vulnerabilities}</div>
                        <div className="text-sm text-muted-foreground">Issues</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Detailed Findings</CardTitle>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="w-4 h-4" />
                        Export PDF
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {results.issues.map((issue: any, index: number) => (
                      <Alert key={index} className="bg-background/50">
                        <div className="flex items-start gap-4">
                          <div className={getSeverityColor(issue.severity)}>
                            {getSeverityIcon(issue.severity)}
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">{issue.type}</h4>
                              <Badge
                                variant="outline"
                                className={getSeverityColor(issue.severity)}
                              >
                                {issue.severity.toUpperCase()}
                              </Badge>
                            </div>
                            <AlertDescription className="text-muted-foreground">
                              Line {issue.line}: {issue.description}
                            </AlertDescription>
                            <div className="p-3 bg-muted/30 rounded-lg">
                              <p className="text-sm">
                                <span className="font-medium text-primary">Recommendation: </span>
                                {issue.recommendation}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Alert>
                    ))}
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="text-lg">Audit Capabilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                  <span>Security vulnerability detection</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                  <span>Gas optimization analysis</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                  <span>Code quality assessment</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                  <span>Best practices validation</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                  <span>Access control verification</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="text-lg">Common Vulnerabilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="p-2 bg-background/50 rounded">
                  Reentrancy attacks
                </div>
                <div className="p-2 bg-background/50 rounded">
                  Integer overflow/underflow
                </div>
                <div className="p-2 bg-background/50 rounded">
                  Access control issues
                </div>
                <div className="p-2 bg-background/50 rounded">
                  Logic errors
                </div>
                <div className="p-2 bg-background/50 rounded">
                  Gas limit vulnerabilities
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
