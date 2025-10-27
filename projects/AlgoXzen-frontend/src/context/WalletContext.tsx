import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { PeraWalletConnect } from '@perawallet/connect';

interface WalletContextType {
  accountAddress: string | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  peraWallet: PeraWalletConnect;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const peraWallet = new PeraWalletConnect({
  shouldShowSignTxnToast: true,
});

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [accountAddress, setAccountAddress] = useState<string | null>(null);

  useEffect(() => {
    // Reconnect to session if exists
    peraWallet
      .reconnectSession()
      .then((accounts) => {
        peraWallet.connector?.on('disconnect', handleDisconnect);
        if (accounts.length) {
          setAccountAddress(accounts[0]);
        }
      })
      .catch((error) => {
        console.error('Error reconnecting:', error);
      });
  }, []);

  const connect = async () => {
    try {
      const accounts = await peraWallet.connect();
      peraWallet.connector?.on('disconnect', handleDisconnect);
      setAccountAddress(accounts[0]);
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  const disconnect = () => {
    peraWallet.disconnect();
    setAccountAddress(null);
  };

  const handleDisconnect = () => {
    setAccountAddress(null);
  };

  return (
    <WalletContext.Provider
      value={{
        accountAddress,
        isConnected: !!accountAddress,
        connect,
        disconnect,
        peraWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};
