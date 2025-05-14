import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
const Header: React.FC = () => {
  const {
    state,
    toggleCart
  } = useCart();
  const isMobile = useIsMobile();
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);

  // Si es móvil o tablet, no mostramos el header
  if (isMobile) {
    return null;
  }
  return <header className="bg-navy-800 text-white py-4 px-5 sticky top-0 z-40">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="font-bold text-2xl text-orange-500">Lotito</div>
          <div className="text-sm text-gray-300">Menú Digital</div>
        </div>
        
        <div className="flex items-center gap-4">
          <button onClick={() => toggleCart()} className="relative p-2 rounded-full hover:bg-navy-700 transition-colors">
            <ShoppingCart className="h-6 w-6" />
            {itemCount > 0 && <Badge className="absolute -top-1 -right-1 bg-orange-500 text-white border-none px-1.5 min-w-[1.5rem] flex items-center justify-center">
                {itemCount}
              </Badge>}
          </button>
        </div>
      </div>
    </header>;
};
export default Header;