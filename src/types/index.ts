export type UserRole = 'client' | 'driver' | 'admin';
export type ServiceType = 'standard' | 'own-car' | 'scheduled';
export type RideStatus = 'searching' | 'driver-found' | 'driver-arriving' | 'in-progress' | 'completed' | 'cancelled';
export type PaymentMethod = 'cash' | 'card' | 'online';

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  profilePhoto?: string;
  rating?: number;
  createdAt: Date;
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
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
  driverId: string;
}

export interface SavedAddress {
  id: string;
  userId: string;
  label: string;
  location: Location;
}

export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  phone: string;
}

export interface Ride {
  id: string;
  clientId: string;
  driverId?: string;
  serviceType: ServiceType;
  status: RideStatus;
  pickup: Location;
  destination: Location;
  estimatedDistance: number;
  estimatedDuration: number;
  estimatedCost: { min: number; max: number };
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

export interface Rating {
  id: string;
  rideId: string;
  fromUserId: string;
  toUserId: string;
  driverRating: number;
  comfort: number;
  cleanliness: number;
  punctuality: number;
  comment?: string;
  tags: string[];
  createdAt: Date;
}

export interface RideRequest {
  id: string;
  rideId: string;
  driverId: string;
  distanceToClient: number;
  estimatedEarnings: number;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  createdAt: Date;
}

export interface UserPreferences {
  userId: string;
  language: 'ro';
  notifications: {
    reminders: boolean;
    promotions: boolean;
    locationReminders: boolean;
  };
}
