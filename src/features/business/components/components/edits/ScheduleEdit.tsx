"use client";

import { ScheduleData, Weekday, TimeInterval } from "@/features/business/types/business-form";
import { useState } from "react";
import DaySelector from "../news/DaySelector";
import DayScheduleEditor from "./DayScheduleEditor";

interface ScheduleEditProps {
  data: Record<Weekday, TimeInterval[]>;
  onSave: (data: Record<Weekday, TimeInterval[]>) => void;
  onCancel: () => void;
}

export default function ScheduleEdit({ data, onSave, onCancel }: ScheduleEditProps) {
  const [formData, setFormData] = useState<Record<Weekday, TimeInterval[]>>(data);

  const handleChangeDay = (day: Weekday, intervals: TimeInterval[]) => {
    setFormData((prev) => ({ ...prev, [day]: intervals }));
  };

  const handleRemoveDay = (day: Weekday) => {
    const updated = { ...formData };
    delete updated[day];
    setFormData(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-gray-50 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">Editar Horarios</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(formData).map(([day, intervals]) => (
          <DayScheduleEditor
            key={day}
            day={day as Weekday}
            intervals={intervals}
            onChange={(updated) => handleChangeDay(day as Weekday, updated)}
            onRemove={() => handleRemoveDay(day as Weekday)}
          />
        ))}
      </div>

      <DaySelector
        existingDays={Object.keys(formData) as Weekday[]}
        onAddDay={(day) => setFormData((prev) => ({ ...prev, [day]: [] }))}
      />

      <div className="flex justify-end gap-3 pt-4 border-t mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}
