
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clipboard, QrCode, ExternalLink } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

const DeliveryPickup = () => {
  const [menuLink, setMenuLink] = useState("maspedidos.menu/hola");
  const [showQR, setShowQR] = useState(false);
  
  const [whatsappMessage, setWhatsappMessage] = useState(
    "¡Hola! Quiero hacer un pedido. Aquí está mi menú: maspedidos.menu/hola"
  );

  const copyLink = () => {
    navigator.clipboard.writeText(`https://${menuLink}`);
    toast({
      title: "Link copiado",
      description: "El enlace ha sido copiado al portapapeles"
    });
  };

  const downloadQR = () => {
    // In a real implementation, this would generate and download a QR code
    toast({
      title: "Descarga iniciada",
      description: "El código QR se está descargando"
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-medium mb-4">Link de menú</h2>
        
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <div className="flex items-center">
              <span className="bg-gray-100 px-3 py-2 border border-r-0 rounded-l-md text-gray-500 text-sm">
                https://
              </span>
              <Input 
                value={menuLink}
                readOnly
                className="rounded-l-none rounded-r-none border-x-0"
              />
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-l-none border-l-0"
                onClick={copyLink}
              >
                <Clipboard className="h-4 w-4" />
                <span className="sr-only">Copiar link</span>
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={showQR ? "default" : "outline"}
              onClick={() => setShowQR(!showQR)}
              className="flex items-center gap-2"
            >
              <QrCode className="h-4 w-4" />
              <span>QR</span>
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              <span>Ver Menú</span>
            </Button>
          </div>
        </div>
      </div>
      
      {showQR && (
        <div className="border rounded-md p-6 flex flex-col items-center">
          <div className="bg-white p-4 border rounded-md mb-4">
            <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
              <QrCode className="h-24 w-24 text-gray-400" />
            </div>
          </div>
          
          <Button onClick={downloadQR}>Descargar QR</Button>
        </div>
      )}
      
      <div className="border-t pt-6">
        <h2 className="text-lg font-medium mb-2">¿Cómo compartir?</h2>
        
        <div className="space-y-4">
          <h3 className="text-base font-medium">WhatsApp Business</h3>
          <p className="text-sm text-gray-600">
            Configura este mensaje para ser enviado automáticamente cada vez que un cliente quiera hacer un pedido.
          </p>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Mensaje listo para compartir:</label>
            <Textarea 
              value={whatsappMessage} 
              onChange={(e) => setWhatsappMessage(e.target.value)}
              rows={4}
            />
          </div>
          
          <div className="flex justify-end">
            <Button onClick={() => {
              navigator.clipboard.writeText(whatsappMessage);
              toast({
                title: "Mensaje copiado",
                description: "El mensaje ha sido copiado al portapapeles"
              });
            }}>
              Copiar mensaje
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPickup;
