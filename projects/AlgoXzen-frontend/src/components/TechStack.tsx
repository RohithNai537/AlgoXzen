import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

const techStack = [
  { name: 'Algorand', description: 'High-performance blockchain', color: 'from-primary to-secondary' },
  { name: 'Pera Wallet', description: 'Secure wallet integration', color: 'from-secondary to-accent' },
  { name: 'Algokit', description: 'Development toolkit', color: 'from-accent to-primary' },
  { name: 'PyTeal/Algopy', description: 'Smart contract languages', color: 'from-primary to-accent' },
  { name: 'IPFS', description: 'Decentralized storage', color: 'from-secondary to-primary' },
  { name: 'React + Vite', description: 'Modern frontend', color: 'from-accent to-secondary' },
];

const TechStack = () => {
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
            Built with <span className="text-gradient">Trusted Technology</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powered by industry-leading blockchain and AI technologies
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {techStack.map((tech, idx) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="glass-strong border-primary/20 h-full p-6 text-center hover:glow transition-all cursor-pointer group">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${tech.color} group-hover:scale-110 transition-transform`} />
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                  {tech.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {tech.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
