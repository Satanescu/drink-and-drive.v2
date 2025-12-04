export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'client' | 'driver';
  vehicle_type?: 'car' | 'scooter';
  phone?: string;
  profilePhoto?: string;
  rating?: number;
  createdAt: Date;
  is_online?: boolean;
  current_location_lat?: number;
  current_location_lng?: number;
}

export interface Vehicle {
  id: string;
  driver_id: string;
  vehicle_type: 'car' | 'scooter';
  license_plate?: string;
  manufacturer?: string;
  model?: string;
  year?: number;
  color?: string;
  category?: string;
  insurance_details?: string;
  photo_url?: string;
}

export interface Location {
  lat: number;
  lng: number;
}

export type ServiceType = 'standard' | 'own-car';

export interface Ride {
  id: number;
  pickup: string;
  destination: string;
  price: number;
  time: string;
}
