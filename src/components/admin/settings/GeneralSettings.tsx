
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Upload } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useNavigate } from "react-router-dom";

type Business = Tables<"businesses">;

const GeneralSettings = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isWhatsappModalOpen, setIsWhatsappModalOpen] = useState(false);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const [previewBanner, setPreviewBanner] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({
    name: "",
    whatsappNumber: "",
    address: "",
    description: "",
    location: "",
    logo: "",
    banner: "",
  });

  useEffect(() => {
    // Get the current authenticated user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "No autenticado",
          description: "Debes iniciar sesión para acceder a esta página",
          variant: "destructive"
        });
        navigate("/auth");
        return;
      }
      
      setUserId(user.id);
      fetchBusinessData(user.id);
    };
    
    getUser();
  }, [navigate]);

  const fetchBusinessData = async (ownerId: string) => {
    setIsLoading(true);
    try {
      // Fetch the business owned by the authenticated user
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("owner_id", ownerId)
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No business found for this user
          toast({
            title: "Negocio no encontrado",
            description: "No se encontró un negocio asociado a tu cuenta",
            variant: "destructive"
          });
          return;
        }
        throw error;
      }

      if (data) {
        setBusiness(data);
        setPreviewLogo(data.image || null);
        setPreviewBanner(data.img_banner || null);
        setFormValues({
          name: data.name || "",
          whatsappNumber: data.phone || "",
          address: data.location || "",
          description: data.description || "",
          location: data.location || "",
          logo: data.image || "",
          banner: data.img_banner || "",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error al cargar datos",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewLogo(objectUrl);
    }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewBanner(objectUrl);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!business?.id || !userId) return;
    
    // Verify that the business belongs to the authenticated user
    if (business.owner_id !== userId) {
      toast({
        title: "Error de permisos",
        description: "No tienes permiso para editar este negocio",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Update business data
      const { error } = await supabase
        .from("businesses")
        .update({
          name: formValues.name,
          phone: formValues.whatsappNumber,
          location: formValues.address,
          description: formValues.description,
        })
        .eq("id", business.id)
        .eq("owner_id", userId); // Additional check to ensure ownership

      if (error) throw error;

      // Handle logo upload if file was selected
      if (logoFile) {
        // In a real app, you would upload to Supabase Storage
        // For now, we'll just update the image URL field
        const { error: logoError } = await supabase
          .from("businesses")
          .update({ 
            image: URL.createObjectURL(logoFile) // In real app: use Supabase Storage URL
          })
          .eq("id", business.id)
          .eq("owner_id", userId); // Additional check to ensure ownership
        
        if (logoError) throw logoError;
      }

      // Handle banner upload if file was selected
      if (bannerFile) {
        // In a real app, you would upload to Supabase Storage
        const { error: bannerError } = await supabase
          .from("businesses")
          .update({ 
            img_banner: URL.createObjectURL(bannerFile) // In real app: use Supabase Storage URL
          })
          .eq("id", business.id)
          .eq("owner_id", userId); // Additional check to ensure ownership
        
        if (bannerError) throw bannerError;
      }

      await fetchBusinessData(userId); // Refresh data with user ID
      
      toast({
        title: "Guardado correctamente",
        description: "La información del negocio ha sido actualizada"
      });
    } catch (error: any) {
      toast({
        title: "Error al guardar",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLogo = async () => {
    if (!business?.id || !userId) return;
    
    try {
      const { error } = await supabase
        .from("businesses")
        .update({ image: null })
        .eq("id", business.id)
        .eq("owner_id", userId); // Additional check to ensure ownership

      if (error) throw error;
      
      setPreviewLogo(null);
      toast({
        title: "Logo eliminado",
        description: "Se ha eliminado el logo correctamente"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteBanner = async () => {
    if (!business?.id || !userId) return;
    
    try {
      const { error } = await supabase
        .from("businesses")
        .update({ img_banner: null })
        .eq("id", business.id)
        .eq("owner_id", userId); // Additional check to ensure ownership

      if (error) throw error;
      
      setPreviewBanner(null);
      toast({
        title: "Banner eliminado",
        description: "Se ha eliminado el banner correctamente"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {isLoading && (
        <div className="text-center py-4">
          <p>Cargando información del negocio...</p>
        </div>
      )}
      
      {!isLoading && !business && (
        <div className="text-center py-4">
          <p>No se encontró un negocio asociado a tu cuenta</p>
        </div>
      )}
      
      {!isLoading && business && (
        <>
          <div>
            <h2 className="text-lg font-medium">Información general</h2>
            <p className="text-sm text-gray-500">Configura la información básica de tu negocio</p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* WhatsApp Number */}
            <div className="space-y-2 p-4 border rounded-md">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">Número de WhatsApp para pedidos</h3>
                  <p className="text-sm text-gray-500">{business?.phone || "No configurado"}</p>
                  <p className="text-xs text-gray-500 mt-1">El número al que llegarán las comandas de los pedidos a domicilio</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setIsWhatsappModalOpen(true)}
                  type="button"
                >
                  Cambiar número
                </Button>
              </div>
            </div>

            {/* Business Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la tienda</Label>
              <Input 
                id="name"
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
              />
            </div>

            {/* Business Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                value={formValues.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            {/* Business Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Dirección completa</Label>
              <Input
                id="address"
                name="address"
                value={formValues.address}
                onChange={handleInputChange}
              />
            </div>

            {/* Google Maps Location */}
            <div className="space-y-2">
              <Label>Ubicación en Google Maps</Label>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 w-auto"
                onClick={() => setIsLocationModalOpen(true)}
                type="button"
              >
                <MapPin className="h-4 w-4" /> Agregar ubicación
              </Button>
            </div>

            {/* Store Logo */}
            <div className="space-y-2 border-t pt-6">
              <Label>Logotipo de la tienda</Label>
              <div className="border rounded-md p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => document.getElementById('logo-upload')?.click()}
                      type="button"
                    >
                      <Upload className="h-4 w-4" /> Cargar imagen
                    </Button>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="text-red-500"
                    onClick={handleDeleteLogo}
                    type="button"
                    disabled={!previewLogo}
                  >
                    Borrar
                  </Button>
                </div>
                
                <div className="mt-4 bg-gray-100 rounded-md overflow-hidden w-full max-w-[200px] mx-auto">
                  {previewLogo ? (
                    <AspectRatio ratio={1/1} className="w-full">
                      <img 
                        src={previewLogo} 
                        alt="Logo Preview" 
                        className="object-cover w-full h-full"
                      />
                    </AspectRatio>
                  ) : (
                    <AspectRatio ratio={1/1} className="w-full flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <p>Vista previa del logotipo</p>
                      </div>
                    </AspectRatio>
                  )}
                </div>
              </div>
            </div>

            {/* Store Banner */}
            <div className="space-y-2">
              <Label>Portada de la tienda</Label>
              <div className="border rounded-md p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <input
                      id="banner-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleBannerUpload}
                    />
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => document.getElementById('banner-upload')?.click()}
                      type="button"
                    >
                      <Upload className="h-4 w-4" /> Cargar imagen
                    </Button>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="text-red-500"
                    onClick={handleDeleteBanner}
                    type="button"
                    disabled={!previewBanner}
                  >
                    Borrar
                  </Button>
                </div>
                
                <div className="mt-4 bg-gray-100 rounded-md overflow-hidden w-full">
                  {previewBanner ? (
                    <AspectRatio ratio={16/9} className="w-full">
                      <img 
                        src={previewBanner} 
                        alt="Banner Preview" 
                        className="object-cover w-full h-full"
                      />
                    </AspectRatio>
                  ) : (
                    <AspectRatio ratio={16/9} className="w-full flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <p>Vista previa de la portada</p>
                      </div>
                    </AspectRatio>
                  )}
                </div>
              </div>
            </div>

            {/* Save/Cancel buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => fetchBusinessData(userId || "")}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </form>

          {/* WhatsApp Modal */}
          <Sheet open={isWhatsappModalOpen} onOpenChange={setIsWhatsappModalOpen}>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Cambiar número de WhatsApp</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsappNumber">Número de WhatsApp (con prefijo +52)</Label>
                  <Input 
                    id="whatsappNumber"
                    name="whatsappNumber"
                    placeholder="+52 4621234567" 
                    value={formValues.whatsappNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsWhatsappModalOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={() => {
                      handleSave({
                        preventDefault: () => {},
                      } as React.FormEvent);
                      setIsWhatsappModalOpen(false);
                    }}
                  >
                    Guardar
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </>
      )}
    </div>
  );
};

export default GeneralSettings;
