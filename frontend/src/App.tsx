import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import CropDisease from "./pages/CropDisease.tsx";
import CropIrrigation from "./pages/CropIrrigation.tsx";
import Schemes from "./pages/Schemes.tsx";
import NotFound from "./pages/NotFound.tsx";
import { FloatingBot } from "./components/hal-ai/FloatingBot.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/crop-disease" element={<CropDisease />} />
          <Route path="/crop-irrigation" element={<CropIrrigation />} />
          <Route path="/schemes" element={<Schemes />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <FloatingBot />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
