import { supabase } from '../lib/supabase';
import { Vehicle } from '../types';

export const vehiclesAPI = {
  async createVehicle(vehicleData: Partial<Omit<Vehicle, 'id'>>): Promise<Vehicle> {
    const { data, error } = await supabase
      .from('vehicles')
      .insert(vehicleData)
      .select()
      .single();

    if (error) {
      console.error('Error creating vehicle:', error);
      throw new Error(error.message);
    }

    return data;
  },
};
