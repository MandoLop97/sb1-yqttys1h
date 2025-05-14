import { useRef, useEffect, useState, memo, useCallback } from 'react';
import { Category } from '@/lib/types';
import { ScrollArea } from './ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  setActiveCategory: (categoryId: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = memo(({ // envuelto completamente con memo
  categories,
  activeCategory,
  setActiveCategory
}) => {
  const tabsRef = useRef<HTMLDivElement>(null);
  const [showTabs, setShowTabs] = useState(false);
  const isMobile = useIsMobile();
  const tabHeight = 56;
  const tabOffsetTop = isMobile ? 0 : 68;
  const scrollingRef = useRef<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const firstCategoryId = categories[0]?.id;
      const lastCategoryId = categories[categories.length - 1]?.id;

      const firstSection = document.getElementById(`category-${firstCategoryId}`);
      const lastSection = document.getElementById(`category-${lastCategoryId}`);

      if (!firstSection || !lastSection) return;

      const firstRect = firstSection.getBoundingClientRect();
      const lastRect = lastSection.getBoundingClientRect();

      const startVisible = firstRect.top <= tabOffsetTop + 50;
      const endNotPassed = lastRect.bottom >= tabOffsetTop + 50;

      setShowTabs(startVisible && endNotPassed);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categories, tabOffsetTop]);

  useEffect(() => {
    if (!tabsRef.current || !activeCategory || scrollingRef.current) return;

    const tabEl = tabsRef.current.querySelector(
      `.category-tab[data-category="${activeCategory}"]`
    ) as HTMLElement;

    if (tabEl) {
      const rect = tabEl.getBoundingClientRect();
      const parentRect = tabsRef.current.getBoundingClientRect();

      if (rect.left < parentRect.left || rect.right > parentRect.right) {
        requestAnimationFrame(() => {
          tabEl.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest'
          });
        });
      }
    }
  }, [activeCategory]);

  const handleCategoryClick = useCallback((categoryId: string) => {
    if (!tabsRef.current || categoryId === activeCategory) return;

    scrollingRef.current = true;
    setActiveCategory(categoryId);

    const sectionElement = document.getElementById(`category-${categoryId}`);
    if (sectionElement) {
      const sectionTop = sectionElement.getBoundingClientRect().top + window.scrollY;
      const offset = tabHeight + tabOffsetTop + 16;

      window.scrollTo({
        top: sectionTop - offset,
        behavior: 'smooth'
      });

      setTimeout(() => {
        scrollingRef.current = false;
      }, 800);
    } else {
      scrollingRef.current = false;
    }
  }, [activeCategory, setActiveCategory, tabHeight, tabOffsetTop]);

  return (
    <>
      {!isMobile && showTabs && <div style={{ height: `${tabHeight}px` }} />}

      <div
        className={`z-30 fixed left-0 right-0 shadow-md bg-white transition-all duration-300 ${
          showTabs ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
        style={{
          height: `${tabHeight}px`,
          top: `${tabOffsetTop}px`,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          willChange: 'transform, opacity'
        }}
      >
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <ScrollArea
            className="w-full overflow-x-auto overflow-y-hidden scrollbar-hide"
            orientation="horizontal"
          >
            <div
              ref={tabsRef}
              className="flex gap-4 px-1 py-1"
              style={{ scrollBehavior: 'smooth' }}
            >
              {categories.map((category) => {
                const isActive = activeCategory === category.id;

                return (
                  <button
                    key={category.id}
                    data-category={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`category-tab relative whitespace-nowrap px-4 py-3 font-medium text-sm rounded-md transition-all duration-200 ${
                      isActive
                        ? 'text-navy-800 font-semibold bg-white shadow-md'
                        : 'text-gray-600 hover:text-navy-700 hover:bg-gray-50/50'
                    }`}
                  >
                    {category.name}
                    <div
                      className={`absolute bottom-0 left-0 w-full h-1 bg-navy-700 rounded-t-sm transition-transform origin-bottom duration-200 ${
                        isActive ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </ScrollArea>

          <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
        </div>
      </div>
    </>
  );
});

export default CategoryTabs;