import { motion } from 'framer-motion';
import { X, Bot } from 'lucide-react';
import { useChatStream } from '@/hooks/useChatStream';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';

interface ChatWindowProps {
  onClose: () => void;
}

const ChatWindow = ({ onClose }: ChatWindowProps) => {
  const { messages, isLoading, sendMessage } = useChatStream();

  const suggestions = [
    "Generate ARC4 Contract",
    "Explain ASA Transfer Flow",
    "Verify Document",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 100, scale: 0.9 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="fixed bottom-24 right-6 z-40 w-96 h-[600px] glass-strong rounded-2xl shadow-2xl flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="gradient-primary p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white">Lovable AI</h3>
            <p className="text-xs text-white/80">Your Blockchain Buddy 💎</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} role={msg.role} text={msg.content} />
        ))}
        {isLoading && <TypingIndicator />}
        
        {messages.length === 0 && !isLoading && (
          <div className="text-center text-muted-foreground mt-8">
            <Bot className="w-16 h-16 mx-auto mb-4 text-primary opacity-50" />
            <p className="mb-4">Hi! I'm Lovable AI, your Algorand assistant.</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => sendMessage(suggestion)}
                  className="px-3 py-1 text-xs rounded-full glass hover:glass-strong transition-all"
                >
                  ✨ {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </motion.div>
  );
};

export default ChatWindow;
