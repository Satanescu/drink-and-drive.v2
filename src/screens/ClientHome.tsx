import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { Button, Map, AddressInput } from '../components';
import { useAuth } from '../context/AuthContext';
import { MapPin, Home, Briefcase, Clock, AlertCircle, User } from 'lucide-react';
import { ServiceType, Location } from '../types';
import { geocode, reverseGeocode } from '../lib/mapbox';
import { ViewState } from 'react-map-gl';
import { useLanguage } from '../context/LanguageContext';

export const ClientHome: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [pickupAddress, setPickupAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [pickupCoords, setPickupCoords] = useState<Location | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<Location | null>(null);
  const [serviceType, setServiceType] = useState<ServiceType>('standard');
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [bbox, setBbox] = useState<number[] | null>(null);
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
          reverseGeocode(location).then((data) => {
            if (data) {
              const city = data.context.find((c: any) => c.id.startsWith('place'));
              if (city && city.bbox) {
                setBbox(city.bbox);
              }
            }
          });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  }, []);

  const handleMarkerDragEnd = (e: any, type: 'pickup' | 'destination') => {
    const { lng, lat } = e.lngLat;
    const location = { lng, lat };
    reverseGeocode(location).then((data) => {
      if (data) {
        if (type === 'pickup') {
          setPickupAddress(data.place_name);
          setPickupCoords(location);
        } else {
          setDestinationAddress(data.place_name);
          setDestinationCoords(location);
        }
      }
    });
  };

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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
      alert(t('chooseAddresses'));
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
        <div style={greetingStyles}>{t('hello')}, {firstName}!</div>
        <Button onClick={() => navigate('/profile')} variant="ghost" size="icon">
          <User />
        </Button>
      </div>

      <div style={{ padding: `0 ${theme.spacing.xl}` }}>
        <div style={reminderStyles}>
          <AlertCircle size={20} color={theme.colors.warning} />
          <p style={reminderTextStyles}>
            {t('safetyReminder')}
          </p>
        </div>
      </div>

      <div style={contentStyles}>
        <h3 style={sectionTitleStyles}>{t('whereTo')}</h3>

        <AddressInput
          value={pickupAddress}
          onChange={setPickupAddress}
          onSelect={(address, coords) => {
            setPickupAddress(address);
            setPickupCoords(coords);
            setViewState((vs) => ({ ...vs, latitude: coords.lat, longitude: coords.lng, zoom: 14 }));
          }}
          placeholder={t('pickupAddress')}
          userLocation={userLocation}
          bbox={bbox}
        />

        <AddressInput
          value={destinationAddress}
          onChange={setDestinationAddress}
          onSelect={(address, coords) => {
            setDestinationAddress(address);
            setDestinationCoords(coords);
            setViewState((vs) => ({ ...vs, latitude: coords.lat, longitude: coords.lng, zoom: 14 }));
          }}
          placeholder={t('destinationAddress')}
          userLocation={userLocation}
          bbox={bbox}
        />

        <div style={mapContainerStyles}>
          <Map
            height="300px"
            markers={markers}
            viewState={viewState}
            onViewStateChange={(e) => setViewState(e.viewState)}
            onMarkerDragEnd={handleMarkerDragEnd}
          />
        </div>

        <h3 style={sectionTitleStyles}>{t('serviceType')}</h3>

        <div style={serviceCardsContainerStyles}>
          <div
            style={serviceCardStyles(serviceType === 'standard')}
            onClick={() => handleServiceSelect('standard')}
          >
            <MapPin size={32} color={serviceType === 'standard' ? '#FFF' : theme.colors.primary} />
            <div style={serviceCardTitleStyles(serviceType === 'standard')}>{t('standardRide')}</div>
            <div
              style={{
                fontSize: theme.typography.fontSize.xs,
                color: serviceType === 'standard' ? theme.colors.text.primary : theme.colors.text.secondary,
                marginTop: theme.spacing.sm,
              }}
            >
              {t('driverWithCar')}
            </div>
          </div>

          <div
            style={serviceCardStyles(serviceType === 'own-car')}
            onClick={() => handleServiceSelect('own-car')}
          >
            <MapPin size={32} color={serviceType === 'own-car' ? '#FFF' : theme.colors.primary} />
            <div style={serviceCardTitleStyles(serviceType === 'own-car')}>{t('myCar')}</div>
            <div
              style={{
                fontSize: theme.typography.fontSize.xs,
                color: serviceType === 'own-car' ? theme.colors.text.primary : theme.colors.text.secondary,
                marginTop: theme.spacing.sm,
              }}
            >
              {t('driverTakesIt')}
            </div>
          </div>
        </div>

        <Button
          onClick={handleContinue}
          variant="primary"
          size="lg"
          fullWidth
        >
          {pickupAddress && destinationAddress ? t('continueToRideDetails') : t('chooseAddresses')}
        </Button>

        <Button
          onClick={() => navigate('/safety')}
          variant="ghost"
          size="md"
          fullWidth
          style={{ marginTop: theme.spacing.lg }}
        >
          {t('safetyInfo')}
        </Button>
      </div>
    </div>
  );
};