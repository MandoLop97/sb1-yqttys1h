
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/admin/Dashboard";
import Panel from "./pages/admin/Panel";
import Menu from "./pages/admin/Menu";
import Plans from "./pages/admin/Plans";
import Share from "./pages/admin/Share";
import Settings from "./pages/admin/Settings";
import BusinessMenu from "./components/BusinessMenu";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            {/* Rutas adicionales del admin */}
            <Route path="/admin/panel" element={<Panel />} />
            <Route path="/admin/menu" element={<Menu />} />
            <Route path="/admin/share" element={<Share />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/admin/tutorials" element={<Dashboard />} />
            <Route path="/admin/plans" element={<Plans />} />
            {/* Ruta para el menú público personalizado */}
            <Route path="/menu/:id" element={<BusinessMenu />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
