import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Footer from '@/components/Footer';
import { Gift, Loader2, CheckCircle, ExternalLink, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/context/WalletContext';
import { sendReward } from '@/lib/algorand';

const AdminRewardsPage = () => {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [sending, setSending] = useState(false);
  const [txId, setTxId] = useState('');
  const { toast } = useToast();
  const { peraWallet, accountAddress, isConnected } = useWallet();

  const handleSendReward = async () => {
    if (!recipientAddress || !amount) {
      toast({
        title: 'Missing Information',
        description: 'Please enter recipient address and amount',
        variant: 'destructive',
      });
      return;
    }

    if (!isConnected || !accountAddress) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your admin wallet',
        variant: 'destructive',
      });
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSending(true);

      const transactionId = await sendReward(
        peraWallet,
        accountAddress,
        recipientAddress,
        amountNum
      );

      setTxId(transactionId);

      toast({
        title: 'Reward Sent!',
        description: `${amount} ALGO sent to developer`,
      });

      // Reset form
      setRecipientAddress('');
      setAmount('');
    } catch (error) {
      console.error('Reward sending error:', error);
      toast({
        title: 'Transaction Failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
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
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold gradient-text">
              Admin Rewards
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Send ALGO rewards to verified developers on-chain
          </p>
        </motion.div>

        <Card className="glass-panel border-primary/20 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              Send Developer Reward
            </CardTitle>
            <CardDescription>
              Reward developers for verified contributions and smart contract work
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Wallet Address</Label>
              <Input
                id="recipient"
                placeholder="Enter developer's Algorand address"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                disabled={sending}
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (ALGO)</Label>
              <Input
                id="amount"
                type="number"
                step="0.001"
                min="0.001"
                placeholder="Enter amount in ALGO"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={sending}
              />
              <p className="text-xs text-muted-foreground">
                Minimum: 0.001 ALGO (TestNet)
              </p>
            </div>

            {isConnected && (
              <div className="p-3 glass-panel rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Admin Wallet:</p>
                <p className="text-sm font-mono break-all">{accountAddress}</p>
              </div>
            )}

            <Button
              onClick={handleSendReward}
              disabled={sending || !isConnected}
              className="w-full gradient-bg"
            >
              {sending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Reward...
                </>
              ) : (
                <>
                  <Gift className="mr-2 h-4 w-4" />
                  Send Reward
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {txId && (
          <Card className="glass-panel border-green-500/50">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                <p className="text-lg font-medium text-green-500">
                  Reward Sent Successfully!
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground break-all">
                    Transaction ID: {txId.substring(0, 30)}...
                  </p>
                  <a
                    href={`https://testnet.algoexplorer.io/tx/${txId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center justify-center gap-1"
                  >
                    View on AlgoExplorer <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 p-4 glass-panel rounded-lg border-yellow-500/50">
          <p className="text-sm text-yellow-500 font-medium mb-2">⚠️ Admin Access Required</p>
          <p className="text-xs text-muted-foreground">
            This page is for AlgoXzen administrators only. Make sure you're connected with the authorized admin wallet.
            All reward transactions are recorded on-chain and visible in Pera Wallet transaction history.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminRewardsPage;
