
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

const TablesZones = () => {
  const [zones, setZones] = useState([
    { id: 1, name: "mesa 1" }
  ]);
  
  const [showZoneEditor, setShowZoneEditor] = useState(false);
  const [editingZone, setEditingZone] = useState<null | { id: number, name: string }>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newZoneName, setNewZoneName] = useState("");
  
  // Zone editor state
  const [columns, setColumns] = useState(7);
  const [rows, setRows] = useState(5);
  
  const handleAddZone = () => {
    setDialogOpen(true);
    setNewZoneName("");
  };
  
  const createZone = () => {
    if (!newZoneName) return;
    
    const newZone = {
      id: zones.length + 1,
      name: newZoneName
    };
    
    setZones([...zones, newZone]);
    setDialogOpen(false);
    
    // After creating, open the editor
    setEditingZone(newZone);
    setShowZoneEditor(true);
    
    toast({
      title: "Zona creada",
      description: `Se ha creado la zona "${newZoneName}"`
    });
  };
  
  const openEditor = (zone: { id: number, name: string }) => {
    setEditingZone(zone);
    setShowZoneEditor(true);
  };
  
  const saveZoneLayout = () => {
    toast({
      title: "Configuración guardada",
      description: "El layout de las mesas ha sido guardado"
    });
    setShowZoneEditor(false);
    setEditingZone(null);
  };

  // If showing zone editor
  if (showZoneEditor && editingZone) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={() => setShowZoneEditor(false)}
          >
            ← Salir
          </Button>
          <h2 className="text-lg font-medium">{editingZone.name}</h2>
          <Button onClick={saveZoneLayout}>Guardar</Button>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="zone-name">Nombre</Label>
              <Input 
                id="zone-name" 
                value={editingZone.name}
                onChange={(e) => setEditingZone({...editingZone, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Columnas</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[columns]}
                  onValueChange={(vals) => setColumns(vals[0])}
                  max={10}
                  min={1}
                  step={1}
                  className="flex-1"
                />
                <span className="w-8 text-center">{columns}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Filas</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[rows]}
                  onValueChange={(vals) => setRows(vals[0])}
                  max={10}
                  min={1}
                  step={1}
                  className="flex-1"
                />
                <span className="w-8 text-center">{rows}</span>
              </div>
            </div>
          </div>
          
          <div className="col-span-2 border rounded-md p-4">
            <div className="grid" style={{
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, 1fr)`,
              gap: '1rem'
            }}>
              {Array.from({ length: rows * columns }).map((_, index) => (
                <div 
                  key={index}
                  className="aspect-square rounded-md flex items-center justify-center bg-green-100 hover:bg-green-200 transition-colors cursor-pointer"
                >
                  <div className="text-green-700 text-2xl">+</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium">Zonas y mesas</h2>
          <p className="text-sm text-gray-500">Configura las mesas de tu establecimiento</p>
        </div>
        
        <Button onClick={handleAddZone}>+ Nueva zona</Button>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
        <div className="flex items-start gap-2">
          <div className="text-blue-500 text-xl">ℹ️</div>
          <div>
            <p className="text-blue-800">
              Encuentra el código QR de cada mesa en{" "}
              <span className="text-blue-600 font-medium cursor-pointer">Compartir</span>
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {zones.map(zone => (
          <Card key={zone.id} className="p-3">
            <div className="flex justify-between items-center">
              <span>{zone.name}</span>
              
              <div>
                <Button variant="ghost" size="sm" onClick={() => openEditor(zone)}>
                  ⋮
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agrega una zona</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="new-zone-name">Nombre</Label>
            <Input 
              id="new-zone-name"
              placeholder="Algunos ejemplos son: comedor principal, barra, terraza, primer piso."
              value={newZoneName}
              onChange={(e) => setNewZoneName(e.target.value)}
              className="mt-2"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={createZone}>Continuar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TablesZones;
