
import React, { useRef, useEffect } from 'react';
import { MenuItem as MenuItemType } from '@/lib/types';
import MenuItem from './MenuItem';
import { useIsMobile } from '@/hooks/use-mobile';

interface MenuSectionProps {
  categoryId: string;
  categoryName: string;
  items: MenuItemType[];
  isActive: boolean;
}

const MenuSection: React.FC<MenuSectionProps> = ({
  categoryId,
  categoryName,
  items,
  isActive
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const hasScrolledRef = useRef<boolean>(false);

  useEffect(() => {
    // Set a better scroll-margin-top to account for the sticky header and category tabs
    if (sectionRef.current) {
      sectionRef.current.style.scrollMarginTop = '140px';
    }
  }, []);

  return (
    <div 
      id={`category-${categoryId}`} 
      ref={sectionRef} 
      data-category-section={categoryId} 
      className="mb-16 pt-4 px-4 rounded-xl bg-white/50 shadow-sm"
    >
      <h2 className="text-xl font-bold mb-5 text-navy-800 border-b pb-3">{categoryName}</h2>
      
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-5`}>
        {items.map((item, index) => (
          <div 
            key={item.id} 
            className="opacity-0 animate-fade-in" 
            style={{
              animationDelay: `${index * 0.05}s`,
              animationFillMode: 'forwards'
            }}
          >
            <MenuItem item={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuSection;
