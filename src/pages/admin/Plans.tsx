
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Sidebar from "@/components/admin/Sidebar";

const Plans = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const planData = [
    {
      id: "free",
      name: "Gratuito",
      price: "0",
      features: [
        "Hasta 20 productos",
        "Menú digital básico",
        "Soporte por correo"
      ],
      recommended: false
    },
    {
      id: "basic",
      name: "Básico",
      price: "99",
      features: [
        "Hasta 50 productos",
        "Personalizaciones",
        "QR para mesas",
        "Soporte prioritario"
      ],
      recommended: false
    },
    {
      id: "entrepreneur",
      name: "Emprendedor",
      price: "199",
      features: [
        "Hasta 100 productos",
        "Personalizaciones ilimitadas",
        "Promociones",
        "Análisis de ventas",
        "Soporte prioritario 24/7"
      ],
      recommended: true
    },
    {
      id: "business",
      name: "Negocio",
      price: "999",
      features: [
        "Productos ilimitados",
        "Personalizaciones ilimitadas",
        "Promociones ilimitadas",
        "Análisis de ventas avanzado",
        "Integración con sistemas POS",
        "Soporte VIP"
      ],
      recommended: false
    }
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 p-4">
          <div className="container mx-auto flex items-center justify-between">
            <h1 className="text-xl font-semibold">Planes de suscripción</h1>
            <Button variant="outline" onClick={() => navigate(-1)}>
              Volver
            </Button>
          </div>
        </header>
        
        <main className="flex-1 p-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Elige el plan perfecto para tu negocio</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Contamos con diferentes planes que se adaptan a tus necesidades. Compara y elige el que mejor se ajuste a tu negocio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {planData.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`flex flex-col border-2 ${
                    plan.recommended ? 'border-green-500' : 'border-gray-200'
                  } ${
                    selectedPlan === plan.id ? 'ring-2 ring-green-500' : ''
                  }`}
                >
                  <CardHeader className="pb-4">
                    {plan.recommended && (
                      <Badge className="bg-green-500 hover:bg-green-600 self-start mb-2">
                        Recomendado
                      </Badge>
                    )}
                    <CardTitle>{plan.name}</CardTitle>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-gray-500 ml-1">/mes</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className={`w-full ${plan.recommended ? 'bg-green-500 hover:bg-green-600' : ''}`}
                      variant={plan.recommended ? "default" : "outline"}
                      onClick={() => handleSelectPlan(plan.id)}
                    >
                      {selectedPlan === plan.id ? 'Seleccionado' : 'Seleccionar plan'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {selectedPlan && (
              <div className="mt-8 text-center">
                <Button size="lg" className="bg-green-500 hover:bg-green-600">
                  Continuar con el plan seleccionado
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Plans;
