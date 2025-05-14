
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QrCode } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

const TableQR = () => {
  const [tables] = useState([
    { id: 1, name: "Mesa 1", zone: "Comedor principal" },
    { id: 2, name: "Mesa 2", zone: "Comedor principal" },
  ]);
  
  const downloadQR = (tableId: number) => {
    toast({
      title: "Descarga iniciada",
      description: `El código QR para la mesa ${tableId} se está descargando`
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-1">QR de mesas</h2>
        <p className="text-sm text-gray-600">
          Utiliza los QR de mesas para que tus clientes realicen los pedidos directamente desde su mesa.
        </p>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-md border border-blue-100 my-4">
        <p className="text-sm text-blue-800">
          El cliente podrá escoger productos, hacer pedidos, llamar al mesero y solicitar la cuenta, todo desde el menú digital interactivo sin la intervención directa de un mesero. Recibe los pedidos y las alertas en el Panel de mesas.
        </p>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tables.map((table) => (
          <Card key={table.id} className="p-4">
            <div className="flex items-start">
              <div className="flex-1">
                <h3 className="font-medium">{table.name}</h3>
                <p className="text-sm text-gray-500">{table.zone}</p>
                
                <div className="flex items-center gap-2 mt-4">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => downloadQR(table.id)}
                    className="flex items-center gap-1"
                  >
                    <QrCode className="h-3.5 w-3.5" />
                    <span>Descargar QR</span>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    size="sm"
                  >
                    Ver QR
                  </Button>
                </div>
              </div>
              
              <div className="w-20 h-20 bg-gray-100 flex items-center justify-center rounded-md">
                <QrCode className="h-12 w-12 text-gray-400" />
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {tables.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No hay mesas configuradas</p>
          <Button className="mt-2">Configurar mesas</Button>
        </div>
      )}
    </div>
  );
};

export default TableQR;
