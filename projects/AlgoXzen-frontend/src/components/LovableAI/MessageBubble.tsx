import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  text: string;
}

const MessageBubble = ({ role, text }: MessageBubbleProps) => {
  const isAssistant = role === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isAssistant ? '' : 'flex-row-reverse'}`}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isAssistant ? 'gradient-primary' : 'bg-muted'
      }`}>
        {isAssistant ? (
          <Bot className="w-5 h-5 text-white" />
        ) : (
          <User className="w-5 h-5 text-foreground" />
        )}
      </div>
      <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
        isAssistant 
          ? 'glass-strong text-foreground' 
          : 'bg-primary text-primary-foreground'
      }`}>
        <p className="text-sm whitespace-pre-wrap">{text}</p>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
