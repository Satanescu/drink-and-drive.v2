import { supabase } from '../lib/supabase';
import { Ride, RideRequest, Driver, Rating, ServiceType, Location, RideStatus, PaymentMethod } from '../types';

export const ridesAPI = {
  async createRide(data: {
    clientId: string;
    serviceType: ServiceType;
    pickup: Location;
    destination: Location;
    paymentMethod: string;
    promoCode?: string;
  }): Promise<Ride> {
    const { data: newRideData, error } = await supabase
      .from('rides')
      .insert({
        client_id: data.clientId,
        service_type: data.serviceType,
        status: 'searching',
        pickup_lat: data.pickup.lat,
        pickup_lng: data.pickup.lng,
        pickup_address: data.pickup.address,
        destination_lat: data.destination.lat,
        destination_lng: data.destination.lng,
        destination_address: data.destination.address,
        payment_method: data.paymentMethod,
        promo_code: data.promoCode,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Simulate estimated distance, duration, and cost for now
    const distance = Math.random() * 10 + 2;
    const duration = Math.round(distance * 3 + Math.random() * 5);
    const baseCost = distance * 8 + 15;

    const updatedRideData = {
      estimated_distance: parseFloat(distance.toFixed(1)),
      estimated_duration: duration,
      estimated_cost_min: Math.round(baseCost * 0.9),
      estimated_cost_max: Math.round(baseCost * 1.1),
    };

    const { data: finalRideData, error: updateError } = await supabase
      .from('rides')
      .update(updatedRideData)
      .eq('id', newRideData.id)
      .select()
      .single();

    if (updateError) {
      throw new Error(updateError.message);
    }

    return {
      id: finalRideData.id,
      clientId: finalRideData.client_id,
      driverId: finalRideData.driver_id || undefined,
      serviceType: finalRideData.service_type as ServiceType,
      status: finalRideData.status as RideStatus,
      pickup: {
        lat: finalRideData.pickup_lat,
        lng: finalRideData.pickup_lng,
        address: finalRideData.pickup_address || undefined,
      },
      destination: {
        lat: finalRideData.destination_lat,
        lng: finalRideData.destination_lng,
        address: finalRideData.destination_address || undefined,
      },
      estimatedDistance: finalRideData.estimated_distance,
      estimatedDuration: finalRideData.estimated_duration,
      estimatedCost: {
        min: finalRideData.estimated_cost_min,
        max: finalRideData.estimated_cost_max,
      },
      actualCost: finalRideData.actual_cost || undefined,
      paymentMethod: finalRideData.payment_method as PaymentMethod,
      promoCode: finalRideData.promo_code || undefined,
      scheduledFor: finalRideData.scheduled_for ? new Date(finalRideData.scheduled_for) : undefined,
      startedAt: finalRideData.started_at ? new Date(finalRideData.started_at) : undefined,
      completedAt: finalRideData.completed_at ? new Date(finalRideData.completed_at) : undefined,
      cancelledAt: finalRideData.cancelled_at ? new Date(finalRideData.cancelled_at) : undefined,
      cancelReason: finalRideData.cancel_reason || undefined,
      createdAt: new Date(finalRideData.created_at),
    };
  },

  async findDriver(rideId: string): Promise<{ ride: Ride; driver: Driver }> {
    // Find an available driver (this is a simplified mock for now)
    const { data: availableDrivers, error: driverError } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'driver')
      .eq('is_online', true)
      .limit(1);

    if (driverError) {
      throw new Error(driverError.message);
    }

    if (!availableDrivers || availableDrivers.length === 0) {
      throw new Error('Nu am găsit șoferi disponibili');
    }

    const availableDriverProfile = availableDrivers[0];

    // Update the ride with the found driver
    const { data: updatedRideData, error: rideUpdateError } = await supabase
      .from('rides')
      .update({
        driver_id: availableDriverProfile.id,
        status: 'driver-found',
      })
      .eq('id', rideId)
      .select()
      .single();

    if (rideUpdateError) {
      throw new Error(rideUpdateError.message);
    }

    const driver: Driver = {
      id: availableDriverProfile.id,
      fullName: availableDriverProfile.full_name,
      email: availableDriverProfile.email || '',
      phone: availableDriverProfile.phone,
      role: availableDriverProfile.role as 'driver',
      vehicleId: availableDriverProfile.vehicle_id || undefined,
      isOnline: availableDriverProfile.is_online,
      currentLocation: {
        lat: availableDriverProfile.current_location_lat,
        lng: availableDriverProfile.current_location_lng,
        address: availableDriverProfile.current_location_address || undefined,
      },
      totalRides: availableDriverProfile.total_rides || 0,
      averageRating: availableDriverProfile.average_rating || 0,
      verified: availableDriverProfile.verified || false,
      createdAt: new Date(availableDriverProfile.created_at),
    };

    const ride: Ride = {
      id: updatedRideData.id,
      clientId: updatedRideData.client_id,
      driverId: updatedRideData.driver_id || undefined,
      serviceType: updatedRideData.service_type as ServiceType,
      status: updatedRideData.status as RideStatus,
      pickup: {
        lat: updatedRideData.pickup_lat,
        lng: updatedRideData.pickup_lng,
        address: updatedRideData.pickup_address || undefined,
      },
      destination: {
        lat: updatedRideData.destination_lat,
        lng: updatedRideData.destination_lng,
        address: updatedRideData.destination_address || undefined,
      },
      estimatedDistance: updatedRideData.estimated_distance,
      estimatedDuration: updatedRideData.estimated_duration,
      estimatedCost: {
        min: updatedRideData.estimated_cost_min,
        max: updatedRideData.estimated_cost_max,
      },
      actualCost: updatedRideData.actual_cost || undefined,
      paymentMethod: updatedRideData.payment_method as PaymentMethod,
      promoCode: updatedRideData.promo_code || undefined,
      scheduledFor: updatedRideData.scheduled_for ? new Date(updatedRideData.scheduled_for) : undefined,
      startedAt: updatedRideData.started_at ? new Date(updatedRideData.started_at) : undefined,
      completedAt: updatedRideData.completed_at ? new Date(updatedRideData.completed_at) : undefined,
      cancelledAt: updatedRideData.cancelled_at ? new Date(updatedRideData.cancelled_at) : undefined,
      cancelReason: updatedRideData.cancel_reason || undefined,
      createdAt: new Date(updatedRideData.created_at),
    };

    return { ride, driver };
  },

  async getRideById(rideId: string): Promise<Ride> {
    const { data: rideData, error } = await supabase
      .from('rides')
      .select('*')
      .eq('id', rideId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!rideData) {
      throw new Error('Cursa nu a fost găsită');
    }

    return {
      id: rideData.id,
      clientId: rideData.client_id,
      driverId: rideData.driver_id || undefined,
      serviceType: rideData.service_type as ServiceType,
      status: rideData.status as RideStatus,
      pickup: {
        lat: rideData.pickup_lat,
        lng: rideData.pickup_lng,
        address: rideData.pickup_address || undefined,
      },
      destination: {
        lat: rideData.destination_lat,
        lng: rideData.destination_lng,
        address: rideData.destination_address || undefined,
      },
      estimatedDistance: rideData.estimated_distance,
      estimatedDuration: rideData.estimated_duration,
      estimatedCost: {
        min: rideData.estimated_cost_min,
        max: rideData.estimated_cost_max,
      },
      actualCost: rideData.actual_cost || undefined,
      paymentMethod: rideData.payment_method as PaymentMethod,
      promoCode: rideData.promo_code || undefined,
      scheduledFor: rideData.scheduled_for ? new Date(rideData.scheduled_for) : undefined,
      startedAt: rideData.started_at ? new Date(rideData.started_at) : undefined,
      completedAt: rideData.completed_at ? new Date(rideData.completed_at) : undefined,
      cancelledAt: rideData.cancelled_at ? new Date(rideData.cancelled_at) : undefined,
      cancelReason: rideData.cancel_reason || undefined,
      createdAt: new Date(rideData.created_at),
    };
  },

  async getRideHistory(
    userId: string,
    filters?: { serviceType?: ServiceType; period?: 'week' | 'month' | 'all' }
  ): Promise<Ride[]> {
    let query = supabase
      .from('rides')
      .select('*')
      .eq('client_id', userId)
      .eq('status', 'completed')
      .order('created_at', { ascending: false });

    if (filters?.serviceType) {
      query = query.eq('service_type', filters.serviceType);
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
        query = query.gte('created_at', filterDate.toISOString());
      }
    }

    const { data: ridesData, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return ridesData.map((rideData) => ({
      id: rideData.id,
      clientId: rideData.client_id,
      driverId: rideData.driver_id || undefined,
      serviceType: rideData.service_type as ServiceType,
      status: rideData.status as RideStatus,
      pickup: {
        lat: rideData.pickup_lat,
        lng: rideData.pickup_lng,
        address: rideData.pickup_address || undefined,
      },
      destination: {
        lat: rideData.destination_lat,
        lng: rideData.destination_lng,
        address: rideData.destination_address || undefined,
      },
      estimatedDistance: rideData.estimated_distance,
      estimatedDuration: rideData.estimated_duration,
      estimatedCost: {
        min: rideData.estimated_cost_min,
        max: rideData.estimated_cost_max,
      },
      actualCost: rideData.actual_cost || undefined,
      paymentMethod: rideData.payment_method as PaymentMethod,
      promoCode: rideData.promo_code || undefined,
      scheduledFor: rideData.scheduled_for ? new Date(rideData.scheduled_for) : undefined,
      startedAt: rideData.started_at ? new Date(rideData.started_at) : undefined,
      completedAt: rideData.completed_at ? new Date(rideData.completed_at) : undefined,
      cancelledAt: rideData.cancelled_at ? new Date(rideData.cancelled_at) : undefined,
      cancelReason: rideData.cancel_reason || undefined,
      createdAt: new Date(rideData.created_at),
    }));
  },

  async updateRideStatus(rideId: string, status: Ride['status']): Promise<Ride> {
    const updates: Partial<Ride> = { status };

    if (status === 'in-progress' && !updates.startedAt) {
      updates.startedAt = new Date();
    }

    if (status === 'completed' && !updates.completedAt) {
      updates.completedAt = new Date();
      // Simulate actual cost for now
      // This should ideally be calculated based on actual distance/duration
      const { data: currentRide, error: fetchError } = await supabase
        .from('rides')
        .select('estimated_cost_min, estimated_cost_max')
        .eq('id', rideId)
        .single();

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      updates.actualCost = Math.round(
        ((currentRide.estimated_cost_min + currentRide.estimated_cost_max) / 2) + Math.random() * 10 - 5
      );
    }

    const { data: updatedRideData, error } = await supabase
      .from('rides')
      .update({
        status: updates.status,
        started_at: updates.startedAt?.toISOString(),
        completed_at: updates.completedAt?.toISOString(),
        actual_cost: updates.actualCost,
      })
      .eq('id', rideId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      id: updatedRideData.id,
      clientId: updatedRideData.client_id,
      driverId: updatedRideData.driver_id || undefined,
      serviceType: updatedRideData.service_type as ServiceType,
      status: updatedRideData.status as RideStatus,
      pickup: {
        lat: updatedRideData.pickup_lat,
        lng: updatedRideData.pickup_lng,
        address: updatedRideData.pickup_address || undefined,
      },
      destination: {
        lat: updatedRideData.destination_lat,
        lng: updatedRideData.destination_lng,
        address: updatedRideData.destination_address || undefined,
      },
      estimatedDistance: updatedRideData.estimated_distance,
      estimatedDuration: updatedRideData.estimated_duration,
      estimatedCost: {
        min: updatedRideData.estimated_cost_min,
        max: updatedRideData.estimated_cost_max,
      },
      actualCost: updatedRideData.actual_cost || undefined,
      paymentMethod: updatedRideData.payment_method as PaymentMethod,
      promoCode: updatedRideData.promo_code || undefined,
      scheduledFor: updatedRideData.scheduled_for ? new Date(updatedRideData.scheduled_for) : undefined,
      startedAt: updatedRideData.started_at ? new Date(updatedRideData.started_at) : undefined,
      completedAt: updatedRideData.completed_at ? new Date(updatedRideData.completed_at) : undefined,
      cancelledAt: updatedRideData.cancelled_at ? new Date(updatedRideData.cancelled_at) : undefined,
      cancelReason: updatedRideData.cancel_reason || undefined,
      createdAt: new Date(updatedRideData.created_at),
    };
  },

  async cancelRide(rideId: string, reason: string): Promise<Ride> {
    const { data: updatedRideData, error } = await supabase
      .from('rides')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancel_reason: reason,
      })
      .eq('id', rideId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      id: updatedRideData.id,
      clientId: updatedRideData.client_id,
      driverId: updatedRideData.driver_id || undefined,
      serviceType: updatedRideData.service_type as ServiceType,
      status: updatedRideData.status as RideStatus,
      pickup: {
        lat: updatedRideData.pickup_lat,
        lng: updatedRideData.pickup_lng,
        address: updatedRideData.pickup_address || undefined,
      },
      destination: {
        lat: updatedRideData.destination_lat,
        lng: updatedRideData.destination_lng,
        address: updatedRideData.destination_address || undefined,
      },
      estimatedDistance: updatedRideData.estimated_distance,
      estimatedDuration: updatedRideData.estimated_duration,
      estimatedCost: {
        min: updatedRideData.estimated_cost_min,
        max: updatedRideData.estimated_cost_max,
      },
      actualCost: updatedRideData.actual_cost || undefined,
      paymentMethod: updatedRideData.payment_method as PaymentMethod,
      promoCode: updatedRideData.promo_code || undefined,
      scheduledFor: updatedRideData.scheduled_for ? new Date(updatedRideData.scheduled_for) : undefined,
      startedAt: updatedRideData.started_at ? new Date(updatedRideData.started_at) : undefined,
      completedAt: updatedRideData.completed_at ? new Date(updatedRideData.completed_at) : undefined,
      cancelledAt: updatedRideData.cancelled_at ? new Date(updatedRideData.cancelled_at) : undefined,
      cancelReason: updatedRideData.cancel_reason || undefined,
      createdAt: new Date(updatedRideData.created_at),
    };
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
    const { data: newRatingData, error } = await supabase
      .from('ratings')
      .insert({
        ride_id: data.rideId,
        from_user_id: data.fromUserId,
        to_user_id: data.toUserId,
        driver_rating: data.driverRating,
        comfort: data.comfort,
        cleanliness: data.cleanliness,
        punctuality: data.punctuality,
        comment: data.comment,
        tags: data.tags,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      id: newRatingData.id,
      rideId: newRatingData.ride_id,
      fromUserId: newRatingData.from_user_id,
      toUserId: newRatingData.to_user_id,
      driverRating: newRatingData.driver_rating,
      comfort: newRatingData.comfort,
      cleanliness: newRatingData.cleanliness,
      punctuality: newRatingData.punctuality,
      comment: newRatingData.comment || undefined,
      tags: newRatingData.tags,
      createdAt: new Date(newRatingData.created_at),
    };
  },

  async getAvailableDrivers(): Promise<Driver[]> {
    const { data: driversData, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'driver')
      .eq('is_online', true);

    if (error) {
      throw new Error(error.message);
    }

    return driversData.map((driverData) => ({
      id: driverData.id,
      fullName: driverData.full_name,
      email: driverData.email || '',
      phone: driverData.phone,
      role: driverData.role as 'driver',
      vehicleId: driverData.vehicle_id || undefined,
      isOnline: driverData.is_online,
      currentLocation: {
        lat: driverData.current_location_lat,
        lng: driverData.current_location_lng,
        address: driverData.current_location_address || undefined,
      },
      totalRides: driverData.total_rides || 0,
      averageRating: driverData.average_rating || 0,
      verified: driverData.verified || false,
      createdAt: new Date(driverData.created_at),
    }));
  },

  async getNearbyRideRequests(driverId: string): Promise<RideRequest[]> {
    const { data: rideRequestsData, error } = await supabase
      .from('ride_requests')
      .select('*')
      .eq('driver_id', driverId)
      .eq('status', 'pending');

    if (error) {
      throw new Error(error.message);
    }

    return rideRequestsData.map((requestData) => ({
      id: requestData.id,
      rideId: requestData.ride_id,
      driverId: requestData.driver_id,
      distanceToClient: requestData.distance_to_client,
      estimatedEarnings: requestData.estimated_earnings,
      status: requestData.status as 'pending' | 'accepted' | 'rejected' | 'expired',
      createdAt: new Date(requestData.created_at),
    }));
  },

  async acceptRideRequest(requestId: string, driverId: string): Promise<{ ride: Ride }> {
    // Update the ride request status
    const { error: requestUpdateError } = await supabase
      .from('ride_requests')
      .update({ status: 'accepted' })
      .eq('id', requestId);

    if (requestUpdateError) {
      throw new Error(requestUpdateError.message);
    }

    // Get the ride ID from the request
    const { data: rideRequest, error: fetchRequestError } = await supabase
      .from('ride_requests')
      .select('ride_id')
      .eq('id', requestId)
      .single();

    if (fetchRequestError || !rideRequest) {
      throw new Error('Cererea nu a fost găsită');
    }

    // Update the ride status and assign driver
    const { data: updatedRideData, error: rideUpdateError } = await supabase
      .from('rides')
      .update({
        driver_id: driverId,
        status: 'driver-found',
      })
      .eq('id', rideRequest.ride_id)
      .select()
      .single();

    if (rideUpdateError) {
      throw new Error(rideUpdateError.message);
    }

    return {
      ride: {
        id: updatedRideData.id,
        clientId: updatedRideData.client_id,
        driverId: updatedRideData.driver_id || undefined,
        serviceType: updatedRideData.service_type as ServiceType,
        status: updatedRideData.status as RideStatus,
        pickup: {
          lat: updatedRideData.pickup_lat,
          lng: updatedRideData.pickup_lng,
          address: updatedRideData.pickup_address || undefined,
        },
        destination: {
          lat: updatedRideData.destination_lat,
          lng: updatedRideData.destination_lng,
          address: updatedRideData.destination_address || undefined,
        },
        estimatedDistance: updatedRideData.estimated_distance,
        estimatedDuration: updatedRideData.estimated_duration,
        estimatedCost: {
          min: updatedRideData.estimated_cost_min,
          max: updatedRideData.estimated_cost_max,
        },
        actualCost: updatedRideData.actual_cost || undefined,
        paymentMethod: updatedRideData.payment_method as PaymentMethod,
        promoCode: updatedRideData.promo_code || undefined,
        scheduledFor: updatedRideData.scheduled_for ? new Date(updatedRideData.scheduled_for) : undefined,
        startedAt: updatedRideData.started_at ? new Date(updatedRideData.started_at) : undefined,
        completedAt: updatedRideData.completed_at ? new Date(updatedRideData.completed_at) : undefined,
        cancelledAt: updatedRideData.cancelled_at ? new Date(updatedRideData.cancelled_at) : undefined,
        cancelReason: updatedRideData.cancel_reason || undefined,
        createdAt: new Date(updatedRideData.created_at),
      },
    };
  },
};