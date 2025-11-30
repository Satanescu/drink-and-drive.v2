export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'user' | 'driver';
}

export interface Location {
  lat: number;
  lng: number;
}

export type ServiceType = 'standard' | 'own-car';
