
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

const MenuSchedule = () => {
  const [currentMenu, setCurrentMenu] = useState("Menú general");
  const [schedules, setSchedules] = useState([
    { day: "Lunes", shifts: [] },
    { day: "Martes", shifts: [] },
    { day: "Miércoles", shifts: [] },
    { day: "Jueves", shifts: [] },
    { day: "Viernes", shifts: [] },
    { day: "Sábado", shifts: [] },
    { day: "Domingo", shifts: [] },
  ]);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [newShift, setNewShift] = useState({ start: "--:--", end: "--:--" });

  const addShift = (day: string) => {
    setSelectedDay(day);
    setDialogOpen(true);
  };

  const saveShift = () => {
    const updatedSchedules = schedules.map(schedule => {
      if (schedule.day === selectedDay) {
        return {
          ...schedule,
          shifts: [...schedule.shifts, { start: newShift.start, end: newShift.end }]
        };
      }
      return schedule;
    });
    
    setSchedules(updatedSchedules);
    setDialogOpen(false);
    setNewShift({ start: "--:--", end: "--:--" });
    
    toast({
      title: "Turno agregado",
      description: `Se agregó un nuevo turno para ${selectedDay}`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium">Horarios de menús</h2>
        </div>
        
        <div className="flex gap-2">
          <Select value={currentMenu} onValueChange={setCurrentMenu}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Menú actual" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Menú general">Menú general</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">+ Nuevo menú</Button>
        </div>
      </div>
      
      <Alert className="bg-amber-50 text-amber-800 border-amber-200">
        <AlertDescription>
          Este menú permanecerá abierto las 24 horas hasta que agregues un turno.
        </AlertDescription>
      </Alert>
      
      <div className="border rounded-md">
        <div className="p-3 border-b bg-gray-50">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Menú general</h3>
            <Button variant="ghost" size="sm">
              ⋮
            </Button>
          </div>
        </div>
        
        {schedules.map((schedule) => (
          <div key={schedule.day} className="p-3 border-b flex justify-between items-center">
            <span>{schedule.day}</span>
            
            <div>
              {schedule.shifts.length > 0 ? (
                schedule.shifts.map((shift, index) => (
                  <div key={index} className="text-sm">
                    {shift.start} - {shift.end}
                  </div>
                ))
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-green-600" 
                  onClick={() => addShift(schedule.day)}
                >
                  + Nuevo turno
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agrega un turno en {selectedDay}</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <span className="block text-sm font-medium mb-1">Empieza:</span>
              <Select 
                value={newShift.start} 
                onValueChange={(value) => setNewShift({...newShift, start: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Hora de inicio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="00:00">00:00</SelectItem>
                  <SelectItem value="01:00">01:00</SelectItem>
                  <SelectItem value="02:00">02:00</SelectItem>
                  <SelectItem value="08:00">08:00</SelectItem>
                  <SelectItem value="09:00">09:00</SelectItem>
                  <SelectItem value="10:00">10:00</SelectItem>
                  <SelectItem value="11:00">11:00</SelectItem>
                  <SelectItem value="12:00">12:00</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <span className="block text-sm font-medium mb-1">Termina:</span>
              <Select 
                value={newShift.end} 
                onValueChange={(value) => setNewShift({...newShift, end: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Hora de fin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12:00">12:00</SelectItem>
                  <SelectItem value="13:00">13:00</SelectItem>
                  <SelectItem value="14:00">14:00</SelectItem>
                  <SelectItem value="18:00">18:00</SelectItem>
                  <SelectItem value="19:00">19:00</SelectItem>
                  <SelectItem value="20:00">20:00</SelectItem>
                  <SelectItem value="21:00">21:00</SelectItem>
                  <SelectItem value="22:00">22:00</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveShift}>
              Agregar turno
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MenuSchedule;
