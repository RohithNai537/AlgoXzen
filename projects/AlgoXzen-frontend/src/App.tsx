import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "@/context/WalletContext";
import Navigation from "@/components/Navigation";
import Index from "./pages/Index";
import FeaturesPage from "./pages/FeaturesPage";
import AIToolsPage from "./pages/AIToolsPage";
import ExplorerPage from "./pages/ExplorerPage";
import AuditPage from "./pages/AuditPage";
import VerifyMintPage from "./pages/VerifyMintPage";
import DocsPage from "./pages/DocsPage";
import NotFound from "./pages/NotFound";

import AdminRewardsPage from "./pages/AdminRewardsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WalletProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Navigation />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/ai-tools" element={<AIToolsPage />} />
            <Route path="/explorer" element={<ExplorerPage />} />
            <Route path="/audit" element={<AuditPage />} />
            <Route path="/verify-mint" element={<VerifyMintPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/admin/rewards" element={<AdminRewardsPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </WalletProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
