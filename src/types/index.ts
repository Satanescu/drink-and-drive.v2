export type UserRole = 'client' | 'driver' | 'admin';
export type ServiceType = 'standard' | 'own-car';
export type RideStatus = 'searching' | 'driver-found' | 'driver-arriving' | 'in-progress' | 'completed' | 'cancelled';
export type PaymentMethod = 'cash' | 'card' | 'online';

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  vehicle_type?: 'car' | 'scooter';
  phone?: string;
  profilePhoto?: string;
  rating?: number;
  createdAt: Date;
  is_online?: boolean;
  current_location_lat?: number;
  current_location_lng?: number;
}

export interface Driver extends User {
  role: 'driver';
  vehicleId?: string;
  isOnline: boolean;
  currentLocation: Location;
  totalRides: number;
  averageRating: number;
  verified: boolean;
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

export interface Ride {
  id: number;
  clientId: string;
  driverId?: string;
  serviceType: ServiceType;
  status: RideStatus;
  pickup: Location;
  destination: Location;
  estimatedDistance: number;
  estimatedDuration: number;
  estimatedCost: {
    min: number;
    max: number;
  };
  actualCost?: number;
  paymentMethod: PaymentMethod;
  promoCode?: string;
  scheduledFor?: Date;
  startedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
  createdAt: Date;
}