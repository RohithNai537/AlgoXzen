import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Loader2, CheckCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/context/WalletContext';
import { registerDeveloper } from '@/lib/algorand';

const DeveloperRegistration = () => {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [registering, setRegistering] = useState(false);
  const [txId, setTxId] = useState('');
  const { toast } = useToast();
  const { peraWallet, accountAddress, isConnected } = useWallet();

  const handleRegister = async () => {
    if (!username.trim()) {
      toast({
        title: 'Username Required',
        description: 'Please enter a username',
        variant: 'destructive',
      });
      return;
    }

    if (!isConnected || !accountAddress) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your Pera Wallet first',
        variant: 'destructive',
      });
      return;
    }

    try {
      setRegistering(true);

      const transactionId = await registerDeveloper(
        peraWallet,
        accountAddress,
        username
      );

      setTxId(transactionId);

      toast({
        title: 'Registration Successful!',
        description: `Welcome ${username}! Transaction confirmed.`,
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration Failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setRegistering(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <UserPlus className="h-4 w-4" />
          Register as Developer
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-panel border-primary/20">
        <DialogHeader>
          <DialogTitle>Register as AlgoXzen Developer</DialogTitle>
          <DialogDescription>
            Register your wallet on-chain to start verifying documents and earning rewards
          </DialogDescription>
        </DialogHeader>

        {!txId ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={registering}
              />
            </div>

            {isConnected && (
              <div className="p-3 glass-panel rounded-lg">
                <p className="text-xs text-muted-foreground">Connected Wallet:</p>
                <p className="text-sm font-mono break-all">{accountAddress}</p>
              </div>
            )}

            <Button
              onClick={handleRegister}
              disabled={registering || !isConnected}
              className="w-full gradient-bg"
            >
              {registering ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Register On-Chain
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 glass-panel rounded-lg border-2 border-green-500/50 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="text-lg font-medium text-green-500 mb-2">
                Registration Complete!
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                Welcome to AlgoXzen, {username}!
              </p>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground break-all">
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

            <Button
              onClick={() => {
                setOpen(false);
                setTxId('');
                setUsername('');
              }}
              className="w-full"
              variant="outline"
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DeveloperRegistration;
