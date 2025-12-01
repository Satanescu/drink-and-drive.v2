import React, { useState, useEffect } from 'react';
import {
  APIProvider,
  Map,
  useMapsLibrary,
  useMap
} from '@vis.gl/react-google-maps';

const API_KEY = 'AIzaSyA-B-FQ1h6dPN1jDESTmM291xMD55QfLCo';

export default function AppMap() {
  return (
    <APIProvider apiKey={API_KEY}>
      <div style={{ height: '100vh', width: '100%' }}>
        <Map
          defaultCenter={{ lat: 44.4268, lng: 26.1025 }} // Bucharest coordinates
          defaultZoom={13}
          gestureHandling={'greedy'}
          disableDefaultUI={false}
        >
          {/* We add the Traffic Layer and Directions Logic here */}
          <DirectionsAndTraffic />
        </Map>
      </div>
    </APIProvider>
  );
}

// Separate component to handle map logic
function DirectionsAndTraffic() {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();

  // 1. Initialize Services
  useEffect(() => {
    if (!routesLibrary || !map) return;
    
    // Create the Directions Service (calculates route)
    setDirectionsService(new routesLibrary.DirectionsService());
    
    // Create the Renderer (draws the blue line on map)
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
    
    // Add Live Traffic Layer visually
    const trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);

    return () => trafficLayer.setMap(null); // Cleanup
  }, [routesLibrary, map]);

  // 2. Function to Calculate Route & Price
  const calculateRoute = async (start: string, end: string) => {
    if (!directionsService || !directionsRenderer) return;

    try {
      const response = await directionsService.route({
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING,
        drivingOptions: {
          departureTime: new Date(), // This triggers "Traffic Aware" calculation
          trafficModel: google.maps.TrafficModel.BEST_GUESS
        }
      });

      directionsRenderer.setDirections(response);

      // EXTRACT DATA FOR PRICING
      const route = response.routes[0].legs[0];
      const distanceKm = route.distance!.value / 1000;
      
      // duration_in_traffic is the critical value for accurate pricing!
      const durationSeconds = route.duration_in_traffic 
        ? route.duration_in_traffic.value 
        : route.duration!.value;
      
      const durationMinutes = durationSeconds / 60;

      console.log(`Distance: ${distanceKm} km`);
      console.log(`Time with Traffic: ${Math.round(durationMinutes)} mins`);

      // YOUR PRICING FORMULA
      const basePrice = 5; // Lei
      const pricePerKm = 2.5; 
      const pricePerMinute = 0.5;
      
      const totalCost = basePrice + (distanceKm * pricePerKm) + (durationMinutes * pricePerMinute);
      
      alert(`Estimated Price: ${totalCost.toFixed(2)} Lei`);

    } catch (error) {
      console.error("Error fetching directions:", error);
    }
  };

  // Example usage: Calculate route automatically on load (or trigger via button)
  useEffect(() => {
    if(directionsService) {
        // Example: Unirii to Otopeni
        calculateRoute("Piata Unirii, Bucuresti", "Aeroportul Otopeni");
    }
  }, [directionsService]);

  return null;
}
