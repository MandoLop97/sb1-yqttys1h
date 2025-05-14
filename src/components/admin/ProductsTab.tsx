
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Tables } from "@/integrations/supabase/types";
import { PlusIcon, Pencil, Trash2, Search, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { AspectRatio } from "@/components/ui/aspect-ratio";

type Product = Tables<"business_products">;

interface ProductsTabProps {
  businessId: string | undefined;
}

const ProductsTab = ({ businessId }: ProductsTabProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [productCount, setProductCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    is_available: true,
  });

  // Cargar productos
  const loadProducts = useCallback(async () => {
    if (!businessId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      let query = supabase
        .from("business_products")
        .select("*")
        .eq("business_id", businessId);
        
      if (activeFilter === "unavailable") {
        query = query.eq("is_available", false);
      }
      
      const { data, error, count } = await query
        .order("name", { ascending: true });

      if (error) {
        throw error;
      }

      let filteredProducts = data || [];
      
      // Filter by search term if present
      if (searchTerm) {
        filteredProducts = filteredProducts.filter(product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setProducts(filteredProducts);
      setProductCount(filteredProducts.length);
    } catch (error: any) {
      toast({
        title: "Error al cargar productos",
        description: error.message || "No se pudieron cargar los productos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [businessId, activeFilter, searchTerm]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      image: "",
      is_available: true,
    });
    setCurrentProduct(null);
    setIsEdit(false);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setIsEdit(true);
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: String(product.price || 0),
      image: product.image || "",
      is_available: product.is_available ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData({ ...formData, is_available: checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!businessId) {
      toast({
        title: "Error",
        description: "No hay un negocio asociado",
        variant: "destructive",
      });
      return;
    }

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        image: formData.image || "/placeholder.svg",
        is_available: formData.is_available,
        business_id: businessId,
      };

      if (isEdit && currentProduct?.id) {
        // Actualizar producto existente
        const { data, error } = await supabase
          .from("business_products")
          .update(productData)
          .eq("id", currentProduct.id)
          .select()
          .single();

        if (error) throw error;
        
        const updatedProducts = products.map(p =>
          p.id === data.id ? data : p
        );
        
        setProducts(updatedProducts);
        toast({
          title: "Producto actualizado",
          description: `${data.name} ha sido actualizado correctamente`,
        });
      } else {
        // Añadir nuevo producto
        const { data, error } = await supabase
          .from("business_products")
          .insert(productData)
          .select()
          .single();

        if (error) throw error;
        
        setProducts([...products, data]);
        toast({
          title: "Producto añadido",
          description: `${data.name} ha sido añadido correctamente`,
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
      loadProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al guardar el producto",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este producto?")) return;
    
    try {
      const { error } = await supabase
        .from("business_products")
        .delete()
        .eq("id", productId);

      if (error) throw error;
      
      setProducts(products.filter(p => p.id !== productId));
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado correctamente",
      });
      loadProducts();
    } catch (error: any) {
      toast({
        title: "Error al eliminar",
        description: error.message || "No se pudo eliminar el producto",
        variant: "destructive",
      });
    }
  };

  const handleToggleAvailability = async (product: Product) => {
    try {
      const { error } = await supabase
        .from("business_products")
        .update({ is_available: !product.is_available })
        .eq("id", product.id);

      if (error) throw error;
      
      const updatedProducts = products.map(p =>
        p.id === product.id ? { ...p, is_available: !p.is_available } : p
      );
      
      setProducts(updatedProducts);
      toast({
        title: product.is_available ? "Producto no disponible" : "Producto disponible",
        description: `${product.name} ha sido marcado como ${product.is_available ? "no disponible" : "disponible"}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al cambiar disponibilidad",
        variant: "destructive",
      });
    }
  };

  if (loading && !businessId) {
    return <Card className="p-8 text-center">Cargando productos...</Card>;
  }

  if (!businessId) {
    return (
      <Card className="p-8 text-center">
        <CardHeader>
          <CardTitle>No hay negocio registrado</CardTitle>
          <CardDescription>
            Por favor, crea primero la información de tu negocio en la pestaña "Perfil de Negocio"
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Productos</CardTitle>
            <CardDescription>Gestiona los productos de tu negocio</CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Search and filter bar */}
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar productos..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2 shrink-0">
              <Button 
                variant={activeFilter === "all" ? "default" : "outline"} 
                className="text-sm h-9"
                onClick={() => setActiveFilter("all")}
              >
                Todos
              </Button>
              <Button 
                variant={activeFilter === "unavailable" ? "default" : "outline"} 
                className="text-sm h-9"
                onClick={() => setActiveFilter("unavailable")}
              >
                Agotados
              </Button>
              <Button onClick={openAddDialog} className="ml-2">
                <Plus className="h-4 w-4 mr-1" /> Nuevo producto
              </Button>
            </div>
          </div>
          
          {/* Usage counter */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-500">
              Imágenes de productos: {productCount}/20
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div 
                className="bg-green-500 h-2.5 rounded-full" 
                style={{ width: `${Math.min(100, (productCount / 20) * 100)}%` }}
              ></div>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No hay productos añadidos</p>
              <Button onClick={openAddDialog}>Añadir primer producto</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-gray-100 rounded-md overflow-hidden">
                      <AspectRatio ratio={1/1}>
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                      </AspectRatio>
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">${product.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={product.is_available} 
                      onCheckedChange={() => handleToggleAvailability(product)}
                    />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => openEditDialog(product)}
                      className="text-blue-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Diálogo para añadir/editar producto */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Editar Producto" : "Añadir Nuevo Producto"}</DialogTitle>
            <DialogDescription>
              {isEdit 
                ? "Modifica la información del producto existente" 
                : "Ingresa la información del nuevo producto"}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Producto</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nombre del producto"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descripción del producto"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Precio</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">URL de Imagen</Label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="URL de imagen del producto"
              />
              
              {formData.image && (
                <div className="mt-2 bg-gray-100 rounded-md overflow-hidden w-full max-w-[200px] mx-auto">
                  <AspectRatio ratio={1/1} className="w-full">
                    <img 
                      src={formData.image} 
                      alt="Vista previa" 
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </AspectRatio>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="is_available" 
                checked={formData.is_available} 
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="is_available">Producto disponible</Label>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {isEdit ? "Actualizar" : "Añadir"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductsTab;
