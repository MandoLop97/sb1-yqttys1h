
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import OrdersTable from "@/components/admin/OrdersTable";

const Panel = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string>("Mi Negocio");

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

        // Obtener el ID del negocio del admin
        const { data: businessData, error: businessError } = await supabase
          .from("businesses")
          .select("id,name")
          .eq("owner_id", session.user.id)
          .single();

        if (businessError && businessError.code !== "PGRST116") {
          throw businessError;
        }

        if (businessData) {
          setBusinessId(businessData.id || null);
          setBusinessName(businessData.name || "Mi Negocio");
        }
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
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-navy-900">
        <div className="bg-white dark:bg-navy-800 p-8 rounded-lg shadow-md flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-orange-500 border-b-orange-500 border-l-gray-200 border-r-gray-200 dark:border-l-gray-700 dark:border-r-gray-700 rounded-full animate-spin mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-navy-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <AdminHeader title="Panel" businessName={businessName} />
        
        <main className="flex-1 p-6">
          <div className="container mx-auto">
            <Tabs defaultValue="domicilio" className="w-full">
              <TabsList className="mb-4 grid grid-cols-2 bg-gray-100 dark:bg-navy-800 p-1">
                <TabsTrigger value="domicilio" className="data-[state=active]:bg-white dark:data-[state=active]:bg-navy-700">
                  Domicilios y recolección
                </TabsTrigger>
                <TabsTrigger value="mesas" className="data-[state=active]:bg-white dark:data-[state=active]:bg-navy-700">
                  En mesas
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="domicilio">
                {businessId ? (
                  <OrdersTable businessId={businessId} orderType="domicilio" />
                ) : (
                  <Card className="p-8 text-center bg-white dark:bg-navy-800 border-none shadow-md">
                    <CardContent>
                      No hay negocio asociado a tu cuenta. Por favor, configura tu negocio primero.
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="mesas">
                {businessId ? (
                  <OrdersTable businessId={businessId} orderType="mesa" />
                ) : (
                  <Card className="p-8 text-center bg-white dark:bg-navy-800 border-none shadow-md">
                    <CardContent>
                      No hay negocio asociado a tu cuenta. Por favor, configura tu negocio primero.
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Panel;
