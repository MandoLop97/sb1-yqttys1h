
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface AdminNavbarProps {
  onLogout: () => void;
}

const AdminNavbar = ({ onLogout }: AdminNavbarProps) => {
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <span className="font-bold text-xl">MasPedidos Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => {
              onLogout();
              toast({
                title: "Sesión cerrada",
                description: "Has cerrado sesión correctamente",
              });
            }}
          >
            Cerrar sesión
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
