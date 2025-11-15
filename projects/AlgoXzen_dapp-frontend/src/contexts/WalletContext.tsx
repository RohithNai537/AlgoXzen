import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { PeraWalletConnect } from "@perawallet/connect";

interface WalletContextType {
  peraWallet: PeraWalletConnect | null;
  accountAddress: string | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType>({
  peraWallet: null,
  accountAddress: null,
  isConnected: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [peraWallet] = useState(() => new PeraWalletConnect());
  const [accountAddress, setAccountAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Reconnect to session if exists
    peraWallet
      .reconnectSession()
      .then((accounts) => {
        if (accounts.length) {
          setAccountAddress(accounts[0]);
          setIsConnected(true);
        }
      })
      .catch(() => {
        // No session to reconnect
      });

    peraWallet.connector?.on("disconnect", () => {
      setAccountAddress(null);
      setIsConnected(false);
    });
  }, [peraWallet]);

  const connectWallet = async () => {
    try {
      const accounts = await peraWallet.connect();
      setAccountAddress(accounts[0]);
      setIsConnected(true);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const disconnectWallet = () => {
    peraWallet.disconnect();
    setAccountAddress(null);
    setIsConnected(false);
  };

  return (
    <WalletContext.Provider
      value={{
        peraWallet,
        accountAddress,
        isConnected,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
