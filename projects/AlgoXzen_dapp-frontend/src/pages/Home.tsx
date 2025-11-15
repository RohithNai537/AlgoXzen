import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCheck, Code, Search, Shield, ArrowRight, Sparkles, Database, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  const features = [
    {
      icon: <FileCheck className="w-8 h-8 text-primary" />,
      title: "Document & Media Verification",
      description: "Verify authenticity of documents, images, audio, and video files on-chain with cryptographic proof.",
    },
    {
      icon: <Code className="w-8 h-8 text-primary" />,
      title: "Smart Contract Assistant",
      description: "AI-powered contract generation in PyTeal and Algopy with real-time suggestions and debugging.",
    },
    {
      icon: <Search className="w-8 h-8 text-primary" />,
      title: "Blockchain Query Bot",
      description: "Natural language queries for blockchain data. Ask questions, get instant insights.",
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "On-Chain Auditor",
      description: "Automated security auditing for smart contracts with vulnerability detection and gas optimization.",
    },
  ];

  const techStack = [
    { name: "Algorand", logo: "🔷" },
    { name: "Pera Wallet", logo: "👛" },
    { name: "Algokit", logo: "🛠️" },
    { name: "Algopy", logo: "🐍" },
    { name: "IPFS", logo: "📦" },
    { name: "Python", logo: "🐍" },
    { name: "React", logo: "⚛️" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 backdrop-blur-sm border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Powered by AI & Blockchain</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                AlgoXzen
              </span>
              <br />
              <span className="text-foreground">AI-Powered Blockchain</span>
              <br />
              <span className="text-foreground">Developer Companion</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Build, verify, and explore on-chain assets with AI-driven insights. 
              The complete toolkit for Algorand developers and users.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/verify">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-background font-semibold group">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/features">
                <Button size="lg" variant="outline" className="border-primary/50 hover:bg-primary/10">
                  Watch Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </section>

      {/* Features Highlight */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build, audit, and deploy on Algorand
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-colors group">
                <CardHeader>
                  <div className="mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted Tech Stack</h2>
            <p className="text-muted-foreground">Built with industry-leading technologies</p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-colors min-w-[120px]"
              >
                <span className="text-4xl">{tech.logo}</span>
                <span className="text-sm font-medium">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
              <Database className="w-10 h-10 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold text-foreground mb-2">10K+</div>
              <div className="text-muted-foreground">Verified Assets</div>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
              <Shield className="w-10 h-10 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold text-foreground mb-2">500+</div>
              <div className="text-muted-foreground">Audited Contracts</div>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
              <Zap className="w-10 h-10 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold text-foreground mb-2">99.9%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold">
              Ready to Build on Algorand?
            </h2>
            <p className="text-xl text-muted-foreground">
              Connect your wallet and start verifying documents now.
            </p>
            <Link to="/verify">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-background font-semibold">
                Start Verifying
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
