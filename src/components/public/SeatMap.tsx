"use client"

import { useState } from "react";
import { cn } from "@/lib/utils";

interface SeatMapProps {
  capacity: number;
  occupiedSeats: number[];
  selectedSeats: number[];
  onSeatSelect: (seats: number[]) => void;
  maxSelectable: number;
}

export function SeatMap({ capacity, occupiedSeats, selectedSeats, onSeatSelect, maxSelectable }: SeatMapProps) {
  const seatsPerRow = capacity <= 11 ? 4 : capacity <= 16 ? 5 : 6;
  const rows = Math.ceil(capacity / seatsPerRow);

  const handleSeatClick = (seatNum: number) => {
    if (occupiedSeats.includes(seatNum)) return;
    if (selectedSeats.includes(seatNum)) {
      onSeatSelect(selectedSeats.filter(s => s !== seatNum));
    } else if (selectedSeats.length < maxSelectable) {
      onSeatSelect([...selectedSeats, seatNum]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-end mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-xs font-medium text-gray-500">DRV</div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div key={rowIdx} className="flex gap-2 justify-center">
            {Array.from({ length: seatsPerRow }).map((_, colIdx) => {
              const seatNum = rowIdx * seatsPerRow + colIdx + 1;
              if (seatNum > capacity) return null;
              const isOccupied = occupiedSeats.includes(seatNum);
              const isSelected = selectedSeats.includes(seatNum);
              return (
                <button
                  key={seatNum}
                  onClick={() => handleSeatClick(seatNum)}
                  disabled={isOccupied}
                  className={cn(
                    "w-10 h-10 rounded-lg text-sm font-medium transition-colors",
                    isOccupied && "bg-red-100 text-red-500 cursor-not-allowed",
                    isSelected && "bg-mpesa text-white",
                    !isOccupied && !isSelected && "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  )}
                >{seatNum}</button>
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex gap-4 justify-center text-sm mt-4">
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-100 rounded" /><span>Available</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-mpesa rounded" /><span>Selected</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-100 rounded" /><span>Occupied</span></div>
      </div>
    </div>
  );
}
