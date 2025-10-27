import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Footer from '@/components/Footer';
import { Search, Download, ExternalLink, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const ExplorerPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!query.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a search query',
        variant: 'destructive',
      });
      return;
    }

    setIsSearching(true);
    setResults([]);

    try {
      // Use Algorand TestNet Indexer
      const indexerUrl = 'https://testnet-idx.algonode.cloud';
      
      // Determine if it's an address or transaction ID
      const isAddress = query.length === 58 && query.startsWith('A');
      const isTxId = query.length === 52;

      let response;
      if (isAddress) {
        response = await fetch(`${indexerUrl}/v2/accounts/${query}/transactions?limit=10`);
      } else if (isTxId) {
        response = await fetch(`${indexerUrl}/v2/transactions/${query}`);
      } else {
        // General search - look for transactions
        response = await fetch(`${indexerUrl}/v2/transactions?limit=10`);
      }

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      const transactions = data.transactions || (data.transaction ? [data.transaction] : []);

      const formattedResults = transactions.map((tx: any) => ({
        txId: tx.id,
        type: tx['tx-type'] || 'unknown',
        amount: tx['payment-transaction']?.amount || 0,
        date: new Date(tx['round-time'] * 1000).toLocaleDateString(),
        address: tx.sender,
        round: tx['confirmed-round'],
      }));

      setResults(formattedResults);

      toast({
        title: 'Success',
        description: `Found ${formattedResults.length} transactions`,
      });
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: 'Error',
        description: 'Failed to search blockchain. Please check your query.',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const exportCSV = () => {
    const csv = [
      ['TxID', 'Type', 'Amount', 'Date', 'Address', 'Round'].join(','),
      ...results.map(r => 
        [r.txId, r.type, r.amount, r.date, r.address, r.round].join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
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
            Blockchain Explorer
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Query Algorand TestNet blockchain in real-time
          </p>
        </motion.div>

        <Card className="glass-panel border-primary/20 mb-8">
          <CardHeader>
            <CardTitle>Search Query</CardTitle>
            <CardDescription>
              Enter an Algorand address (58 chars, starts with A) or transaction ID (52 chars)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter address or transaction ID..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 bg-background/50"
              />
              <Button 
                className="gradient-bg" 
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <Card className="glass-panel border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Results</CardTitle>
                  <CardDescription>Found {results.length} transactions</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={exportCSV}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>TxID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((result, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-mono text-sm">{result.txId.substring(0, 12)}...</TableCell>
                        <TableCell>{result.type}</TableCell>
                        <TableCell>{result.amount} µALGO</TableCell>
                        <TableCell>{result.date}</TableCell>
                        <TableCell className="font-mono text-sm">{result.address.substring(0, 12)}...</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => window.open(`https://testnet.explorer.perawallet.app/tx/${result.txId}`, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ExplorerPage;
