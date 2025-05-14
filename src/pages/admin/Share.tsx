
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import Sidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import DeliveryPickup from "@/components/admin/share/DeliveryPickup";
import TableQR from "@/components/admin/share/TableQR";
import MultiBranch from "@/components/admin/share/MultiBranch";

const Share = () => {
  const [activeTab, setActiveTab] = useState("delivery");
  
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-navy-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <AdminHeader title="Compartir" />
        
        <main className="flex-1 p-6">
          <div className="container mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6 grid grid-cols-3 gap-2 w-full bg-gray-100 dark:bg-navy-800 p-1">
                <TabsTrigger value="delivery" className="data-[state=active]:bg-white dark:data-[state=active]:bg-navy-700">
                  Domicilio/Recolección
                </TabsTrigger>
                <TabsTrigger value="tables" className="data-[state=active]:bg-white dark:data-[state=active]:bg-navy-700">
                  En mesas
                </TabsTrigger>
                <TabsTrigger value="multi" className="data-[state=active]:bg-white dark:data-[state=active]:bg-navy-700">
                  Link multi sucursal
                </TabsTrigger>
              </TabsList>
              
              <Card className="border-none shadow-md bg-white dark:bg-navy-800">
                <CardContent className="pt-6">
                  <TabsContent value="delivery">
                    <DeliveryPickup />
                  </TabsContent>
                  
                  <TabsContent value="tables">
                    <TableQR />
                  </TabsContent>
                  
                  <TabsContent value="multi">
                    <MultiBranch />
                  </TabsContent>
                </CardContent>
              </Card>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Share;
