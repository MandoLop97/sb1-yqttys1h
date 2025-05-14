
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Tag, Percent, SlidersHorizontal } from "lucide-react";
import Sidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import ProductsTab from "@/components/admin/ProductsTab";
import { Tables } from "@/integrations/supabase/types";

type Business = Tables<"businesses">;

const Menu = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("productos");
  const [business, setBusiness] = useState<Business | null>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/auth");
          return;
        }

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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

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
        <AdminHeader title="Menú" businessName={business?.name} />
        
        <main className="flex-1 p-6">
          <div className="container mx-auto">
            <Tabs defaultValue="productos" value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="w-full mb-4 grid grid-cols-4 bg-gray-100 dark:bg-navy-800 p-1">
                <TabsTrigger value="productos" className="data-[state=active]:bg-white dark:data-[state=active]:bg-navy-700">
                  Productos
                </TabsTrigger>
                <TabsTrigger value="personalizaciones" className="data-[state=active]:bg-white dark:data-[state=active]:bg-navy-700">
                  Personalizaciones
                </TabsTrigger>
                <TabsTrigger value="promociones" className="data-[state=active]:bg-white dark:data-[state=active]:bg-navy-700">
                  Promociones
                </TabsTrigger>
                <TabsTrigger value="disponibilidad" className="data-[state=active]:bg-white dark:data-[state=active]:bg-navy-700">
                  Disponibilidad
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="productos">
                <ProductsTab businessId={business?.id} />
              </TabsContent>
              
              <TabsContent value="personalizaciones">
                <Card className="bg-white dark:bg-navy-800 border-none shadow-md">
                  <CardHeader>
                    <CardTitle className="text-navy-800 dark:text-white">Personalizaciones</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300">
                      Permite a tus clientes agregar extras, quitar ingredientes o escoger formas de preparación.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="bg-gray-100 dark:bg-navy-700 rounded-lg p-4 mb-6">
                      <Tag className="h-12 w-12 text-gray-500 dark:text-gray-400 mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-navy-800 dark:text-white">Crea personalizaciones para tus productos</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
                      Permite a tus clientes agregar extras, quitar ingredientes o escoger formas de preparación.
                    </p>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="mr-2 h-4 w-4" /> Nueva personalización
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="promociones">
                <Card className="bg-white dark:bg-navy-800 border-none shadow-md">
                  <CardHeader>
                    <CardTitle className="text-navy-800 dark:text-white">Promociones</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300">
                      Llama la atención de tus clientes con promociones y aumenta tus ventas.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="bg-gray-100 dark:bg-navy-700 rounded-lg p-4 mb-6">
                      <Percent className="h-12 w-12 text-gray-500 dark:text-gray-400 mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-navy-800 dark:text-white">Crea promociones atractivas para tus clientes</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
                      Llama la atención de tus clientes con promociones y aumenta tus ventas.
                    </p>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="mr-2 h-4 w-4" /> Nueva promoción
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="disponibilidad">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-white dark:bg-navy-800 border-none shadow-md">
                    <CardHeader>
                      <CardTitle className="text-navy-800 dark:text-white">Productos</CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-300">0 agotados</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex space-x-2 mb-4">
                        <Button variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900">Todos</Button>
                        <Button variant="ghost" className="text-gray-600 dark:text-gray-300">Agotados</Button>
                      </div>
                      
                      {business?.id && (
                        <div className="space-y-4">
                          {/* Lista de productos con toggle de disponibilidad */}
                          <div className="flex items-center justify-between py-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                                <img src="/placeholder.svg" alt="Producto" className="w-full h-full object-cover" />
                              </div>
                              <span className="text-navy-800 dark:text-white">Ejemplo de producto</span>
                            </div>
                            <div className="flex items-center">
                              <Button variant="ghost" size="sm" className="text-green-600 dark:text-green-400">
                                Disponibilidad
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-white dark:bg-navy-800 border-none shadow-md">
                    <CardHeader>
                      <CardTitle className="text-navy-800 dark:text-white">Personalizaciones</CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-300">0 agotados</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center py-10 text-center">
                        <div className="bg-gray-100 dark:bg-navy-700 rounded-lg p-4 mb-6">
                          <SlidersHorizontal className="h-12 w-12 text-gray-500 dark:text-gray-400 mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-navy-800 dark:text-white">Administra la disponibilidad de personalizaciones</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
                          Mantén tu menú actualizado ocultando las opciones no disponibles
                        </p>
                        <Button variant="outline" className="text-green-600 dark:text-green-400 border-green-200 dark:border-green-900">
                          Ir a personalizaciones
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Menu;
