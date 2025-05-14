
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import Sidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import GeneralSettings from "@/components/admin/settings/GeneralSettings";
import ShippingCosts from "@/components/admin/settings/ShippingCosts";
import PaymentMethods from "@/components/admin/settings/PaymentMethods";
import MenuSchedule from "@/components/admin/settings/MenuSchedule";
import TablesZones from "@/components/admin/settings/TablesZones";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  
  // Create a form instance that will be passed to each tab content
  // to ensure form components are properly wrapped
  const form = useForm();
  
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-navy-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <AdminHeader title="Ajustes" />
        
        <main className="flex-1 p-6">
          <div className="container mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full mb-6 grid grid-cols-5 gap-2 bg-gray-100 dark:bg-navy-800 p-1">
                <TabsTrigger value="general" className="data-[state=active]:bg-white dark:data-[state=active]:bg-navy-700">
                  General
                </TabsTrigger>
                <TabsTrigger value="shipping" className="data-[state=active]:bg-white dark:data-[state=active]:bg-navy-700">
                  Costos de envío
                </TabsTrigger>
                <TabsTrigger value="payment" className="data-[state=active]:bg-white dark:data-[state=active]:bg-navy-700">
                  Métodos de pago
                </TabsTrigger>
                <TabsTrigger value="schedule" className="data-[state=active]:bg-white dark:data-[state=active]:bg-navy-700">
                  Horarios de menús
                </TabsTrigger>
                <TabsTrigger value="tables" className="data-[state=active]:bg-white dark:data-[state=active]:bg-navy-700">
                  Zonas y mesas
                </TabsTrigger>
              </TabsList>
              
              <Card className="p-4 border-none shadow-md bg-white dark:bg-navy-800">
                {/* Each TabContent now has access to the Form via context */}
                <Form {...form}>
                  <TabsContent value="general">
                    <GeneralSettings />
                  </TabsContent>
                  
                  <TabsContent value="shipping">
                    <ShippingCosts />
                  </TabsContent>
                  
                  <TabsContent value="payment">
                    <PaymentMethods />
                  </TabsContent>
                  
                  <TabsContent value="schedule">
                    <MenuSchedule />
                  </TabsContent>
                  
                  <TabsContent value="tables">
                    <TablesZones />
                  </TabsContent>
                </Form>
              </Card>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
