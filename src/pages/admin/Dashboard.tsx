
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";
import Sidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import StatsCard from "@/components/admin/StatsCard";
import { PieChart, TrendingUp, Users, Package } from "lucide-react";

type Business = Tables<"businesses">;

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<Business | null>(null);
  const [user, setUser] = useState<any>(null);
  const [period, setPeriod] = useState("today");
  
  const [deliveryStats, setDeliveryStats] = useState({
    ventas: 0,
    pedidos: 0,
    envios: 0,
    ticketPromedio: 0
  });
  
  const [tableStats, setTableStats] = useState({
    ventas: 0,
    pedidos: 0,
    ticketPromedio: 0
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/auth");
          return;
        }

        setUser(session.user);

        // Verificar rol de admin
        const { data: userData, error: roleError } = await supabase
          .from("usuarios_auth")
          .select("role")
          .eq("user_id", session.user.id)
          .single();

        if (roleError || userData?.role !== "admin") {
          await supabase.auth.signOut();
          navigate("/auth");
          return;
        }

        // Cargar datos del negocio
        const { data: businessData, error: businessError } = await supabase
          .from("businesses")
          .select("*")
          .eq("owner_id", session.user.id)
          .single();

        if (businessError && businessError.code !== "PGRST116") {
          throw businessError;
        }

        setBusiness(businessData || null);
        
        // Este es un mockup de datos para la demostración
        // En una implementación real, aquí cargarías datos desde la base de datos
        setDeliveryStats({
          ventas: 2500,
          pedidos: 15,
          envios: 120,
          ticketPromedio: 167
        });
        
        setTableStats({
          ventas: 1850,
          pedidos: 10,
          ticketPromedio: 185
        });
        
      } catch (error: any) {
        toast({
          title: "Error al cargar datos",
          description: error.message || "Por favor, inicia sesión nuevamente",
          variant: "destructive",
        });
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate, period]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-navy-900">
        <div className="bg-white dark:bg-navy-800 p-8 rounded-lg shadow-md flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-orange-500 border-b-orange-500 border-l-gray-200 border-r-gray-200 dark:border-l-gray-700 dark:border-r-gray-700 rounded-full animate-spin mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Cargando panel administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-navy-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <AdminHeader title="Panel de Control" businessName={business?.name || "Mi Negocio"} />
        
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="container mx-auto space-y-6 max-w-6xl">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Resumen de actividad</h2>
              <div className="w-[180px]">
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="h-9 text-sm bg-white dark:bg-navy-700 border-gray-200 dark:border-gray-700 shadow-sm">
                    <SelectValue placeholder="Seleccionar periodo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Hoy</SelectItem>
                    <SelectItem value="week">Esta semana</SelectItem>
                    <SelectItem value="month">Este mes</SelectItem>
                    <SelectItem value="year">Este año</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Sección de Domicilio y recolección */}
            <Card className="border-none shadow-md bg-white dark:bg-navy-800 overflow-hidden">
              <CardHeader className="pb-2 bg-gradient-to-r from-orange-50 to-white dark:from-orange-900/20 dark:to-navy-800 border-b dark:border-navy-700">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold text-navy-800 dark:text-white flex items-center gap-2">
                    <Package className="h-5 w-5 text-orange-500" />
                    Domicilio y recolección
                  </CardTitle>
                  <Select defaultValue="ventas">
                    <SelectTrigger className="w-[100px] h-8 text-sm bg-white/80 dark:bg-navy-700/80 border-gray-200 dark:border-gray-700">
                      <SelectValue placeholder="Filtro" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ventas">Ventas</SelectItem>
                      <SelectItem value="pedidos">Pedidos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-orange-50/50 dark:bg-orange-900/10 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Ingresos Totales</p>
                    <p className="text-3xl font-bold text-navy-800 dark:text-white">${deliveryStats.ventas}</p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12% comparado con ayer
                    </p>
                  </div>
                  <div></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatsCard title="Ventas" value={deliveryStats.ventas} icon={<PieChart className="h-4 w-4" />} />
                  <StatsCard title="Pedidos" value={deliveryStats.pedidos} type="number" icon={<Package className="h-4 w-4" />} />
                  <StatsCard title="Envíos" value={deliveryStats.envios} icon={<TrendingUp className="h-4 w-4" />} />
                  <StatsCard title="Ticket promedio" value={deliveryStats.ticketPromedio} icon={<Users className="h-4 w-4" />} />
                </div>
              </CardContent>
            </Card>
            
            {/* Sección de En mesas */}
            <Card className="border-none shadow-md bg-white dark:bg-navy-800 overflow-hidden">
              <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-navy-800 border-b dark:border-navy-700">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold text-navy-800 dark:text-white flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    En mesas
                  </CardTitle>
                  <Select defaultValue="ventas">
                    <SelectTrigger className="w-[100px] h-8 text-sm bg-white/80 dark:bg-navy-700/80 border-gray-200 dark:border-gray-700">
                      <SelectValue placeholder="Filtro" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ventas">Ventas</SelectItem>
                      <SelectItem value="pedidos">Pedidos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Ingresos Totales</p>
                    <p className="text-3xl font-bold text-navy-800 dark:text-white">${tableStats.ventas}</p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +8% comparado con ayer
                    </p>
                  </div>
                  <div></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatsCard title="Ventas" value={tableStats.ventas} icon={<PieChart className="h-4 w-4" />} />
                  <StatsCard title="Pedidos" value={tableStats.pedidos} type="number" icon={<Package className="h-4 w-4" />} />
                  <StatsCard title="Ticket promedio" value={tableStats.ticketPromedio} icon={<Users className="h-4 w-4" />} />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
