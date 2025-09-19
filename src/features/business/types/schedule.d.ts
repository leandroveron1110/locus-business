export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export interface WeeklyScheduleItem {
  dayOfWeek: DayOfWeek;
  openingTime: string;
  closingTime: string;
}

export interface WeeklyScheduleData {
  businessId: string;
  schedules: WeeklyScheduleItem[];
}