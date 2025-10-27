import FileUpload from '@/components/FileUpload';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const VerifyMintPage = () => {
  const mockHistory = [
    { id: 'NFT-001', name: 'Certificate.pdf', status: 'verified', date: '2025-01-20', txId: 'ABC123...' },
    { id: 'NFT-002', name: 'Contract.docx', status: 'pending', date: '2025-01-19', txId: null },
    { id: 'NFT-003', name: 'Lecture.mp4', status: 'verified', date: '2025-01-18', txId: 'DEF456...' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold gradient-text mb-4">
            Verify & Mint NFTs
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tokenize your documents and media files as immutable NFTs on Algorand
          </p>
        </motion.div>

        <div className="mb-12">
          <FileUpload />
        </div>

        <Card className="glass-panel border-primary/20">
          <CardHeader>
            <CardTitle>Verification History</CardTitle>
            <CardDescription>
              Track all your verified and minted assets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockHistory.map((item) => (
                <div
                  key={item.id}
                  className="glass-panel p-4 rounded-lg flex items-center justify-between hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {item.status === 'verified' ? (
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    ) : (
                      <Clock className="h-8 w-8 text-yellow-500" />
                    )}
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.id} • {item.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={item.status === 'verified' ? 'default' : 'secondary'}
                    >
                      {item.status === 'verified' ? 'Verified ✅' : 'Pending ⏳'}
                    </Badge>
                    {item.txId && (
                      <Button variant="outline" size="sm">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View on Explorer
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default VerifyMintPage;
