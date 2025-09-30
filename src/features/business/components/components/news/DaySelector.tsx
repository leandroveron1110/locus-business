"use client";

import { useState } from "react";
import { Weekday } from "@/features/business/types/business-form";
import { Plus, ChevronDown } from "lucide-react";

const daysES: Record<Weekday, string> = {
  MONDAY: "Lunes",
  TUESDAY: "Martes",
  WEDNESDAY: "Miércoles",
  THURSDAY: "Jueves",
  FRIDAY: "Viernes",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

interface DaySelectorProps {
  existingDays: Weekday[];
  onAddDay: (day: Weekday) => void;
}

export default function DaySelector({
  existingDays,
  onAddDay,
}: DaySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const availableDays = (Object.keys(daysES) as Weekday[]).filter(
    (day) => !existingDays.includes(day)
  );
  if (availableDays.length === 0) return null;

  const handleSelectDay = (day: Weekday) => {
    onAddDay(day);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex justify-center items-center gap-2 w-full px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <Plus size={16} />
        Añadir un nuevo día
        <ChevronDown size={16} className="-mr-1 h-5 w-5" />
      </button>

      {isOpen && (
        <div className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {availableDays.map((day) => (
              <button
                key={day}
                onClick={() => handleSelectDay(day)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors"
              >
                {daysES[day]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
