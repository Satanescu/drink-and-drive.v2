import { Location } from '../types';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoic2F0YW5lc2N1IiwiYSI6ImNtaTFydHUxdDBlOTcybXF3aHZkOHUwemsifQ.Rgn2P0SNUxd8uys4XTBZOw';

export const geocode = async (address: string): Promise<Location | null> => {
  if (!address) {
    return null;
  }

  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
      )}.json?access_token=${MAPBOX_TOKEN}`
    );
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center;
      return { lat, lng };
    }
  } catch (error) {
    console.error('Error during geocoding:', error);
  }

  return null;
};

export const reverseGeocode = async (location: Location): Promise<string> => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${location.lng},${location.lat}.json?access_token=${MAPBOX_TOKEN}`
    );
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      return data.features[0].place_name;
    }
  } catch (error) {
    console.error('Error during reverse geocoding:', error);
  }

  return 'Unknown location';
};

export const getSuggestions = async (query: string, proximity: Location | null): Promise<any[]> => {
  if (!query) {
    return [];
  }

  let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    query
  )}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true`;

  if (proximity) {
    url += `&proximity=${proximity.lng},${proximity.lat}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.features || [];
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
};
