import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { Code2, Sparkles, Bug, FileCode, Copy, Download, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const AIToolsPage = () => {
  const [generatedCode, setGeneratedCode] = useState('');
  const [debugResults, setDebugResults] = useState<any>(null);
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDebugging, setIsDebugging] = useState(false);
  const { toast } = useToast();

  const templates = [
    { name: 'ARC4 Contract', icon: FileCode, desc: 'Standard ARC4 smart contract' },
    { name: 'ASA Token', icon: Code2, desc: 'Algorand Standard Asset' },
    { name: 'DAO Contract', icon: Sparkles, desc: 'Decentralized governance' },
    { name: 'Escrow', icon: Bug, desc: 'Secure asset escrow' },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a contract description',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedCode('');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-contract`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ prompt, language: 'pyteal' }),
        }
      );

      if (!response.ok) {
        throw new Error('Generation failed');
      }

      const data = await response.json();
      setGeneratedCode(data.code);
      toast({
        title: 'Success',
        description: 'Smart contract generated successfully!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate contract. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDebug = async () => {
    if (!code.trim()) {
      toast({
        title: 'Error',
        description: 'Please paste some code to debug',
        variant: 'destructive',
      });
      return;
    }

    setIsDebugging(true);
    setDebugResults(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/debug-contract`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ code }),
        }
      );

      if (!response.ok) {
        throw new Error('Debugging failed');
      }

      const data = await response.json();
      setDebugResults(data);
      toast({
        title: 'Analysis Complete',
        description: 'Your code has been analyzed',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to analyze code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDebugging(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'Code copied to clipboard',
    });
  };

  const downloadCode = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold gradient-text mb-4">
            AI Developer Tools
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Generate, debug, and optimize Algorand smart contracts with AI assistance
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="glass-panel border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Smart Contract Generator
              </CardTitle>
              <CardDescription>
                Describe your contract in natural language
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Example: Generate a DAO contract with voting mechanism..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="bg-background/50"
              />
              <div className="grid grid-cols-2 gap-2">
                {templates.map((template) => (
                  <Button
                    key={template.name}
                    variant="outline"
                    className="justify-start"
                    onClick={() => setPrompt(`Generate ${template.name}`)}
                  >
                    <template.icon className="mr-2 h-4 w-4" />
                    {template.name}
                  </Button>
                ))}
              </div>
              <Button 
                className="w-full gradient-bg" 
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Contract'
                )}
              </Button>

              {generatedCode && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Generated Code:</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(generatedCode)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => downloadCode(generatedCode, 'contract.py')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    value={generatedCode}
                    readOnly
                    rows={12}
                    className="font-mono text-sm bg-background/50"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-panel border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bug className="h-5 w-5 text-primary" />
                Code Debugger
              </CardTitle>
              <CardDescription>
                Paste your PyTeal/Algopy code for AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your smart contract code here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={8}
                className="font-mono text-sm bg-background/50"
              />
              <Button 
                className="w-full gradient-bg"
                onClick={handleDebug}
                disabled={isDebugging}
              >
                {isDebugging ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze & Debug'
                )}
              </Button>

              {debugResults && (
                <div className="mt-4 space-y-3">
                  <p className="text-sm font-medium">Analysis Results:</p>
                  {debugResults.issues?.map((issue: any, idx: number) => (
                    <Alert
                      key={idx}
                      className={
                        issue.type === 'error'
                          ? 'border-red-500/50'
                          : issue.type === 'warning'
                          ? 'border-yellow-500/50'
                          : 'border-blue-500/50'
                      }
                    >
                      <AlertDescription>
                        <div className="space-y-1">
                          <p className="font-medium">
                            {issue.type.toUpperCase()}{issue.line ? ` (Line ${issue.line})` : ''}
                          </p>
                          <p>{issue.message}</p>
                          {issue.suggestion && (
                            <p className="text-sm text-muted-foreground">
                              💡 {issue.suggestion}
                            </p>
                          )}
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                  {debugResults.summary && (
                    <Alert className="border-primary/50">
                      <AlertDescription>
                        <p className="font-medium mb-1">Summary:</p>
                        <p>{debugResults.summary}</p>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="glass-panel border-primary/20">
          <CardHeader>
            <CardTitle>Code Explainer</CardTitle>
            <CardDescription>
              Upload or paste a smart contract to get a detailed explanation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 border-2 border-dashed border-primary/30 rounded-lg flex items-center justify-center hover:border-primary/50 transition-colors cursor-pointer">
              <div className="text-center">
                <Code2 className="h-12 w-12 text-primary mx-auto mb-2" />
                <p className="text-muted-foreground">Drop a .teal or .py file here</p>
                <p className="text-sm text-muted-foreground mt-1">or use the debugger above for analysis</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default AIToolsPage;
