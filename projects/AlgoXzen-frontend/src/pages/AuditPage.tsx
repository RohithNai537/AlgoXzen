import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Footer from '@/components/Footer';
import { Upload, Shield, AlertTriangle, CheckCircle2, XCircle, Download, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/context/WalletContext';
import { submitAudit, calculateFileHash } from '@/lib/algorand';

const AuditPage = () => {
  const [auditResults, setAuditResults] = useState<any>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileHash, setFileHash] = useState('');
  const [auditStatus, setAuditStatus] = useState<'idle' | 'analyzing' | 'submitting' | 'approved' | 'failed'>('idle');
  const [blockchainTxId, setBlockchainTxId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { peraWallet, accountAddress, isConnected } = useWallet();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isConnected) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your Pera Wallet first',
        variant: 'destructive',
      });
      return;
    }

    setFileName(file.name);
    setIsAuditing(true);
    setAuditResults(null);
    setAuditStatus('analyzing');
    setBlockchainTxId('');

    try {
      // Calculate file hash
      const hash = await calculateFileHash(file);
      setFileHash(hash);

      // Perform AI audit
      const content = await file.text();

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/audit-file`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type || file.name.split('.').pop(),
            content: content,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Audit failed');
      }

      const data = await response.json();
      setAuditResults(data);
      setAuditStatus('idle');

      toast({
        title: 'AI Audit Complete',
        description: `Risk Score: ${data.riskScore}. Ready to submit on-chain.`,
      });
    } catch (error) {
      console.error('Audit error:', error);
      setAuditStatus('failed');
      toast({
        title: 'Error',
        description: 'Failed to audit file. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAuditing(false);
    }
  };

  const handleSubmitAudit = async () => {
    if (!auditResults || !fileHash || !isConnected || !accountAddress) {
      toast({
        title: 'Missing Information',
        description: 'Please complete AI audit first and connect wallet',
        variant: 'destructive',
      });
      return;
    }

    try {
      setAuditStatus('submitting');

      toast({
        title: '⏳ Audit Submission in Progress...',
        description: 'Please approve the transaction in your Pera Wallet',
      });

      const txId = await submitAudit(
        peraWallet,
        accountAddress,
        fileHash,
        auditResults.riskScore,
        auditResults.findings || []
      );

      setBlockchainTxId(txId);
      setAuditStatus('approved');

      toast({
        title: '✅ Audit Approved via Pera Wallet',
        description: `Transaction ID: ${txId.substring(0, 16)}...`,
      });
    } catch (error) {
      console.error('Blockchain audit error:', error);
      setAuditStatus('failed');

      toast({
        title: '❌ Audit Failed or Cancelled',
        description: error instanceof Error ? error.message : 'Transaction was rejected or failed',
        variant: 'destructive',
      });
    }
  };

  const downloadReport = () => {
    if (!auditResults) return;

    const report = `AlgoXzen Security Audit Report
File: ${fileName}
Date: ${new Date().toLocaleString()}
Risk Score: ${auditResults.riskScore}

Summary:
${auditResults.summary}

Findings:
${auditResults.findings?.map((f: any, idx: number) => 
  `${idx + 1}. [${f.severity.toUpperCase()}] ${f.category}
   ${f.description}
   Recommendation: ${f.recommendation}`
).join('\n\n')}
`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-red-500';
      default: return 'text-primary';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold gradient-text mb-4">
            Smart Contract Auditor
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            AI-powered security analysis for your Algorand smart contracts
          </p>
        </motion.div>

        <Card className="glass-panel border-primary/20 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Upload Contract
            </CardTitle>
            <CardDescription>
              Upload your .teal, .py, or any document file for automated security analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              accept=".teal,.py,.txt,.pdf,.doc,.docx"
            />
            <div 
              className="border-2 border-dashed border-primary/30 rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {isAuditing ? (
                <>
                  <Loader2 className="h-16 w-16 text-primary mx-auto mb-4 animate-spin" />
                  <p className="text-lg font-medium mb-2">Analyzing {fileName}...</p>
                  <p className="text-sm text-muted-foreground">This may take a moment</p>
                </>
              ) : (
                <>
                  <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Drop your contract file here</p>
                  <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                  <Button className="gradient-bg">
                    Select File
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {auditResults && (
          <Card className="glass-panel border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Audit Results</CardTitle>
                  <CardDescription>Security analysis for {fileName}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={downloadReport}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                  </Button>
                  {auditStatus !== 'approved' && (
                    <Button 
                      className="gradient-bg" 
                      size="sm" 
                      onClick={handleSubmitAudit}
                      disabled={auditStatus === 'submitting'}
                    >
                      {auditStatus === 'submitting' ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Shield className="mr-2 h-4 w-4" />
                          Submit Audit On-Chain
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Alert */}
              {auditStatus === 'submitting' && (
                <Alert className="border-yellow-500/50 bg-yellow-500/10">
                  <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
                  <AlertDescription className="ml-2">
                    <p className="font-medium">⏳ Audit Submission in Progress...</p>
                    <p className="text-sm">Please approve the transaction in your Pera Wallet</p>
                  </AlertDescription>
                </Alert>
              )}
              
              {auditStatus === 'approved' && blockchainTxId && (
                <Alert className="border-green-500/50 bg-green-500/10">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <AlertDescription className="ml-2">
                    <p className="font-medium">✅ Audit Approved via Pera Wallet</p>
                    <p className="text-sm">Transaction ID: {blockchainTxId.substring(0, 32)}...</p>
                    <a 
                      href={`https://testnet.algoexplorer.io/tx/${blockchainTxId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      View on AlgoExplorer →
                    </a>
                  </AlertDescription>
                </Alert>
              )}

              {auditStatus === 'failed' && (
                <Alert className="border-red-500/50 bg-red-500/10">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="ml-2">
                    <p className="font-medium">❌ Audit Failed or Cancelled</p>
                    <p className="text-sm">Transaction was rejected or failed. Please try again.</p>
                  </AlertDescription>
                </Alert>
              )}
              {/* Risk Score */}
              <div className="glass-panel p-6 rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-2">Risk Assessment</p>
                <p className={`text-4xl font-bold ${getRiskColor(auditResults.riskScore)}`}>
                  {auditResults.riskScore}
                </p>
              </div>

              {/* Summary */}
              {auditResults.summary && (
                <Alert className="border-primary/50">
                  <AlertDescription>
                    <p className="font-medium mb-2">Summary:</p>
                    <p>{auditResults.summary}</p>
                  </AlertDescription>
                </Alert>
              )}

              {/* Findings */}
              {auditResults.findings && auditResults.findings.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium">Findings:</p>
                  {auditResults.findings.map((finding: any, index: number) => (
                    <Alert
                      key={index}
                      className={`${
                        finding.severity === 'critical'
                          ? 'border-red-500/50'
                          : finding.severity === 'warning'
                          ? 'border-yellow-500/50'
                          : 'border-blue-500/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {finding.severity === 'critical' && (
                          <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                        )}
                        {finding.severity === 'warning' && (
                          <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                        )}
                        {finding.severity === 'info' && (
                          <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5" />
                        )}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant={
                              finding.severity === 'critical' 
                                ? 'destructive' 
                                : finding.severity === 'warning' 
                                ? 'secondary' 
                                : 'default'
                            }>
                              {finding.severity}
                            </Badge>
                            <Badge variant="outline">{finding.category}</Badge>
                          </div>
                          <AlertDescription>
                            <p className="font-medium">{finding.description}</p>
                            {finding.recommendation && (
                              <p className="text-sm text-muted-foreground mt-1">
                                💡 {finding.recommendation}
                              </p>
                            )}
                          </AlertDescription>
                        </div>
                      </div>
                    </Alert>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AuditPage;
