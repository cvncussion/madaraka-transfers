"use client"

import { MapPin } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface RouteCardProps {
  route: any;
  onSelect: (route: any) => void;
  selected?: boolean;
}

export function RouteCard({ route, onSelect, selected }: RouteCardProps) {
  return (
    <button
      onClick={() => onSelect(route)}
      className={cn(
        "w-full text-left p-4 bg-white rounded-xl border transition-all hover:shadow-md",
        selected ? "border-mpesa ring-2 ring-mpesa/20" : "hover:border-mpesa"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-mpesa/10 rounded-full flex items-center justify-center">
            <MapPin className="h-5 w-5 text-mpesa" />
          </div>
          <div>
            <p className="font-medium">{route.origin} → {route.destination}</p>
            <p className="text-sm text-muted-foreground">{route.distanceKm} km · {route.durationMin} min</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-mpesa text-lg">{formatCurrency(route.baseFare)}</p>
          {route.doorToDoorEnabled && (
            <p className="text-xs text-muted-foreground">Door-to-door +{formatCurrency(route.doorToDoorFare)}</p>
          )}
        </div>
      </div>
    </button>
  );
}
