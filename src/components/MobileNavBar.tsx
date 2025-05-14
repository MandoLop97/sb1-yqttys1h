import React from 'react';
import { ShoppingCart, History, Settings } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const MobileNavBar: React.FC = () => {
  const { state, toggleCart } = useCart();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
  
  const handleHistoryClick = () => {
    toast({
      title: "Historial de pedidos",
      description: "Funcionalidad en desarrollo",
    });
    // Aquí podríamos navegar a la página de historial cuando esté implementada
    // navigate('/history');
  };
  
  const handleSettingsClick = () => {
    toast({
      title: "Ajustes",
      description: "Funcionalidad en desarrollo",
    });
    // Aquí podríamos navegar a la página de ajustes cuando esté implementada
    // navigate('/settings');
  };

  if (!isMobile) {
    return null;
  }

  return (
    <>
      {/* Enhanced shadow overlay that fades from bottom of content to navbar */}
      <div 
        className="fixed bottom-[50px] left-0 right-0 h-12 pointer-events-none z-30"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.20))'
        }}
      />
      
      <div className="fixed bottom-0 left-0 right-0 backdrop-blur-md bg-navy-900/95 text-gray-100 py-1 z-40 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.2)]">
        <div className="flex justify-around items-center">
          <button
            onClick={handleHistoryClick}
            className="flex flex-col items-center p-1.5 transition-transform active:scale-95 hover:text-white"
          >
            <History className="h-5 w-5" />
            <span className="text-[0.7rem] mt-0.5">Historial</span>
          </button>
          
          <button 
            onClick={() => toggleCart()}
            className="relative flex flex-col items-center p-1.5 transition-transform active:scale-95 hover:text-white"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 bg-orange-500 text-white border-none px-1.5 min-w-[1.5rem] flex items-center justify-center">
                {itemCount}
              </Badge>
            )}
            <span className="text-[0.7rem] mt-0.5">Carrito</span>
          </button>
          
          <button
            onClick={handleSettingsClick}
            className="flex flex-col items-center p-1.5 transition-transform active:scale-95 hover:text-white"
          >
            <Settings className="h-5 w-5" />
            <span className="text-[0.7rem] mt-0.5">Ajustes</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileNavBar;