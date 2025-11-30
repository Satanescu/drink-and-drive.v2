import React, { useState } from 'react';
import { theme } from '../theme';
import { ArrowLeft, MapPin, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, AddressInput, Map } from '../components';
import { Location } from '../types';
import { ViewState } from 'react-map-gl';
import { useLanguage } from '../context/LanguageContext';

interface SavedLocation {
  id: number;
  name: string;
  address: string;
  location: Location;
}

export const SavedLocations: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [locations, setLocations] = useState<SavedLocation[]>([
    { id: 1, name: 'Acasă', address: 'Str. Acasă, Nr. 1', location: { lat: 45.7606, lng: 21.2267 } },
    { id: 2, name: 'Serviciu', address: 'Str. Serviciu, Nr. 2', location: { lat: 45.7489, lng: 21.2087 } },
  ]);
  const [showAddLocationForm, setShowAddLocationForm] = useState(false);
  const [newLocationName, setNewLocationName] = useState('');
  const [newLocationAddress, setNewLocationAddress] = useState('');
  const [newLocationCoords, setNewLocationCoords] = useState<Location | null>(null);
  const [viewState, setViewState] = useState<Partial<ViewState>>({
    latitude: 45.7606,
    longitude: 21.2267,
    zoom: 12,
  });

  const handleAddLocation = () => {
    if (newLocationName && newLocationAddress && newLocationCoords) {
      const newLocation: SavedLocation = {
        id: Date.now(),
        name: newLocationName,
        address: newLocationAddress,
        location: newLocationCoords,
      };
      setLocations([...locations, newLocation]);
      setShowAddLocationForm(false);
      setNewLocationName('');
      setNewLocationAddress('');
      setNewLocationCoords(null);
    }
  };

  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
    color: theme.colors.text.primary,
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  };

  const backButtonStyles: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: theme.colors.text.primary,
    marginRight: theme.spacing.lg,
  };

  const titleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
  };

  const locationItemStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <button onClick={() => navigate('/profile')} style={backButtonStyles}>
          <ArrowLeft />
        </button>
        <h1 style={titleStyles}>{t('savedLocations')}</h1>
      </div>

      {locations.map((location) => (
        <div key={location.id} style={locationItemStyles}>
          <MapPin size={24} style={{ marginRight: theme.spacing.lg }} />
          <div style={{ flex: 1 }}>
            <div>{location.name}</div>
            <div style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary }}>
              {location.address}
            </div>
          </div>
          <MoreVertical />
        </div>
      ))}

      {showAddLocationForm ? (
        <div>
          <h2 style={{ ...titleStyles, fontSize: theme.typography.fontSize.lg, marginTop: theme.spacing.xl }}>
            Adaugă Locație Nouă
          </h2>
          <AddressInput
            value={newLocationAddress}
            onChange={setNewLocationAddress}
            onSelect={(address, coords) => {
              setNewLocationAddress(address);
              setNewLocationCoords(coords);
              setViewState((vs) => ({ ...vs, latitude: coords.lat, longitude: coords.lng, zoom: 14 }));
            }}
            placeholder="Caută adresă"
            userLocation={null}
            bbox={null}
          />
          <input
            type="text"
            placeholder="Nume Locație (ex. Acasă)"
            value={newLocationName}
            onChange={(e) => setNewLocationName(e.target.value)}
            style={{
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.border.light}`,
              borderRadius: theme.borderRadius.md,
              padding: theme.spacing.md,
              color: theme.colors.text.primary,
              fontFamily: theme.typography.fontFamily.primary,
              fontSize: theme.typography.fontSize.base,
              width: '100%',
              marginBottom: theme.spacing.lg,
            }}
          />
          <div style={{ height: '200px', marginBottom: theme.spacing.lg }}>
            <Map
              height="200px"
              viewState={viewState}
              onViewStateChange={(e) => setViewState(e.viewState)}
              markers={newLocationCoords ? [{ location: newLocationCoords, type: 'pickup' }] : []}
              onMarkerDragEnd={() => {}}
            />
          </div>
          <Button onClick={handleAddLocation} variant="primary" fullWidth>
            Adaugă Locație
          </Button>
          <Button onClick={() => setShowAddLocationForm(false)} variant="ghost" fullWidth style={{ marginTop: theme.spacing.md }}>
            Anulează
          </Button>
        </div>
      ) : (
        <Button onClick={() => setShowAddLocationForm(true)} variant="primary" fullWidth style={{ marginTop: theme.spacing.xl }}>
          Adaugă Locație Nouă
        </Button>
      )}
    </div>
  );
};
