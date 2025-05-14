
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clipboard, ExternalLink } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const MultiBranch = () => {
  const [multiLink, setMultiLink] = useState("maspedidos.menu/branches/hola");
  
  const copyLink = () => {
    navigator.clipboard.writeText(`https://${multiLink}`);
    toast({
      title: "Link copiado",
      description: "El enlace ha sido copiado al portapapeles"
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-1">Link multi sucursal</h2>
        <p className="text-sm text-gray-600">
          Este link permitirá a tus clientes escoger la sucursal más cercana antes de hacer su pedido para domicilio o de recolección.
        </p>
      </div>
      
      <div className="flex items-center">
        <span className="bg-gray-100 px-3 py-2 border border-r-0 rounded-l-md text-gray-500 text-sm">
          https://
        </span>
        <Input 
          value={multiLink}
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
      
      <div className="flex justify-end">
        <Button variant="outline" className="flex items-center gap-2">
          <ExternalLink className="h-4 w-4" />
          <span>Ver selector de sucursal</span>
        </Button>
      </div>
    </div>
  );
};

export default MultiBranch;
