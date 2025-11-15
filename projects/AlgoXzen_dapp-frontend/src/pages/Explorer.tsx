import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, ExternalLink, Download, Filter } from "lucide-react";
import { toast } from "sonner";

export default function Explorer() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const mockTransactions = [
    {
      txId: "ABC123DEF456",
      type: "Payment",
      amount: "100 ALGO",
      from: "ALGO...XY12",
      to: "ALGO...AB34",
      date: "2025-01-10 14:30:25",
    },
    {
      txId: "GHI789JKL012",
      type: "Asset Transfer",
      amount: "50 ASA",
      from: "ALGO...CD56",
      to: "ALGO...EF78",
      date: "2025-01-10 14:28:15",
    },
    {
      txId: "MNO345PQR678",
      type: "App Call",
      amount: "-",
      from: "ALGO...GH90",
      to: "App #12345",
      date: "2025-01-10 14:25:10",
    },
    {
      txId: "STU901VWX234",
      type: "NFT Mint",
      amount: "1 NFT",
      from: "ALGO...IJ12",
      to: "ALGO...IJ12",
      date: "2025-01-10 14:20:05",
    },
    {
      txId: "YZA567BCD890",
      type: "Payment",
      amount: "250 ALGO",
      from: "ALGO...KL34",
      to: "ALGO...MN56",
      date: "2025-01-10 14:15:00",
    },
  ];

  const handleSearch = () => {
    if (query) {
      setResults(mockTransactions);
      toast.success("Query executed successfully!");
    }
  };

  const handleExport = () => {
    toast.success("Results exported to CSV!");
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Blockchain Explorer
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Query Algorand blockchain with natural language
          </p>
        </div>

        {/* Search Bar */}
        <Card className="bg-card/50 backdrop-blur-sm border-border mb-8">
          <CardHeader>
            <CardTitle>Natural Language Query</CardTitle>
            <CardDescription>
              Ask questions like: "Show last 5 transactions from wallet XYZ" or "Find all NFT mints this week"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder='Try: "Show recent payment transactions..." or "Find wallet transactions..."'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-background/50"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                onClick={handleSearch}
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-background shrink-0"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {results.length > 0 && (
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Query Results</CardTitle>
                  <CardDescription>{results.length} transactions found</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="w-4 h-4" />
                    Filter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={handleExport}
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((tx, index) => (
                      <TableRow key={index} className="hover:bg-muted/30">
                        <TableCell className="font-mono text-sm">{tx.txId}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              tx.type === "Payment"
                                ? "border-green-500/50 text-green-500"
                                : tx.type === "App Call"
                                ? "border-blue-500/50 text-blue-500"
                                : "border-primary/50 text-primary"
                            }
                          >
                            {tx.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{tx.amount}</TableCell>
                        <TableCell className="font-mono text-sm">{tx.from}</TableCell>
                        <TableCell className="font-mono text-sm">{tx.to}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {tx.date}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 text-primary hover:text-primary"
                            asChild
                          >
                            <a
                              href={`https://testnet.algoexplorer.io/tx/${tx.txId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View
                              <ExternalLink className="w-3 h-3" />
                            </a>
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

        {/* Example Queries */}
        {results.length === 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  View the latest transactions on the network
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setQuery("Show recent transactions");
                    setResults(mockTransactions);
                  }}
                >
                  Run Query
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">NFT Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Find all NFT mints and transfers
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setQuery("Show NFT mints");
                    setResults(mockTransactions.filter((tx) => tx.type === "NFT Mint"));
                  }}
                >
                  Run Query
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Smart Contracts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Explore smart contract interactions
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setQuery("Show app calls");
                    setResults(mockTransactions.filter((tx) => tx.type === "App Call"));
                  }}
                >
                  Run Query
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
