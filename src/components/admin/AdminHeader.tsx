
import React from "react";
import { useNavigate } from "react-router-dom";
import { CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface AdminHeaderProps {
  title: string;
  businessName?: string;
}

const AdminHeader = ({ title, businessName = "Mi Negocio" }: AdminHeaderProps) => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      });
      navigate("/auth");
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cerrar sesión",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-white dark:bg-navy-800 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-navy-800 dark:text-white">{title}</h1>
          {businessName && (
            <span className="bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 text-xs px-2 py-1 rounded-full font-medium">
              {businessName}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-gray-50 dark:bg-navy-700 px-3 py-1.5 rounded-full">
            <CalendarClock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          </div>
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-700"
          >
            Cerrar sesión
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
