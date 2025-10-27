import Features from '@/components/Features';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

const FeaturesPage = () => {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold gradient-text mb-4">
            Powerful Features
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore the comprehensive suite of AI-powered blockchain tools designed for developers, creators, and enterprises.
          </p>
        </motion.div>
        <Features />
      </div>
      <Footer />
    </div>
  );
};

export default FeaturesPage;
