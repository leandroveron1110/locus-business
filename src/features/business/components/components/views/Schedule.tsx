"use client";

import { CheckCircle, CircleSlash } from "lucide-react";
import dayjs from "dayjs";

interface Props {
  data: Record<string, string[]>;
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

export default function Schedule({ data }: Props) {

  const today = dayjs().format("dddd").toUpperCase() as Weekday;
  const todayIntervals = data[today] ?? [];
  const isOpenToday = todayIntervals.length > 0;

  return (
    <section className="mt-8">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          {isOpenToday ? (
            <span className="flex items-center gap-1 text-green-600">
              <CheckCircle size={16} /> Abierto hoy (
              {todayIntervals.map((i, idx) => (
                <span key={idx} className="inline-block px-2 py-0.5 bg-green-50 rounded text-green-700 text-xs font-medium mr-1">
                  {i}
                </span>
              ))}
              )
            </span>
          ) : (
            <span className="flex items-center gap-1 text-red-500">
              <CircleSlash size={16} /> Cerrado hoy
            </span>
          )}
        </div>
      </div>

      {/* Lista de días */}
      <ul className="space-y-2">
        {Object.entries(data).map(([day, intervals]) => (
          <li
            key={day}
            className={`flex flex-col sm:flex-row sm:justify-between px-5 py-3 rounded-xl shadow-sm transition-colors
              ${day === today ? "bg-blue-50 font-semibold border border-blue-100" : "bg-white"}
            `}
          >
            <span className="text-gray-700 mb-1 sm:mb-0">{daysES[day]}</span>
            <div className="flex flex-wrap gap-2">
              {intervals.length === 0 ? (
                <span className="text-gray-500 text-sm">Cerrado</span>
              ) : (
                intervals.map((interval, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-sm font-medium"
                  >
                    {interval}
                  </span>
                ))
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
