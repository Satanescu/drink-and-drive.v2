import React, { useState } from 'react';
import { theme } from '../theme';
import { Location } from '../types';
import { usePlacesAutocomplete } from '../hooks/usePlacesAutocomplete';

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (address: string, coords: Location) => void;
  placeholder: string;
  userLocation: Location | null;
  disabled?: boolean;
}

export const AddressInput: React.FC<AddressInputProps> = ({
  value,
  onChange,
  onSelect,
  placeholder,
  userLocation,
  disabled = false,
}) => {
  const { getPlacePredictions, predictions, getPlaceDetails, setPredictions } = usePlacesAutocomplete();
  const [isTyping, setIsTyping] = useState(false);

  const handleSelect = async (prediction: { place_id: string; description: string }) => {
    const placeDetails = await getPlaceDetails(prediction.place_id);
    if (placeDetails) {
      onChange(placeDetails.address);
      onSelect(placeDetails.address, placeDetails.geometry);
      setPredictions([]);
      setIsTyping(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setIsTyping(true);
    if (e.target.value) {
      getPlacePredictions(e.target.value, userLocation);
    } else {
      setPredictions([]);
    }
  };

  const inputStyles: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.border.light}`,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.base,
    width: '100%',
    marginBottom: theme.spacing.sm,
    opacity: disabled ? 0.5 : 1,
  };

  const suggestionsContainerStyles: React.CSSProperties = {
    position: 'relative',
    width: '100%',
  };

  const suggestionsListStyles: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.border.light}`,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
    zIndex: 10,
    maxHeight: '200px',
    overflowY: 'auto',
  };

  const suggestionItemStyles: React.CSSProperties = {
    padding: theme.spacing.md,
    cursor: 'pointer',
    borderBottom: `1px solid ${theme.colors.border.light}`,
    color: theme.colors.text.primary,
  };

  return (
    <div style={suggestionsContainerStyles}>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        style={inputStyles}
        disabled={disabled}
      />
      {predictions.length > 0 && (
        <div style={suggestionsListStyles}>
          {predictions.map((prediction) => (
            <div
              key={prediction.place_id}
              style={suggestionItemStyles}
              onClick={() => handleSelect(prediction)}
            >
              {prediction.description}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};