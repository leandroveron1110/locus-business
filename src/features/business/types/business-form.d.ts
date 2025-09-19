export interface BusinessHeaderData {
  logoUrl?: string;
  name: string;
  shortDescription?: string;
  fullDescription?: string;
}

export interface SocialNetworkData {
  websiteUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
}

export type Weekday =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

// Intervalos de tiempo
export interface TimeInterval {
  start: string;
  end: string;
}

// Datos de horarios: cada día tiene una lista de intervalos
export interface ScheduleData {
  [day: string]: TimeInterval[];
}