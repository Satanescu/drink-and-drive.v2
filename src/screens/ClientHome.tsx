import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { Button, Map, AddressInput } from '../components';
import { useAuth } from '../context/auth.hooks';
import { MapPin, Home, Briefcase, Clock, AlertCircle } from 'lucide-react';
import { ServiceType, Location } from '../types';
import { geocode, reverseGeocode } from '../lib/mapbox';
import { ViewState } from 'react-map-gl';

export const ClientHome: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pickupAddress, setPickupAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [pickupCoords, setPickupCoords] = useState<Location | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<Location | null>(null);
  const [serviceType, setServiceType] = useState<ServiceType>('standard');
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [viewState, setViewState] = useState<Partial<ViewState>>({
    latitude: 45.7606, // Timisoara
    longitude: 21.2267,
    zoom: 12,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = { lat: latitude, lng: longitude };
          setUserLocation(location);
          setViewState((vs) => ({ ...vs, latitude, longitude, zoom: 14 }));
          setPickupCoords(location);
          reverseGeocode(location).then(setPickupAddress);
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  }, []);

  if (!user) {
    return null;
  }

  const firstName = user.fullName.split(' ')[0];

  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: theme.colors.background,
    paddingBottom: '100px',
    fontFamily: theme.typography.fontFamily.primary,
  };

  const headerStyles: React.CSSProperties = {
    backgroundColor: theme.colors.surfaceLight,
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
  };

  const greetingStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  };

  const reminderStyles: React.CSSProperties = {
    backgroundColor: `${theme.colors.warning}20`,
    border: `1px solid ${theme.colors.warning}40`,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    display: 'flex',
    gap: theme.spacing.md,
    alignItems: 'flex-start',
    marginTop: theme.spacing.md,
  };

  const reminderTextStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeight.relaxed,
  };

  const contentStyles: React.CSSProperties = {
    padding: theme.spacing.xl,
  };

  const sectionTitleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.lg,
  };

  const mapContainerStyles: React.CSSProperties = {
    marginBottom: theme.spacing.xl,
  };

  const serviceCardsContainerStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  };

  const serviceCardStyles = (active: boolean): React.CSSProperties => ({
    backgroundColor: active ? theme.colors.primary : theme.colors.surface,
    border: `2px solid ${active ? theme.colors.primary : theme.colors.border.light}`,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    cursor: 'pointer',
    transition: theme.transitions.fast,
    textAlign: 'center',
  });

  const serviceCardTitleStyles = (active: boolean): React.CSSProperties => ({
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: active ? theme.colors.text.primary : theme.colors.text.primary,
    marginTop: theme.spacing.sm,
  });

  const handleServiceSelect = (type: ServiceType) => {
    setServiceType(type);
  };

  const handleContinue = () => {
    if (!pickupAddress || !destinationAddress) {
      alert('Alege o adresă de preluare și una de destinație');
      return;
    }

    navigate('/ride/details', {
      state: {
        destination: { ...destinationCoords, address: destinationAddress },
        pickup: { ...pickupCoords, address: pickupAddress },
        serviceType,
      },
    });
  };

  const markers = [];
  if (pickupCoords) {
    markers.push({ location: pickupCoords, type: 'pickup' });
  }
  if (destinationCoords) {
    markers.push({ location: destinationCoords, type: 'destination' });
  }

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <div style={greetingStyles}>Bună, {firstName}!</div>

        <div style={reminderStyles}>
          <AlertCircle size={20} color={theme.colors.warning} />
          <p style={reminderTextStyles}>
            Nu conduce după ce ai consumat alcool. Alege o cursă sigură cu Drink&Drive.
          </p>
        </div>
      </div>

      <div style={contentStyles}>
        <h3 style={sectionTitleStyles}>Unde mergem?</h3>

        <AddressInput
          value={pickupAddress}
          onChange={setPickupAddress}
          onSelect={(address, coords) => {
            setPickupAddress(address);
            setPickupCoords(coords);
            setViewState((vs) => ({ ...vs, latitude: coords.lat, longitude: coords.lng, zoom: 14 }));
          }}
          placeholder="Introdu adresa de preluare"
          userLocation={userLocation}
        />

        <AddressInput
          value={destinationAddress}
          onChange={setDestinationAddress}
          onSelect={(address, coords) => {
            setDestinationAddress(address);
            setDestinationCoords(coords);
            setViewState((vs) => ({ ...vs, latitude: coords.lat, longitude: coords.lng, zoom: 14 }));
          }}
          placeholder="Introdu adresa de destinație"
          userLocation={userLocation}
        />

        <div style={mapContainerStyles}>
          <Map
            height="300px"
            markers={markers}
            viewState={viewState}
            onViewStateChange={(e) => setViewState(e.viewState)}
          />
        </div>

        <h3 style={sectionTitleStyles}>Tipul de serviciu</h3>

        <div style={serviceCardsContainerStyles}>
          <div
            style={serviceCardStyles(serviceType === 'standard')}
            onClick={() => handleServiceSelect('standard')}
          >
            <MapPin size={32} color={serviceType === 'standard' ? '#FFF' : theme.colors.primary} />
            <div style={serviceCardTitleStyles(serviceType === 'standard')}>Cursă standard</div>
            <div
              style={{
                fontSize: theme.typography.fontSize.xs,
                color: serviceType === 'standard' ? theme.colors.text.primary : theme.colors.text.secondary,
                marginTop: theme.spacing.sm,
              }}
            >
              Șofer cu mașina
            </div>
          </div>

          <div
            style={serviceCardStyles(serviceType === 'own-car')}
            onClick={() => handleServiceSelect('own-car')}
          >
            <MapPin size={32} color={serviceType === 'own-car' ? '#FFF' : theme.colors.primary} />
            <div style={serviceCardTitleStyles(serviceType === 'own-car')}>Mașina mea</div>
            <div
              style={{
                fontSize: theme.typography.fontSize.xs,
                color: serviceType === 'own-car' ? theme.colors.text.primary : theme.colors.text.secondary,
                marginTop: theme.spacing.sm,
              }}
            >
              Șoferul o duce
            </div>
          </div>
        </div>

        <Button
          onClick={handleContinue}
          variant="primary"
          size="lg"
          fullWidth
        >
          {pickupAddress && destinationAddress ? 'Continuă către detalii cursă' : 'Alege adresele'}
        </Button>

        <Button
          onClick={() => navigate('/safety')}
          variant="ghost"
          size="md"
          fullWidth
          style={{ marginTop: theme.spacing.lg }}
        >
          Informații de siguranță
        </Button>
      </div>
    </div>
  );
};