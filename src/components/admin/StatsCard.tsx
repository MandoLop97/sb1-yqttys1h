
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  type?: "money" | "number";
  trend?: { value: number; label: string };
  icon?: React.ReactNode;
}

const StatsCard = ({ title, value, type = "money", trend, icon }: StatsCardProps) => {
  const formattedValue = type === "money" 
    ? (typeof value === "number" ? `$${value}` : value) 
    : value;
  
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <CardHeader className="pb-2 pt-3 px-4">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-navy-800">{formattedValue}</div>
            
            {trend && (
              <div className={cn(
                "text-xs mt-1 flex items-center",
                trend.value >= 0 ? "text-green-600" : "text-red-600"
              )}>
                <span className="font-medium">
                  {trend.value >= 0 ? "+" : ""}{trend.value}%
                </span>
                <span className="ml-1 text-gray-600">
                  {trend.label}
                </span>
              </div>
            )}
          </div>
          
          {icon && <div className="text-gray-400">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
