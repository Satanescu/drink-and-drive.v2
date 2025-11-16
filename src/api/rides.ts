import { Ride, RideRequest, Driver, Rating, ServiceType, Location } from '../types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockDrivers: Driver[] = [
  {
    id: 'd1',
    fullName: 'Andrei Popa',
    email: 'andrei@driver.com',
    phone: '+40 723 456 789',
    role: 'driver',
    vehicleId: 'v1',
    isOnline: true,
    currentLocation: { lat: 44.4368, lng: 26.1025, address: 'Piața Unirii, București' },
    totalRides: 234,
    averageRating: 4.9,
    verified: true,
    createdAt: new Date('2023-06-10'),
  },
  {
    id: 'd2',
    fullName: 'Elena Dumitrescu',
    email: 'elena@driver.com',
    phone: '+40 724 567 890',
    role: 'driver',
    vehicleId: 'v2',
    isOnline: true,
    currentLocation: { lat: 44.4468, lng: 26.0925, address: 'Universitate, București' },
    totalRides: 189,
    averageRating: 4.8,
    verified: true,
    createdAt: new Date('2023-08-15'),
  },
];

let mockRides: Ride[] = [
  {
    id: 'r1',
    clientId: '1',
    driverId: 'd1',
    serviceType: 'standard',
    status: 'completed',
    pickup: { lat: 44.4268, lng: 26.1025, address: 'Strada Lipscani 15, București' },
    destination: { lat: 44.4468, lng: 26.0825, address: 'Calea Victoriei 120, București' },
    estimatedDistance: 3.2,
    estimatedDuration: 12,
    estimatedCost: { min: 25, max: 35 },
    actualCost: 28,
    paymentMethod: 'cash',
    startedAt: new Date('2024-01-10T20:30:00'),
    completedAt: new Date('2024-01-10T20:45:00'),
    createdAt: new Date('2024-01-10T20:25:00'),
  },
];

export const ridesAPI = {
  async createRide(data: {
    clientId: string;
    serviceType: ServiceType;
    pickup: Location;
    destination: Location;
    paymentMethod: string;
    promoCode?: string;
  }): Promise<Ride> {
    await delay(1500);

    const distance = Math.random() * 10 + 2;
    const duration = Math.round(distance * 3 + Math.random() * 5);
    const baseCost = distance * 8 + 15;

    const newRide: Ride = {
      id: `r${mockRides.length + 1}`,
      clientId: data.clientId,
      driverId: undefined,
      serviceType: data.serviceType,
      status: 'searching',
      pickup: data.pickup,
      destination: data.destination,
      estimatedDistance: parseFloat(distance.toFixed(1)),
      estimatedDuration: duration,
      estimatedCost: {
        min: Math.round(baseCost * 0.9),
        max: Math.round(baseCost * 1.1),
      },
      paymentMethod: data.paymentMethod as 'cash' | 'card' | 'online',
      promoCode: data.promoCode,
      createdAt: new Date(),
    };

    mockRides.push(newRide);
    return newRide;
  },

  async findDriver(rideId: string): Promise<{ ride: Ride; driver: Driver }> {
    await delay(2000);

    const ride = mockRides.find((r) => r.id === rideId);
    if (!ride) {
      throw new Error('Cursa nu a fost găsită');
    }

    const availableDriver = mockDrivers.find((d) => d.isOnline);
    if (!availableDriver) {
      throw new Error('Nu am găsit șoferi disponibili');
    }

    ride.driverId = availableDriver.id;
    ride.status = 'driver-found';

    return { ride, driver: availableDriver };
  },

  async getRideById(rideId: string): Promise<Ride> {
    await delay(500);

    const ride = mockRides.find((r) => r.id === rideId);
    if (!ride) {
      throw new Error('Cursa nu a fost găsită');
    }

    return ride;
  },

  async getRideHistory(
    userId: string,
    filters?: { serviceType?: ServiceType; period?: 'week' | 'month' | 'all' }
  ): Promise<Ride[]> {
    await delay(800);

    let rides = mockRides.filter((r) => r.clientId === userId && r.status === 'completed');

    if (filters?.serviceType) {
      rides = rides.filter((r) => r.serviceType === filters.serviceType);
    }

    if (filters?.period) {
      const now = new Date();
      const filterDate = new Date();

      if (filters.period === 'week') {
        filterDate.setDate(now.getDate() - 7);
      } else if (filters.period === 'month') {
        filterDate.setMonth(now.getMonth() - 1);
      }

      if (filters.period !== 'all') {
        rides = rides.filter((r) => r.createdAt >= filterDate);
      }
    }

    return rides.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  async updateRideStatus(rideId: string, status: Ride['status']): Promise<Ride> {
    await delay(500);

    const ride = mockRides.find((r) => r.id === rideId);
    if (!ride) {
      throw new Error('Cursa nu a fost găsită');
    }

    ride.status = status;

    if (status === 'in-progress' && !ride.startedAt) {
      ride.startedAt = new Date();
    }

    if (status === 'completed' && !ride.completedAt) {
      ride.completedAt = new Date();
      ride.actualCost = Math.round(
        (ride.estimatedCost.min + ride.estimatedCost.max) / 2 + Math.random() * 10 - 5
      );
    }

    return ride;
  },

  async cancelRide(rideId: string, reason: string): Promise<Ride> {
    await delay(500);

    const ride = mockRides.find((r) => r.id === rideId);
    if (!ride) {
      throw new Error('Cursa nu a fost găsită');
    }

    ride.status = 'cancelled';
    ride.cancelledAt = new Date();
    ride.cancelReason = reason;

    return ride;
  },

  async submitRating(data: {
    rideId: string;
    fromUserId: string;
    toUserId: string;
    driverRating: number;
    comfort: number;
    cleanliness: number;
    punctuality: number;
    comment?: string;
    tags: string[];
  }): Promise<Rating> {
    await delay(800);

    const rating: Rating = {
      id: `rating-${Date.now()}`,
      ...data,
      createdAt: new Date(),
    };

    return rating;
  },

  async getAvailableDrivers(location: Location): Promise<Driver[]> {
    await delay(600);
    return mockDrivers.filter((d) => d.isOnline);
  },

  async getNearbyRideRequests(driverId: string): Promise<RideRequest[]> {
    await delay(700);

    const pendingRides = mockRides.filter((r) => r.status === 'searching' && !r.driverId);

    return pendingRides.map((ride, index) => ({
      id: `req-${ride.id}`,
      rideId: ride.id,
      driverId,
      distanceToClient: Math.random() * 5 + 0.5,
      estimatedEarnings: Math.round((ride.estimatedCost.min + ride.estimatedCost.max) / 2),
      status: 'pending',
      createdAt: new Date(),
    }));
  },

  async acceptRideRequest(requestId: string, driverId: string): Promise<{ ride: Ride }> {
    await delay(1000);

    const ride = mockRides.find((r) => `req-${r.id}` === requestId);
    if (!ride) {
      throw new Error('Cererea nu a fost găsită');
    }

    ride.driverId = driverId;
    ride.status = 'driver-found';

    return { ride };
  },
};
