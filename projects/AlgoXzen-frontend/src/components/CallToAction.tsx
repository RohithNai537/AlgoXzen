import { Button } from '@/components/ui/button';
import { useWallet } from '@/context/WalletContext';
import { Wallet, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CallToAction = () => {
  const { isConnected, connect } = useWallet();
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-strong border-primary/30 rounded-2xl p-12 text-center relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary/20 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ready to <span className="text-gradient">Get Started?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect your wallet and start verifying documents, generating smart contracts, 
              and exploring the Algorand blockchain with AI assistance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isConnected ? (
                <Button 
                  size="lg"
                  onClick={connect}
                  className="gradient-primary text-white font-semibold px-8 py-6 text-lg glow hover:glow-strong"
                >
                  <Wallet className="mr-2 w-5 h-5" />
                  Connect Pera Wallet
                </Button>
              ) : (
                <Button 
                  size="lg"
                  onClick={() => navigate('/verify-mint')}
                  className="gradient-primary text-white font-semibold px-8 py-6 text-lg glow hover:glow-strong"
                >
                  Start Verifying Documents
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              )}
              
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/features')}
                className="glass border-primary/50 hover:glass-strong px-8 py-6 text-lg"
              >
                Explore Features
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
