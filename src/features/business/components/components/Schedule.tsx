"use client";

import { Clock, Clock2, CircleSlash, CheckCircle } from "lucide-react";
import { useSchedule } from "../../hooks/useSchedule";
import { SkeletonSchedule } from "./Skeleton/SkeletonSchedule";
import dayjs from "dayjs";

interface Props {
  businessId: string;
}

const daysES: Record<string, string> = {
  MONDAY: "Lunes",
  TUESDAY: "Martes",
  WEDNESDAY: "Miércoles",
  THURSDAY: "Jueves",
  FRIDAY: "Viernes",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

type Weekday =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export default function Schedule({ businessId }: Props) {
  const { data, isLoading, isError } = useSchedule(businessId);

  if (isLoading) return <SkeletonSchedule />;
  if (isError || !data) return <p className="text-red-600">No se pudieron cargar los horarios.</p>;

  const today = dayjs().format("dddd").toUpperCase() as Weekday; // e.g. "MONDAY"
  const todayIntervals = data[today] ?? [];
  const isOpenToday = todayIntervals.length > 0;

  return (
    <section className="mt-8">
      {/* Encabezado */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
        <Clock size={24} className="text-blue-600" />
        Horarios de atención
      </h2>

      {/* Estado del día actual */}
      <div className="mb-6 flex items-center gap-2 text-sm font-medium">
        {isOpenToday ? (
          <>
            <CheckCircle size={18} className="text-green-600" />
            <span className="text-green-700">
              Abierto hoy ({todayIntervals.join(", ")})
            </span>
          </>
        ) : (
          <>
            <CircleSlash size={18} className="text-red-500" />
            <span className="text-red-600">Cerrado hoy</span>
          </>
        )}
      </div>

      {/* Lista de todos los días */}
      <ul className="space-y-3 text-gray-800 text-sm">
        {Object.entries(data).map(([day, intervals]) => (
          <li
            key={day}
            className={`flex items-start justify-between px-4 py-2 rounded-lg ${
              day === today ? "bg-blue-50 font-semibold" : "bg-white"
            }`}
          >
            <span className="w-1/3 text-gray-700">{daysES[day]}</span>
            <span className="w-2/3 text-right">
              {intervals.length === 0 ? (
                <span className="text-gray-400 italic">Cerrado</span>
              ) : (
                intervals.join(" / ")
              )}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
