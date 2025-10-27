import { FileCheck, Code, Search, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: FileCheck,
    title: 'Document Verification',
    description: 'Upload and tokenize documents as NFTs with immutable on-chain proof',
    gradient: 'from-primary to-secondary',
  },
  {
    icon: Code,
    title: 'Smart Contract Generator',
    description: 'AI-assisted contract creation, debugging, and deployment on Algorand',
    gradient: 'from-secondary to-accent',
  },
  {
    icon: Search,
    title: 'Blockchain Explorer',
    description: 'Natural language queries to explore Algorand blockchain data',
    gradient: 'from-accent to-primary',
  },
  {
    icon: Shield,
    title: 'Contract Auditor',
    description: 'Automated security analysis and optimization for smart contracts',
    gradient: 'from-primary to-accent',
  },
];

const Features = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful <span className="text-gradient">AI Features</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to build, verify, and manage blockchain applications on Algorand
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="glass-strong hover:border-primary/40 border-primary/20 h-full transition-all duration-300 group cursor-pointer">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-base text-foreground/80">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
