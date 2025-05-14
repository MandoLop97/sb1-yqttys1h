
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatsCard from "./StatsCard";

type Business = Tables<"businesses">;

interface StatsTabProps {
  business: Business | null;
}

const StatsTab = ({ business }: StatsTabProps) => {
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

  // En un caso real, aquí se cargarían los datos de estadísticas desde Supabase
  useEffect(() => {
    if (business?.id) {
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
    }
  }, [business?.id, period]);

  if (!business) {
    return (
      <Card className="p-8 text-center">
        <CardHeader>
          <CardTitle>No hay negocio registrado</CardTitle>
        </CardHeader>
        <CardContent>
          Por favor, crea primero la información de tu negocio en la pestaña "Perfil de Negocio"
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
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

      {/* Sección de Domicilio y recolección */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Domicilio y recolección</CardTitle>
            <Select defaultValue="ventas">
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Filtro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ventas">Ventas</SelectItem>
                <SelectItem value="pedidos">Pedidos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total</p>
              <p className="text-2xl font-bold">${deliveryStats.ventas}</p>
            </div>
            <div></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard title="Ventas" value={deliveryStats.ventas} />
            <StatsCard title="Pedidos" value={deliveryStats.pedidos} type="number" />
            <StatsCard title="Envíos" value={deliveryStats.envios} />
            <StatsCard title="Ticket promedio" value={deliveryStats.ticketPromedio} />
          </div>
        </CardContent>
      </Card>

      {/* Sección de En mesas */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">En mesas</CardTitle>
            <Select defaultValue="ventas">
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Filtro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ventas">Ventas</SelectItem>
                <SelectItem value="pedidos">Pedidos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total</p>
              <p className="text-2xl font-bold">${tableStats.ventas}</p>
            </div>
            <div></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatsCard title="Ventas" value={tableStats.ventas} />
            <StatsCard title="Pedidos" value={tableStats.pedidos} type="number" />
            <StatsCard title="Ticket promedio" value={tableStats.ticketPromedio} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsTab;
