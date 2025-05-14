
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";

const ShippingCosts = () => {
  const [shippingType, setShippingType] = useState("quotation");
  const [minDeliveryTime, setMinDeliveryTime] = useState("25");
  const [maxDeliveryTime, setMaxDeliveryTime] = useState("45");
  const [pickupTime, setPickupTime] = useState("15");
  const [freeShippingEnabled, setFreeShippingEnabled] = useState(true);
  const [freeShippingMinimum, setFreeShippingMinimum] = useState("");
  const [minPurchaseEnabled, setMinPurchaseEnabled] = useState(true);
  const [minPurchaseAmount, setMinPurchaseAmount] = useState("0");

  const handleSave = () => {
    toast({
      title: "Configuración guardada",
      description: "Los costos de envío han sido actualizados"
    });
  };

  return (
    <div className="space-y-8">
      {/* Delivery Times */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Tiempo para pedidos a domicilio</h2>
        <p className="text-sm text-gray-500">Desde que el cliente hace su pedido</p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="min-time">Mínimo</Label>
            <div className="flex">
              <Input 
                id="min-time" 
                value={minDeliveryTime}
                onChange={(e) => setMinDeliveryTime(e.target.value)}
                className="rounded-r-none"
              />
              <span className="bg-gray-100 px-3 py-2 border border-l-0 rounded-r-md text-sm">mins</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="max-time">Máximo</Label>
            <div className="flex">
              <Input 
                id="max-time" 
                value={maxDeliveryTime}
                onChange={(e) => setMaxDeliveryTime(e.target.value)}
                className="rounded-r-none"
              />
              <span className="bg-gray-100 px-3 py-2 border border-l-0 rounded-r-md text-sm">mins</span>
            </div>
          </div>
        </div>
        
        {/* Pickup Time */}
        <h2 className="text-lg font-medium pt-4">Tiempo para pedidos de recolección</h2>
        <p className="text-sm text-gray-500">Desde que el cliente hace su pedido</p>
        
        <div className="space-y-2">
          <div className="flex">
            <Input 
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="rounded-r-none"
            />
            <span className="bg-gray-100 px-3 py-2 border border-l-0 rounded-r-md text-sm">mins</span>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline">Cancelar</Button>
          <Button onClick={handleSave}>Guardar</Button>
        </div>
      </div>

      {/* Shipping Cost Type */}
      <div className="space-y-4 border-t pt-6">
        <h2 className="text-lg font-medium">Tipo de costo de envío</h2>
        
        <Select value={shippingType} onValueChange={setShippingType}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona el tipo de envío" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="quotation">Por cotizar</SelectItem>
            <SelectItem value="fixed">Precio fijo</SelectItem>
            <SelectItem value="distance">Por distancia</SelectItem>
          </SelectContent>
        </Select>
        
        <p className="text-sm text-gray-500">
          El precio de envío no será calculado automáticamente.
        </p>
        
        {/* Free Shipping Option */}
        <div className="flex items-center space-x-2 pt-4">
          <Switch
            checked={freeShippingEnabled}
            onCheckedChange={setFreeShippingEnabled}
            id="free-shipping"
          />
          <Label htmlFor="free-shipping" className="font-medium">
            Envío gratis si se alcanza una compra mínima
          </Label>
        </div>
        
        {freeShippingEnabled && (
          <div className="pl-6 pt-2">
            <div className="space-y-2">
              <div className="flex">
                <span className="bg-gray-100 px-3 py-2 border border-r-0 rounded-l-md">$</span>
                <Input 
                  value={freeShippingMinimum}
                  onChange={(e) => setFreeShippingMinimum(e.target.value)}
                  placeholder="Valor mínimo para envío gratis"
                  className="rounded-l-none"
                />
              </div>
              <p className="text-xs text-gray-500">
                Valor de compra mínimo para que tus clientes obtengan envío gratis.
              </p>
            </div>
          </div>
        )}
        
        {/* Minimum Purchase Requirement */}
        <div className="flex items-center space-x-2 pt-4">
          <Switch
            checked={minPurchaseEnabled}
            onCheckedChange={setMinPurchaseEnabled}
            id="min-purchase"
          />
          <Label htmlFor="min-purchase" className="font-medium">
            Se requiere una compra mínima para habilitar envíos
          </Label>
        </div>
        
        {minPurchaseEnabled && (
          <div className="pl-6 pt-2">
            <div className="space-y-2">
              <div className="flex">
                <span className="bg-gray-100 px-3 py-2 border border-r-0 rounded-l-md">$</span>
                <Input 
                  value={minPurchaseAmount}
                  onChange={(e) => setMinPurchaseAmount(e.target.value)}
                  placeholder="Valor mínimo para envío"
                  className="rounded-l-none"
                />
              </div>
              <p className="text-xs text-gray-500">
                Valor de compra mínimo para que tus clientes puedan hacer pedidos a domicilio.
              </p>
            </div>
          </div>
        )}
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline">Cancelar</Button>
          <Button onClick={handleSave}>Guardar</Button>
        </div>
      </div>
    </div>
  );
};

export default ShippingCosts;
