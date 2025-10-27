import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/context/WalletContext';
import { Wallet, LogOut, QrCode, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import logo from '@/assets/algoxzen-logo.png';
import peraQR from '@/assets/pera-wallet-qr.png';

const Navigation = () => {
  const location = useLocation();
  const { accountAddress, isConnected, connect, disconnect } = useWallet();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/features', label: 'Features' },
    { path: '/ai-tools', label: 'AI Tools' },
    { path: '/explorer', label: 'Explorer' },
    { path: '/audit', label: 'Audit' },
    { path: '/verify-mint', label: 'Verify & Mint' },
    { path: '/docs', label: 'Docs' },
  ];

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const handleConnect = () => {
    connect();
    setIsQROpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <motion.img 
              src={logo} 
              alt="AlgoXzen Logo" 
              className="w-10 h-10"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            />
            <motion.div
              className="text-2xl font-bold text-gradient hidden sm:block"
              whileHover={{ scale: 1.05 }}
            >
              AlgoXzen
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary relative ${
                  location.pathname === item.path
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                {item.label}
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Wallet Connect & Mobile Menu */}
          <div className="flex items-center gap-3">
            {isConnected ? (
              <div className="flex items-center gap-2">
                <div className="glass-strong px-4 py-2 rounded-lg border border-primary/30">
                  <span className="text-sm font-mono text-primary">
                    ✅ {formatAddress(accountAddress!)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={disconnect}
                  className="hover:bg-destructive/20 hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <Button
                  onClick={connect}
                  className="gradient-primary hover:glow hidden sm:flex"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect Wallet
                </Button>
                
                <Dialog open={isQROpen} onOpenChange={setIsQROpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="glass border-primary/50 hidden sm:flex"
                    >
                      <QrCode className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass-strong border-primary/30">
                    <DialogHeader>
                      <DialogTitle className="text-gradient text-center">
                        Scan QR Code with Pera Wallet
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-4 py-4">
                      <img 
                        src={peraQR} 
                        alt="Pera Wallet QR Code" 
                        className="w-64 h-64 rounded-xl border-2 border-primary/30"
                      />
                      <p className="text-sm text-muted-foreground text-center max-w-xs">
                        Open Pera Wallet mobile app and scan this QR code to connect
                      </p>
                      <Button 
                        onClick={handleConnect}
                        className="gradient-primary w-full"
                      >
                        Or Connect via Browser Extension
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 flex flex-col gap-3">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? 'bg-primary/20 text-primary'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                {!isConnected && (
                  <Button
                    onClick={() => {
                      connect();
                      setIsMobileMenuOpen(false);
                    }}
                    className="gradient-primary"
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Wallet
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navigation;
