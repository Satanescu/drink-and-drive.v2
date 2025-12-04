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
    estimatedTime: number;
    estimatedPrice: { min: number; max: number };
    estimatedDistance: number;
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
        estimated_duration: data.estimatedTime,
        estimated_cost_min: data.estimatedPrice.min,
        estimated_cost_max: data.estimatedPrice.max,
        estimated_distance: data.estimatedDistance,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const ride: Ride = {
      id: newRideData.id,
      clientId: newRideData.client_id,
      driverId: newRideData.driver_id || undefined,
      serviceType: newRideData.service_type as ServiceType,
      status: newRideData.status as RideStatus,
      pickup: {
        lat: newRideData.pickup_lat,
        lng: newRideData.pickup_lng,
        address: newRideData.pickup_address || undefined,
      },
      destination: {
        lat: newRideData.destination_lat,
        lng: newRideData.destination_lng,
        address: newRideData.destination_address || undefined,
      },
      estimatedDistance: newRideData.estimated_distance,
      estimatedDuration: newRideData.estimated_duration,
      estimatedCost: {
        min: newRideData.estimated_cost_min,
        max: newRideData.estimated_cost_max,
      },
      actualCost: newRideData.actual_cost || undefined,
      paymentMethod: newRideData.payment_method as PaymentMethod,
      promoCode: newRideData.promo_code || undefined,
      scheduledFor: newRideData.scheduled_for ? new Date(newRideData.scheduled_for) : undefined,
      startedAt: newRideData.started_at ? new Date(newRideData.started_at) : undefined,
      completedAt: newRideData.completed_at ? new Date(newRideData.completed_at) : undefined,
      cancelledAt: newRideData.cancelled_at ? new Date(newRideData.cancelled_at) : undefined,
      cancelReason: newRideData.cancel_reason || undefined,
      createdAt: new Date(newRideData.created_at),
    };

    // Don't wait for the driver search to complete
    this.findDriver(ride);

    return ride;
  },

  async findDriver(ride: Ride): Promise<void> {
    console.log(`[findDriver] Called for ride ID: ${ride.id}`);

    // Fetch all available drivers for the service type
    const { data: availableDrivers, error: driverError } = await supabase
      .from('profiles')
      .select('id, vehicle_type')
      .eq('role', 'driver')
      .eq('is_online', true)
      .eq('vehicle_type', ride.serviceType);

    if (driverError) {
      console.error('[findDriver] Error fetching available drivers:', driverError);
      throw new Error(driverError.message);
    }

    if (!availableDrivers || availableDrivers.length === 0) {
      console.log('[findDriver] No available drivers found for service type:', ride.serviceType);
      return;
    }

    console.log(`[findDriver] Found ${availableDrivers.length} available drivers.`);

    // Broadcast the ride request to all available drivers
    const channelName = `new-ride-requests-${ride.serviceType}`;
    const channel = supabase.channel(channelName);

    const payload = {
      event: 'new-ride',
      payload: ride,
    };

    console.log(`[findDriver] Broadcasting 'new-ride' on channel '${channelName}' with payload:`, payload);

    const broadcastResponse = await channel.send({
      type: 'broadcast',
      ...payload,
    });

    console.log('[findDriver] Supabase broadcast response:', broadcastResponse);

    if (broadcastResponse !== 'ok') {
      console.error('[findDriver] Failed to broadcast new ride request.');
      // It might be useful to have some retry logic or error handling here
    }

    // Since we're broadcasting, we don't return a single driver anymore.
    // The function is now async but might not need to return anything.
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

  async acceptRideRequest(rideId: string, driverId: string): Promise<{ ride: Ride }> {
    const { data: updatedRideData, error: rideUpdateError } = await supabase
      .from('rides')
      .update({
        driver_id: driverId,
        status: 'driver-found',
      })
      .eq('id', rideId)
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