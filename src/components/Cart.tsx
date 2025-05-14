
import React, { useEffect, useRef } from 'react';
import { X, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const Cart: React.FC = () => {
  const { state, removeItem, updateQuantity, clearCart, toggleCart, getOrderSummary } = useCart();
  const { items, isOpen } = state;
  const cartRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const summary = getOrderSummary();
  const isEmpty = items.length === 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node) && isOpen) {
        toggleCart(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, toggleCart]);

  const handlePlaceOrder = () => {
    toast({
      title: "¡Pedido confirmado!",
      description: `Tu pedido por ${formatCurrency(summary.total)} ha sido recibido.`,
    });
    clearCart();
    toggleCart(false);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => toggleCart(false)}
        />
      )}
      
      {/* Cart Sidebar */}
      <div 
        ref={cartRef}
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-xl 
        transform transition-transform duration-300 overflow-hidden
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Cart Header */}
        <div className="bg-navy-800 text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <h2 className="font-semibold text-lg">Tu Pedido</h2>
          </div>
          <button 
            onClick={() => toggleCart(false)}
            className="p-1 rounded-full hover:bg-navy-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Cart Content */}
        <div className="flex flex-col h-[calc(100%-64px-80px)] overflow-y-auto p-4">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <ShoppingCart className="h-16 w-16 mb-4 opacity-30" />
              <p>Tu carrito está vacío</p>
              <Button 
                variant="link"
                className="text-orange-500 mt-2" 
                onClick={() => toggleCart(false)}
              >
                Explorar el menú
              </Button>
            </div>
          ) : (
            <>
              {/* Items */}
              <div className="flex-1">
                {items.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">{formatCurrency(item.price)}</p>
                        <div className="quantity-control mt-1">
                          <button 
                            className="quantity-btn"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="font-medium">{item.quantity}</span>
                          <button 
                            className="quantity-btn"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-semibold">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                      <button 
                        className="text-red-500 mt-2 text-sm flex items-center"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="pt-4">
                <Button
                  variant="ghost"
                  className="text-sm text-red-500 flex items-center mb-2"
                  onClick={clearCart}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Vaciar carrito
                </Button>

                <Separator className="my-2" />
                
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatCurrency(summary.subtotal)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">IVA (10%)</span>
                  <span>{formatCurrency(summary.tax)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between py-2 font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(summary.total)}</span>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Cart Footer */}
        {!isEmpty && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
            <Button 
              onClick={handlePlaceOrder}
              className="w-full bg-orange-500 hover:bg-orange-600 font-semibold py-6 text-lg"
            >
              Confirmar Pedido
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
