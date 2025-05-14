
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type Business = Tables<"businesses">;

interface ProfileTabProps {
  business: Business | null;
  userId: string | undefined;
  setBusiness: (business: Business | null) => void;
}

const ProfileTab = ({ business, userId, setBusiness }: ProfileTabProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: business?.name || "",
    description: business?.description || "",
    email: business?.email || "",
    phone: business?.phone || "",
    location: business?.location || "",
    website: business?.website || "",
    image: business?.image || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para actualizar tu perfil",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      let businessId = business?.id;
      
      if (!businessId) {
        // Si no existe el negocio, lo creamos
        const { data: newBusiness, error: createError } = await supabase
          .from("businesses")
          .insert({
            name: formData.name,
            description: formData.description,
            email: formData.email,
            phone: formData.phone,
            location: formData.location,
            website: formData.website,
            image: formData.image || "/placeholder.svg",
            owner_id: userId,
            category: "general",
            rating: "0",
            featured: false,
          })
          .select()
          .single();
          
        if (createError) throw createError;
        
        businessId = newBusiness.id;
        setBusiness(newBusiness);
      } else {
        // Si ya existe, lo actualizamos
        const { data: updatedBusiness, error: updateError } = await supabase
          .from("businesses")
          .update({
            name: formData.name,
            description: formData.description,
            email: formData.email,
            phone: formData.phone,
            location: formData.location,
            website: formData.website,
            image: formData.image || business.image,
          })
          .eq("id", businessId)
          .select()
          .single();
          
        if (updateError) throw updateError;
        
        setBusiness(updatedBusiness);
      }
      
      toast({
        title: "Perfil actualizado",
        description: "La información de tu negocio ha sido actualizada correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error al actualizar perfil",
        description: error.message || "Ocurrió un error al actualizar la información",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del Negocio</CardTitle>
        <CardDescription>
          Actualiza la información de tu negocio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Negocio</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nombre del negocio"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Teléfono de contacto"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Dirección del negocio"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Sitio Web</Label>
              <Input
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://ejemplo.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">URL de Imagen/Logo</Label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="URL de la imagen"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe tu negocio"
              rows={4}
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileTab;
