
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, MapPin, Share2, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tables } from "@/integrations/supabase/types";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

const demoData = {
  name: "Menú de Ejemplo",
  image: "https://lotito.b-cdn.net/Lotito/99af0886-226f-4ce1-807e-c70035257bd2.png",
  img_banner: "https://lotito.b-cdn.net/Lotito/ChatGPT+Image+12+may+2025%2C+22_22_02.png",
  location: "Calle 44 #398, Los Pinos, Mérida, Yucatán (Frente a la escuela secundaria ESFER)",
  hours: [
    { day: "Lunes", hours: "Abierto todo el día" },
    { day: "Martes", hours: "Abierto todo el día" },
    { day: "Miércoles", hours: "Abierto todo el día" },
    { day: "Jueves", hours: "Abierto todo el día" },
    { day: "Viernes", hours: "Abierto todo el día" },
    { day: "Sábado", hours: "Abierto todo el día" },
    { day: "Domingo", hours: "Abierto todo el día" },
  ]
};

type Business = Tables<"businesses">;

interface UnifiedBannerProps {
  business?: Business;
  isLoading?: boolean;
}

const UnifiedBanner = ({ business, isLoading = false }: UnifiedBannerProps) => {
  const [showHours, setShowHours] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();

  const isDemo = !business;
  const displayData = {
    name: business?.name || demoData.name,
    image: business?.image || demoData.image,
    banner: business?.img_banner || demoData.img_banner,
    location: business?.location || demoData.location,
  };

  const businessHours = demoData.hours;
  const location = {
    address: displayData.location,
    mapUrl: business?.latitude && business?.longitude
      ? `https://maps.google.com/?q=${business.latitude},${business.longitude}`
      : `https://maps.google.com/?q=${encodeURIComponent(displayData.location)}`
  };

  const shareOptions = [
    {
      name: "WhatsApp",
      url: `https://wa.me/?text=${encodeURIComponent('Mira este restaurante: ' + window.location.href)}`
    },
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`
    },
    {
      name: "Twitter",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent('Mira este restaurante')}`
    },
    {
      name: "Email",
      url: `mailto:?subject=${encodeURIComponent('Restaurante recomendado')}&body=${encodeURIComponent('Mira este restaurante: ' + window.location.href)}`
    }
  ];

  const handleShare = (option: { name: string, url: string }) => {
    window.open(option.url, '_blank');
    setShowShare(false);
    toast.success(`Compartido en ${option.name}`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Enlace copiado al portapapeles");
    setShowShare(false);
  };

  return (
    <div className="restaurant-banner relative mb-12">
      {/* Banner con ratio y controles */}
      <div className="w-full md:w-[96%] md:max-w-7xl md:mx-auto overflow-hidden relative md:rounded-xl shadow-lg">
        <AspectRatio ratio={isMobile ? 16 / 9 : 21 / 9}>
          <div
            className="relative w-full h-full overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img
              src={displayData.banner}
              alt={`${displayData.name} Banner`}
              className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-105' : 'scale-100'}`}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none z-10" />
            <div className="absolute inset-0 bg-navy-800/10 pointer-events-none" />

            <div className="absolute top-4 right-4 flex gap-2 z-20">
              <button onClick={() => setShowHours(true)} className="bg-white/90 p-2.5 rounded-full shadow-lg hover:scale-105 transition">
                <Clock className="h-5 w-5 text-navy-800" />
              </button>
              <button onClick={() => setShowLocation(true)} className="bg-white/90 p-2.5 rounded-full shadow-lg hover:scale-105 transition">
                <MapPin className="h-5 w-5 text-navy-800" />
              </button>
              <button onClick={() => setShowShare(true)} className="bg-white/90 p-2.5 rounded-full shadow-lg hover:scale-105 transition">
                <Share2 className="h-5 w-5 text-navy-800" />
              </button>
            </div>
          </div>
        </AspectRatio>
      </div>

      {/* Avatar */}
      <div className="relative">
        <div className="max-w-4xl mx-auto flex justify-center -mt-16 relative z-30">
          <Avatar className="h-28 w-28 md:h-32 md:w-32 border-4 border-white shadow-xl bg-white ring-4 ring-white/30">
            <AvatarImage src={displayData.image} alt={displayData.name} className="object-cover" />
            <AvatarFallback className="text-4xl text-navy-800 font-bold bg-orange-500/10">
              {displayData.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

     {/* Nombre y detalles */}
      <div className="text-center mt-4 mb-8 animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-bold text-navy-800">{displayData.name}</h1>

        <div className="flex justify-center gap-3 mt-4 mb-5">
          <Badge className="bg-green-50/80 text-green-700 border-green-200 hover:bg-green-100 px-3 py-1">A domicilio</Badge>
          <Badge className="bg-gray-50/80 text-gray-700 border-gray-200 hover:bg-gray-100 px-3 py-1">Para recoger</Badge>
        </div>

        <div className="flex items-center justify-center gap-6 max-w-sm mx-auto bg-white/60 backdrop-blur-md px-3 py-2 rounded-xl shadow-md border border-gray-200 transform scale-[0.9] sm:scale-100">

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-navy-700" />
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] text-gray-500">Tiempo de entrega</span>
              <span className="font-semibold text-navy-800 text-sm">25–45 min</span>
            </div>
          </div>

          <div className="w-px h-8 bg-gray-300" />

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-navy-700" />
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] text-gray-500">Costo de envío</span>
              <span className="font-semibold text-navy-800 text-sm">Desde $20 MXN</span>
            </div>
          </div>
        </div>

        {/* Diálogos */}
        <Dialog open={showHours} onOpenChange={setShowHours}>
          <DialogContent className="sm:max-w-md rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-center">Horario</DialogTitle>
            </DialogHeader>
            <div className="py-2">
              {businessHours.map((item) => (
                <div key={item.day} className="flex justify-between py-2.5 border-b last:border-b-0">
                  <div className="font-medium text-navy-800">{item.day}</div>
                  <div className="text-gray-600">{item.hours}</div>
                </div>
              ))}
            </div>
            <Button onClick={() => setShowHours(false)} className="w-full mt-4">
              Cerrar
            </Button>
          </DialogContent>
        </Dialog>

        <Dialog open={showLocation} onOpenChange={setShowLocation}>
          <DialogContent className="sm:max-w-md rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-center">Ubicación</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-gray-700 mb-6">{location.address}</p>
              <div className="flex gap-4 flex-col sm:flex-row">
                <Button className="flex-1 gap-2" onClick={() => window.open(location.mapUrl, '_blank')}>
                  <ExternalLink className="h-4 w-4" />
                  Ver la ubicación en el mapa
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setShowLocation(false)}>
                  Cerrar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showShare} onOpenChange={setShowShare}>
          <DialogContent className="sm:max-w-md rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-center">Compartir</DialogTitle>
              <DialogDescription className="text-center">
                Comparte este menú en tus redes sociales
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              {shareOptions.map((option) => (
                <Button
                  key={option.name}
                  variant="outline"
                  className="flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
                  onClick={() => handleShare(option)}
                >
                  {option.name}
                </Button>
              ))}
            </div>
            <Button variant="secondary" className="w-full mt-2" onClick={handleCopyLink}>
              Copiar enlace
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default UnifiedBanner;
