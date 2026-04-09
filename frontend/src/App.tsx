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
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import { ProtectedRoute } from "./components/auth/ProtectedRoute.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/crop-disease" element={<ProtectedRoute><CropDisease /></ProtectedRoute>} />
          <Route path="/crop-irrigation" element={<ProtectedRoute><CropIrrigation /></ProtectedRoute>} />
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
