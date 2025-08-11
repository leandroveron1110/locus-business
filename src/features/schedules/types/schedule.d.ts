// src/features/schedules/types/schedule.d.ts

// Enum para los días de la semana. Usado en los horarios de negocios.
export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

// Interfaz para el modelo WeeklySchedule
export interface WeeklySchedule {
  id: string;
  businessId: string;
  dayOfWeek: DayOfWeek;
  openingTime: string; // Se espera string en formato de hora (ej. "10:00:00")
  closingTime: string; // Se espera string en formato de hora (ej. "18:00:00")
  createdAt: string;
  updatedAt: string;
}

// Interfaz para el modelo SpecialSchedule (no se usará en la tarjeta, pero es parte del módulo)
export interface SpecialSchedule {
  id: string;
  businessId: string;
  date: string; // Se espera string en formato de fecha (ej. "YYYY-MM-DD")
  openingTime?: string; // Se espera string en formato de hora
  closingTime?: string; // Se espera string en formato de hora
  closedAllDay: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
