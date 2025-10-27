import { Button } from '@/components/ui/button';
import { Wallet, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@/context/WalletContext';
import heroImage from '@/assets/hero-bg.jpg';

const Hero = () => {
  const navigate = useNavigate();
  const { isConnected, connect } = useWallet();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 opacity-30"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-block mb-6"
          >
            <span className="px-4 py-2 rounded-full glass-strong text-primary font-semibold text-sm">
              ✨ Powered by Algorand + AI
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="text-gradient">AlgoXzen</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto">
            AI-Powered Blockchain & Developer Companion
          </p>
          
          <p className="text-base md:text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Build, verify, and explore on-chain assets with AI-driven insights on Algorand
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={isConnected ? () => navigate('/verify-mint') : connect}
              className="gradient-primary text-white font-semibold px-8 py-6 text-lg glow hover:glow-strong transition-all"
            >
              <Wallet className="mr-2 w-5 h-5" />
              {isConnected ? 'Start Verifying' : 'Connect Pera Wallet'}
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/features')}
              className="glass border-primary/50 hover:glass-strong px-8 py-6 text-lg"
            >
              <Sparkles className="mr-2 w-5 h-5" />
              Explore Features
            </Button>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
          >
            {[
              { label: 'Documents Verified', value: '10K+' },
              { label: 'Smart Contracts', value: '500+' },
              { label: 'Active Users', value: '2.5K+' },
              { label: 'Audits Completed', value: '1K+' },
            ].map((stat, idx) => (
              <div key={idx} className="glass rounded-xl p-4">
                <div className="text-2xl md:text-3xl font-bold text-gradient mb-1">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-20 left-10 w-20 h-20 rounded-full gradient-primary opacity-20 blur-xl"
      />
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute bottom-20 right-10 w-32 h-32 rounded-full gradient-accent opacity-20 blur-xl"
      />
    </section>
  );
};

export default Hero;
