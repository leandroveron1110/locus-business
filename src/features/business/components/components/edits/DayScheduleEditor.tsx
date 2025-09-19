// DayScheduleEditor.tsx
import React, { memo } from 'react';
import { DaysOfTheWeek } from '@/features/business/types/business';
import { Plus, Trash2, X } from 'lucide-react';

// 🔹 Diccionario para traducir del inglés al español
const daysES: Record<DaysOfTheWeek, string> = {
  MONDAY: 'Lunes',
  TUESDAY: 'Martes',
  WEDNESDAY: 'Miércoles',
  THURSDAY: 'Jueves',
  FRIDAY: 'Viernes',
  SATURDAY: 'Sábado',
  SUNDAY: 'Domingo',
};

interface Props {
  day: DaysOfTheWeek;
  times: string[]; // ["09:00-17:00", ...]
  onUpdate: (day: DaysOfTheWeek, newTimes: string[]) => void;
  onRemove: (day: DaysOfTheWeek) => void;
}

const DayScheduleEditor: React.FC<Props> = ({ day, times, onUpdate, onRemove }) => {

  const parseInterval = (interval: string) => {
    const [start, end] = interval.split('-');
    return { start: start || '', end: end || '' };
  };

  const handleIntervalChange = (index: number, field: 'start' | 'end', value: string) => {
    const newTimes = [...times];
    const { start, end } = parseInterval(newTimes[index]);
    newTimes[index] = field === 'start' ? `${value}-${end}` : `${start}-${value}`;
    onUpdate(day, newTimes);
  };

  const handleAddInterval = () => {
    onUpdate(day, [...times, '09:00-17:00']);
  };

  const handleRemoveInterval = (index: number) => {
    const newTimes = times.filter((_, i) => i !== index);
    onUpdate(day, newTimes);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-5 border border-gray-200 mb-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">{daysES[day]}</h3>
        <button
          onClick={() => onRemove(day)}
          className="text-red-500 hover:text-red-700 transition-colors"
          title="Eliminar día"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Lista de intervalos */}
      <div className="space-y-3">
        {times.map((interval, index) => {
          const { start, end } = parseInterval(interval);
          return (
            <div key={index} className="flex items-center gap-2">
              <input
                type="time"
                value={start}
                onChange={(e) => handleIntervalChange(index, 'start', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-gray-500">-</span>
              <input
                type="time"
                value={end}
                onChange={(e) => handleIntervalChange(index, 'end', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={() => handleRemoveInterval(index)}
                className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-md"
                title="Eliminar intervalo"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Botón agregar intervalo */}
      <button
        onClick={handleAddInterval}
        className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:underline text-sm font-medium transition-colors"
      >
        <Plus size={16} />
        Agregar intervalo
      </button>
    </div>
  );
};

export default memo(DayScheduleEditor);
