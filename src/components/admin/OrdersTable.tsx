
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CustomerInfo {
  id: string;
  nombre: string;
  numero: string;
}

interface OrderItem {
  id: string;
  customer_id: string;
  estado: string;
  fecha_compra: string;
  descripcion: string | null;
  product_ids: string[];
  customer: CustomerInfo | null;
}

interface OrdersTableProps {
  businessId: string;
  orderType: "domicilio" | "mesa";
}

const OrdersTable = ({ businessId, orderType }: OrdersTableProps) => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar los pedidos
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from("history_orders_customer_business")
          .select("*")
          .eq("business_id", businessId)
          .eq("estado", orderType === "domicilio" ? "domicilio" : "mesa")
          .order("fecha_compra", { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          // Obtener información de los clientes
          const customerIds = data.map(order => order.customer_id);
          const { data: customersData, error: customersError } = await supabase
            .from("business_customer")
            .select("id, nombre, numero")
            .in("id", customerIds);

          if (customersError) throw customersError;

          // Combinar datos de órdenes con clientes
          const ordersWithCustomers = data.map(order => {
            const customer = customersData?.find(customer => customer.id === order.customer_id) || null;
            return { ...order, customer };
          });

          setOrders(ordersWithCustomers);
        } else {
          setOrders([]);
        }
      } catch (error: any) {
        toast({
          title: "Error al cargar pedidos",
          description: error.message || "No se pudieron cargar los pedidos",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (businessId) {
      fetchOrders();
    }
  }, [businessId, orderType]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("history_orders_customer_business")
        .update({ estado: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      toast({
        title: "Estado actualizado",
        description: `El pedido ha sido marcado como ${newStatus}`,
      });

      // Actualizar la lista de pedidos
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, estado: newStatus } : order
      ));
    } catch (error: any) {
      toast({
        title: "Error al actualizar estado",
        description: error.message || "No se pudo actualizar el estado del pedido",
        variant: "destructive",
      });
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "pendiente":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      case "preparando":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Preparando</Badge>;
      case "completado":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Completado</Badge>;
      case "cancelado":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d MMM, h:mm a", { locale: es });
    } catch (e) {
      return "Fecha inválida";
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Cargando pedidos...</div>;
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {orderType === "domicilio" ? "Pedidos a domicilio" : "Pedidos en mesa"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          No hay pedidos {orderType === "domicilio" ? "a domicilio" : "en mesa"} por el momento.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {orderType === "domicilio" ? "Pedidos a domicilio" : "Pedidos en mesa"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pedido</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="font-medium">{order.id.substring(0, 8)}...</div>
                  <div className="text-sm text-gray-500 truncate max-w-[200px]">
                    {order.descripcion || "Sin descripción"}
                  </div>
                </TableCell>
                <TableCell>{order.customer?.nombre || "Cliente desconocido"}</TableCell>
                <TableCell>{order.customer?.numero || "Sin número"}</TableCell>
                <TableCell>{formatDate(order.fecha_compra)}</TableCell>
                <TableCell>{renderStatusBadge(order.estado)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {order.estado === "pendiente" && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleUpdateStatus(order.id, "preparando")}
                      >
                        Preparando
                      </Button>
                    )}
                    {(order.estado === "pendiente" || order.estado === "preparando") && (
                      <>
                        <Button 
                          variant="default" 
                          size="sm" 
                          onClick={() => handleUpdateStatus(order.id, "completado")}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Completar
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleUpdateStatus(order.id, "cancelado")}
                        >
                          Cancelar
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default OrdersTable;
