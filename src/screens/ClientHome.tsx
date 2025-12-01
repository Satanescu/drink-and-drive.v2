import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { Button, AddressInput } from '../components';
import { useAuth } from '../context/AuthContext';
import { MapPin, Home, Briefcase, Clock, AlertCircle, User } from 'lucide-react';
import { ServiceType, Location } from '../types';
import { ClientMap } from '../components/ClientMap';
import { useLanguage } from '../context/LanguageContext';
import { useGeocoding } from '../hooks/useGeocoding';
import { useDirections } from '../hooks/useDirections';

export const ClientHome: React.FC = () => {
  const navigate = useNavigate();
  const { user, switchActiveRole } = useAuth();
  const { t } = useLanguage();
  const [pickupAddress, setPickupAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [pickupCoords, setPickupCoords] = useState<Location | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<Location | null>(null);
  const [serviceType, setServiceType] = useState<ServiceType>('standard');
  const [estimatedTime, setEstimatedTime] = useState<string | null>(null);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [estimatedDistance, setEstimatedDistance] = useState<string | null>(null);
  const { reverseGeocode } = useGeocoding();
  const { getDirections } = useDirections();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const location = { lat: latitude, lng: longitude };
          setPickupCoords(location);
          const address = await reverseGeocode(location);
          if (address) {
            setPickupAddress(address);
          }
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  }, [reverseGeocode]);

  useEffect(() => {
    const calculateEstimations = async () => {
      if (pickupCoords && destinationCoords) {
        const directions = await getDirections(pickupCoords, destinationCoords);
        if (directions) {
          setEstimatedTime(directions.duration);
          setEstimatedDistance(directions.distance);

          const basePrice = serviceType === 'standard' ? 5 : 3; // Lei
          const pricePerKm = serviceType === 'standard' ? 2.5 : 1.5;
          const pricePerMinute = serviceType === 'standard' ? 0.5 : 0.3;

          const totalCost = basePrice + (directions.distanceValue / 1000) * pricePerKm + (directions.durationValue / 60) * pricePerMinute;
          setEstimatedPrice(totalCost);
        }
      }
    };
    calculateEstimations();
  }, [pickupCoords, destinationCoords, getDirections, serviceType]);

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

    if (!estimatedTime || !estimatedPrice) {
      alert('Please wait for the price and time estimation.');
      return;
    }

    navigate('/ride/details', {
      state: {
        destination: { ...destinationCoords, address: destinationAddress },
        pickup: { ...pickupCoords, address: pickupAddress },
        serviceType,
        estimatedTime,
        estimatedPrice,
        estimatedDistance,
      },
    });
  };

  const handleMarkerDragEnd = async (e: google.maps.MapMouseEvent, type: 'pickup' | 'destination') => {
    const newCoords = {
      lat: e.latLng!.lat(),
      lng: e.latLng!.lng(),
    };

    const address = await reverseGeocode(newCoords);
    if (address) {
      if (type === 'pickup') {
        setPickupCoords(newCoords);
        setPickupAddress(address);
      } else {
        setDestinationCoords(newCoords);
        setDestinationAddress(address);
      }
    }
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <div style={greetingStyles}>{t('hello')}, {firstName}!</div>
        <div>
          {user.role === 'driver' && (
            <Button onClick={() => switchActiveRole('driver')} variant="primary" size="sm">
              Switch to Driver
            </Button>
          )}
          <Button onClick={() => navigate('/profile')} variant="ghost" size="icon">
            <User />
          </Button>
        </div>
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
          }}
          placeholder={t('pickupAddress')}
          userLocation={pickupCoords}
          disabled={!pickupCoords}
        />

        <AddressInput
          value={destinationAddress}
          onChange={setDestinationAddress}
          onSelect={(address, coords) => {
            setDestinationAddress(address);
            setDestinationCoords(coords);
          }}
          placeholder={t('destinationAddress')}
          userLocation={pickupCoords}
          disabled={!pickupCoords}
        />

        <div style={mapContainerStyles}>
          <ClientMap pickup={pickupCoords} destination={destinationCoords} onMarkerDragEnd={handleMarkerDragEnd} />
        </div>

                  {estimatedTime && estimatedPrice && (
                    <div>
                      <h3 style={{ ...sectionTitleStyles, color: theme.colors.text.primary }}>Estimations</h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: theme.spacing.lg }}>
                        <div>
                          <div style={{ fontSize: theme.typography.fontSize.lg, fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.text.primary }}>
                            {estimatedTime}
                          </div>
                          <div style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary }}>
                            Estimated Time
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: theme.typography.fontSize.lg, fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.text.primary }}>
                            {estimatedPrice.toFixed(2)} Lei
                          </div>
                          <div style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary }}>
                            Estimated Price
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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