import { useState } from 'react';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

export const useLovableAI = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = { role: 'user', text };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      // Mock AI response for now
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      let response = '';
      const lowerText = text.toLowerCase();
      
      if (lowerText.includes('arc4') || lowerText.includes('contract')) {
        response = "I can help you generate ARC4 smart contracts! ARC4 contracts on Algorand are stateful applications that can store data and execute complex logic. Would you like me to create a template for a specific use case like DAO, NFT minting, or escrow?";
      } else if (lowerText.includes('nft') || lowerText.includes('asa')) {
        response = "NFTs on Algorand are implemented using ASA (Algorand Standard Assets). They're efficient, low-cost, and built into the protocol layer. I can help you create, transfer, or manage NFTs. What would you like to do?";
      } else if (lowerText.includes('verify') || lowerText.includes('document')) {
        response = "Document verification on AlgoXzen works by creating a cryptographic hash of your file and storing it on-chain as an NFT. This creates an immutable proof of authenticity and timestamp. Would you like to verify a document?";
      } else if (lowerText.includes('wallet') || lowerText.includes('pera')) {
        response = "Pera Wallet is Algorand's secure mobile wallet. To connect, scan the QR code with the Pera Wallet app. Your wallet will sign transactions securely without exposing your private keys. Ready to connect?";
      } else {
        response = "I'm Lovable AI 💖 — your Algorand blockchain assistant! I can help you with:\n\n• Smart contract generation & debugging\n• Document verification & NFT creation\n• Blockchain queries & analytics\n• Wallet integration & transactions\n\nWhat would you like to explore?";
      }

      const aiMessage: Message = { role: 'ai', text: response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI error:', error);
      const errorMessage: Message = {
        role: 'ai',
        text: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, sendMessage };
};
