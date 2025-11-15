import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { WalletProvider } from "@/contexts/WalletContext";
import Home from "./pages/Home";
import Features from "./pages/Features";
import AITools from "./pages/AITools";
import Explorer from "./pages/Explorer";
import Audit from "./pages/Audit";
import Verify from "./pages/Verify";
import Docs from "./pages/Docs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WalletProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-1 pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/features" element={<Features />} />
              <Route path="/ai-tools" element={<AITools />} />
              <Route path="/explorer" element={<Explorer />} />
              <Route path="/audit" element={<Audit />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/docs" element={<Docs />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
    </WalletProvider>
  </QueryClientProvider>
);

export default App;
