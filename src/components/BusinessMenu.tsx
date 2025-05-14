import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import CategoryTabs from '@/components/CategoryTabs';
import MenuSection from '@/components/MenuSection';
import Header from '@/components/Header';
import Cart from '@/components/Cart';
import { CartProvider } from '@/context/CartContext';
import MobileNavBar from '@/components/MobileNavBar';
import { useIsMobile } from '@/hooks/use-mobile';
import { MenuItem as MenuItemType, Category } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import UnifiedBanner from './UnifiedBanner';

type Business = Tables<"businesses">;
type Product = Tables<"business_products">;

const BusinessMenu = () => {
  const { id } = useParams<{ id: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [userScrolling, setUserScrolling] = useState(false);
  const [manualCategoryChange, setManualCategoryChange] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scrollThresholdRef = useRef(120);
  const isMobile = useIsMobile();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Scroll to top when component mounts to ensure banner visibility
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Mark as loaded after a small delay for smoother transitions
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Setup scroll handler to detect when user is scrolling
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      setIsScrolled(prevScrolled => {
        const shouldBeScrolled = scrollY > scrollThresholdRef.current;
        return prevScrolled !== shouldBeScrolled ? shouldBeScrolled : prevScrolled;
      });
      setUserScrolling(true);

      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set a new timeout to mark scrolling as finished
      scrollTimeoutRef.current = setTimeout(() => {
        setUserScrolling(false);
      }, 150);
    };
    window.addEventListener('scroll', handleScroll, {
      passive: true
    });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Setup IntersectionObserver for scrollspy
  useEffect(() => {
    // If the observer already exists, disconnect it
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer with options
    observerRef.current = new IntersectionObserver(entries => {
      // Skip observer updates during manual category changes or user scrolling
      if (manualCategoryChange) return;

      // Find the first section that's in view (with highest intersection ratio)
      const visibleEntries = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visibleEntries.length > 0) {
        const categoryId = visibleEntries[0].target.getAttribute('data-category-section');
        if (categoryId && categoryId !== activeCategory) {
          setActiveCategory(categoryId);
        }
      }
    }, {
      // Change threshold to be more sensitive
      threshold: [0.1, 0.2, 0.5],
      rootMargin: '-100px 0px -20% 0px' // Top margin helps with early category switching
    });

    // Observe all category sections
    const categoryElements = document.querySelectorAll('[data-category-section]');
    categoryElements.forEach(element => {
      observerRef.current?.observe(element);
    });
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [activeCategory, manualCategoryChange]);

  // Handle manual category change
  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === activeCategory) return;

    // Set flag to prevent scrollspy from overriding the manual selection
    setManualCategoryChange(true);
    setActiveCategory(categoryId);

    // Scroll to the selected category section
    const sectionElement = document.getElementById(`category-${categoryId}`);
    if (sectionElement) {
      // Use smooth scrolling to the target section
      sectionElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }

    // Reset manual change flag after scrolling animation should be complete
    setTimeout(() => {
      setManualCategoryChange(false);
    }, 1000);
  };

  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        
        // Fetch business information
        const { data: businessData, error: businessError } = await supabase
          .from('businesses')
          .select('*')
          .eq('id', id)
          .single();

        if (businessError) {
          throw businessError;
        }

        // Fetch business products
        const { data: productsData, error: productsError } = await supabase
          .from('business_products')
          .select('*')
          .eq('business_id', id)
          .eq('is_available', true);

        if (productsError) {
          throw productsError;
        }

        setBusiness(businessData);
        setProducts(productsData || []);

        // Transform products into menu items
        const transformedItems: MenuItemType[] = (productsData || []).map(product => ({
          id: product.id,
          name: product.name || '',
          description: product.description?.includes(':') 
            ? product.description.split(':')[1].trim() 
            : (product.description || ''),
          price: Number(product.price || 0),
          image: product.image || '/placeholder.svg',
          category: product.description?.includes(':')
            ? product.description.split(':')[0].trim().toLowerCase().replace(/\s+/g, '-')
            : 'otros'
        }));

        setMenuItems(transformedItems);

        // Create categories from products
        if (productsData && productsData.length > 0) {
          // Group products by category
          const productsByCategory = productsData.reduce((acc, product) => {
            // Extract category from description or use "Productos" as default
            const category = product.description?.includes(':') 
              ? product.description.split(':')[0].trim() 
              : 'Productos';
            
            if (!acc[category]) {
              acc[category] = [];
            }
            acc[category].push(product);
            return acc;
          }, {} as Record<string, Product[]>);
          
          // Create category objects
          const categoryList: Category[] = Object.keys(productsByCategory).map(name => ({
            id: name.toLowerCase().replace(/\s+/g, '-'),
            name
          }));
          
          setCategories(categoryList);
          if (categoryList.length > 0) {
            setActiveCategory(categoryList[0].id);
          }
        }
      } catch (err: any) {
        console.error('Error fetching business data:', err);
        setError(err.message || 'No se pudo cargar la información');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="mt-4 text-lg">Cargando menú...</p>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-lg text-red-500">
          {error || 'No se encontró el negocio'}
        </p>
      </div>
    );
  }

  return (
    <CartProvider>
      <div className={`min-h-screen bg-gray-50 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <Header />
        
        <UnifiedBanner business={business} isLoading={loading} />

        {categories.length > 0 && (
          <CategoryTabs 
            categories={categories} 
            activeCategory={activeCategory} 
            setActiveCategory={handleCategoryChange} 
          />
        )}
        
        <main className={`menu-container ${isMobile ? 'px-2' : 'px-4'} ${isMobile ? 'pb-28' : 'pb-20'} prevent-scroll-reset mt-4`}>
          {categories.map(category => {
            const categoryItems = menuItems.filter(item => item.category === category.id);
            return (
              <MenuSection 
                key={category.id} 
                categoryId={category.id} 
                categoryName={category.name} 
                items={categoryItems} 
                isActive={activeCategory === category.id} 
              />
            );
          })}
        </main>
        
        <Cart />
        <MobileNavBar />
      </div>
    </CartProvider>
  );
};

export default BusinessMenu;
