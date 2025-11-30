export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'client' | 'driver';
}

export interface Location {
  lat: number;
  lng: number;
}

export type ServiceType = 'standard' | 'own-car';
