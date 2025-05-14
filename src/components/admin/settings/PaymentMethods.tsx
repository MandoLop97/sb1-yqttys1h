
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";

const PaymentMethods = () => {
  const [deliveryOptions, setDeliveryOptions] = useState({
    cash: true,
    card: false,
    transfer: false
  });
  
  const [pickupOptions, setPickupOptions] = useState({
    cash: true,
    card: false,
    transfer: false
  });
  
  const [tipsEnabled, setTipsEnabled] = useState(false);

  const handleSave = () => {
    toast({
      title: "Configuración guardada",
      description: "Los métodos de pago han sido actualizados"
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Métodos de pago para los clientes</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Delivery Options */}
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Envíos a domicilio</h3>
            <p className="text-sm text-gray-500">Desactivar todos deshabilita los pedidos domicilios</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="delivery-cash"
                checked={deliveryOptions.cash}
                onCheckedChange={(checked) => 
                  setDeliveryOptions({...deliveryOptions, cash: checked === true})
                }
              />
              <Label htmlFor="delivery-cash">Efectivo</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="delivery-card"
                checked={deliveryOptions.card}
                onCheckedChange={(checked) => 
                  setDeliveryOptions({...deliveryOptions, card: checked === true})
                }
              />
              <Label htmlFor="delivery-card">Pago con tarjeta</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="delivery-transfer"
                checked={deliveryOptions.transfer}
                onCheckedChange={(checked) => 
                  setDeliveryOptions({...deliveryOptions, transfer: checked === true})
                }
              />
              <Label htmlFor="delivery-transfer">Transferencia</Label>
            </div>
          </div>
        </div>
        
        {/* Pickup Options */}
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Recolección</h3>
            <p className="text-sm text-gray-500">Desactivar todos deshabilita los pedidos de recolección</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="pickup-cash"
                checked={pickupOptions.cash}
                onCheckedChange={(checked) => 
                  setPickupOptions({...pickupOptions, cash: checked === true})
                }
              />
              <Label htmlFor="pickup-cash">Efectivo</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="pickup-card"
                checked={pickupOptions.card}
                onCheckedChange={(checked) => 
                  setPickupOptions({...pickupOptions, card: checked === true})
                }
              />
              <Label htmlFor="pickup-card">Pago con tarjeta</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="pickup-transfer"
                checked={pickupOptions.transfer}
                onCheckedChange={(checked) => 
                  setPickupOptions({...pickupOptions, transfer: checked === true})
                }
              />
              <Label htmlFor="pickup-transfer">Transferencia</Label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline">Cancelar</Button>
        <Button onClick={handleSave}>Guardar</Button>
      </div>

      {/* Currency Settings */}
      <div className="border-t pt-6 space-y-4">
        <div>
          <h3 className="font-medium">Divisa</h3>
          <p className="text-sm text-gray-500">
            Para controlar la divisa que verán tus clientes ve a <span className="text-blue-500 cursor-pointer">Perfil</span>.
          </p>
          <div className="mt-4 p-3 border rounded-md bg-gray-50">
            Peso Mexicano (MXN $)
          </div>
        </div>
      </div>

      {/* Tips Settings */}
      <div className="border-t pt-6 space-y-4">
        <div>
          <h3 className="font-medium">Campo de propinas</h3>
          <p className="text-sm text-gray-500">Permite a los clientes introducir propinas.</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="enable-tips"
            checked={tipsEnabled}
            onCheckedChange={(checked) => setTipsEnabled(checked === true)}
          />
          <Label htmlFor="enable-tips">Mostrar campo para agregar propina</Label>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline">Cancelar</Button>
          <Button onClick={handleSave}>Guardar</Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
