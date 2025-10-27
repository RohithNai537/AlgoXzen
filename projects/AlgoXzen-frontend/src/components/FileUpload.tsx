import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, Image, Video, Music, Loader2, CheckCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/context/WalletContext';
import { createNFT, verifyDocument, calculateFileHash } from '@/lib/algorand';

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [minting, setMinting] = useState(false);
  const [fileHash, setFileHash] = useState('');
  const [preview, setPreview] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [verificationTxId, setVerificationTxId] = useState('');
  const [mintedAssetId, setMintedAssetId] = useState<number | null>(null);
  const [mintTxId, setMintTxId] = useState('');
  const { toast } = useToast();
  const { peraWallet, accountAddress, isConnected } = useWallet();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!isConnected) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your Pera Wallet first',
        variant: 'destructive',
      });
      return;
    }

    setFile(selectedFile);
    setUploading(true);
    setVerificationTxId('');
    setMintedAssetId(null);

    try {
      const hash = await calculateFileHash(selectedFile);
      setFileHash(hash);

      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(selectedFile);
      }

      toast({
        title: 'File Loaded',
        description: `Hash: ${hash.substring(0, 16)}...`,
      });
    } catch (error) {
      console.error('File processing error:', error);
      toast({
        title: 'Error',
        description: 'Failed to process file',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleVerify = async () => {
    if (!file || !fileHash || !isConnected || !accountAddress) {
      toast({
        title: 'Missing Information',
        description: 'Please upload a file and connect wallet',
        variant: 'destructive',
      });
      return;
    }

    try {
      setUploading(true);

      const txId = await verifyDocument(
        peraWallet,
        accountAddress,
        fileHash,
        `ipfs://algoxzen/${fileHash}`
      );

      setVerificationTxId(txId);

      toast({
        title: 'Document Verified!',
        description: `Transaction ID: ${txId.substring(0, 16)}...`,
      });
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: 'Verification Failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleMint = async () => {
    if (!file || !fileHash || !isConnected || !accountAddress) return;

    if (!verificationTxId) {
      toast({
        title: 'Not Verified',
        description: 'Please verify the document before minting',
        variant: 'destructive',
      });
      return;
    }

    try {
      setMinting(true);

      const assetName = title || file.name;
      const unitName = 'ALGOXZEN';
      const assetURL = `ipfs://algoxzen/${fileHash}`;
      const metadataHash = new TextEncoder().encode(fileHash.substring(0, 32));

      const { assetId, txId } = await createNFT(
        peraWallet,
        accountAddress,
        assetName,
        unitName,
        assetURL,
        metadataHash
      );

      setMintedAssetId(assetId);
      setMintTxId(txId);

      toast({
        title: 'NFT Minted Successfully!',
        description: `Asset ID: ${assetId}`,
      });
    } catch (error) {
      console.error('Minting error:', error);
      toast({
        title: 'Minting Failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setMinting(false);
    }
  };

  const getFileIcon = () => {
    if (!file) return <Upload className="h-16 w-16 text-primary" />;
    if (file.type.startsWith('image/')) return <Image className="h-16 w-16 text-primary" />;
    if (file.type.startsWith('video/')) return <Video className="h-16 w-16 text-primary" />;
    if (file.type.startsWith('audio/')) return <Music className="h-16 w-16 text-primary" />;
    return <FileText className="h-16 w-16 text-primary" />;
  };

  return (
    <Card className="glass-panel border-primary/20">
      <CardContent className="p-6 space-y-6">
        <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center">
          <input
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            id="file-input"
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
          />
          <label htmlFor="file-input" className="cursor-pointer">
            {getFileIcon()}
            <p className="mt-4 text-lg font-medium">
              {file ? file.name : 'Click to upload file'}
            </p>
            {fileHash && (
              <p className="mt-2 text-xs text-muted-foreground font-mono break-all">
                Hash: {fileHash.substring(0, 32)}...
              </p>
            )}
          </label>
        </div>

        {preview && (
          <div className="rounded-lg overflow-hidden">
            <img src={preview} alt="Preview" className="w-full max-h-64 object-contain" />
          </div>
        )}

        {file && !verificationTxId && (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter NFT title"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
              />
            </div>
            <Button
              onClick={handleVerify}
              disabled={uploading || !isConnected}
              className="w-full gradient-bg"
            >
              {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
              Verify Document
            </Button>
          </div>
        )}

        {verificationTxId && !mintedAssetId && (
          <div className="space-y-4">
            <div className="p-3 glass-panel rounded-lg">
              <p className="text-sm text-green-500 font-medium">✅ Verified On-Chain</p>
              <a
                href={`https://testnet.algoexplorer.io/tx/${verificationTxId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                View TX <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <Button onClick={handleMint} disabled={minting} className="w-full gradient-bg">
              {minting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
              Mint as NFT
            </Button>
          </div>
        )}

        {mintedAssetId && (
          <div className="p-4 glass-panel rounded-lg border-2 border-green-500/50">
            <p className="text-lg font-medium text-green-500 mb-2">🎉 NFT Minted!</p>
            <p className="text-sm text-muted-foreground mb-2">Asset ID: {mintedAssetId}</p>
            <a
              href={`https://testnet.algoexplorer.io/asset/${mintedAssetId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View NFT <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUpload;
