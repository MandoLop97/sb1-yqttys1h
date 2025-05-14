import React from 'react';
import { Button } from './ui/button';
import { MenuItem as MenuItemType } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { Card } from './ui/card';
import { AspectRatio } from './ui/aspect-ratio';
import { useIsMobile } from '@/hooks/use-mobile';

interface MenuItemProps {
  item: MenuItemType;
}

const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  const { addItem } = useCart();
  const isMobile = useIsMobile();

  return (
    <Card className="overflow-hidden border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 ease-in-out bg-white">
      <div className="flex flex-row items-start p-4 gap-4">
        {/* Texto del producto */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{item.name}</h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
          <p className="text-base font-bold text-orange-600 mt-2">
            {formatCurrency(item.price)}
          </p>
        </div>

        {/* Imagen del producto con botón */}
        <div className="relative w-28 shrink-0">
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
            <AspectRatio ratio={1 / 1} className="bg-gray-50">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </AspectRatio>
          </div>

          {/* Botón "+" rojo con negro */}
          <Button
  onClick={() => addItem(item)}
  size="icon"
  className="absolute bottom-1 right-1 w-9 h-9 p-0 rounded-full bg-gradient-to-br from-orange-600 via-orange-700 to-orange-800 text-white shadow-md hover:scale-105 active:scale-95 transition-transform duration-200"
  aria-label="Añadir al carrito"
>
  <span className="text-lg font-bold leading-none">+</span>
</Button>

        </div>
      </div>
    </Card>
  );
};

export default MenuItem;
