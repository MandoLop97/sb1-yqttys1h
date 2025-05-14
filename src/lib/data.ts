
import { Category, MenuItem } from "./types";

export const menuCategories: Category[] = [
  { id: "entradas", name: "Entradas" },
  { id: "principales", name: "Platos Principales" },
  { id: "postres", name: "Postres" },
  { id: "bebidas", name: "Bebidas" }
];

export const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Nachos con Guacamole",
    description: "Crujientes nachos con guacamole fresco, crema agria y salsa picante.",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?q=80&w=500&auto=format",
    category: "entradas"
  },
  {
    id: "2",
    name: "Alitas de Pollo",
    description: "Alitas de pollo crujientes bañadas en salsa BBQ o Buffalo.",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1608039755401-742074f0548d?q=80&w=500&auto=format",
    category: "entradas"
  },
  {
    id: "3",
    name: "Ensalada César",
    description: "Clásica ensalada con lechuga romana, crutones, queso parmesano y aderezo César.",
    price: 7.99,
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=500&auto=format",
    category: "entradas"
  },
  {
    id: "4",
    name: "Hamburguesa Clásica",
    description: "Jugosa hamburguesa de res con queso cheddar, lechuga, tomate y cebolla.",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=500&auto=format",
    category: "principales"
  },
  {
    id: "5",
    name: "Pizza Margarita",
    description: "Deliciosa pizza con salsa de tomate, mozzarella fresca y albahaca.",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=500&auto=format",
    category: "principales"
  },
  {
    id: "6",
    name: "Tacos de Carnitas",
    description: "Tres tacos de carnitas con cebolla, cilantro y salsa verde.",
    price: 10.99,
    image: "https://images.unsplash.com/photo-1613514785940-daed07799d9b?q=80&w=500&auto=format",
    category: "principales"
  },
  {
    id: "7",
    name: "Pasta Alfredo",
    description: "Cremosa pasta alfredo con pollo a la parrilla y parmesano.",
    price: 13.99,
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023402c?q=80&w=500&auto=format",
    category: "principales"
  },
  {
    id: "8",
    name: "Tarta de Chocolate",
    description: "Deliciosa tarta de chocolate con helado de vainilla.",
    price: 6.99,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=500&auto=format",
    category: "postres"
  },
  {
    id: "9",
    name: "Tiramisú",
    description: "Clásico postre italiano con capas de bizcocho, café y queso mascarpone.",
    price: 7.99,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=500&auto=format",
    category: "postres"
  },
  {
    id: "10",
    name: "Helado Artesanal",
    description: "Variedad de helados artesanales. Pregunta por los sabores del día.",
    price: 5.99,
    image: "https://images.unsplash.com/photo-1629385701021-6d834188ce7d?q=80&w=500&auto=format",
    category: "postres"
  },
  {
    id: "11",
    name: "Refresco",
    description: "Variedad de refrescos con o sin gas.",
    price: 2.50,
    image: "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?q=80&w=500&auto=format",
    category: "bebidas"
  },
  {
    id: "12",
    name: "Cerveza Artesanal",
    description: "Selección de cervezas artesanales. Pregunta por las opciones.",
    price: 4.99,
    image: "https://images.unsplash.com/photo-1566633806327-68e152aaf26d?q=80&w=500&auto=format",
    category: "bebidas"
  }
];
