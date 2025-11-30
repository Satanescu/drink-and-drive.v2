import React, { useState, useEffect } from 'react';
import { theme } from '../theme';
import { getSuggestions } from '../lib/mapbox';
import { Location } from '../types';

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (address: string, coords: Location) => void;
  placeholder: string;
  userLocation: Location | null;
  bbox: number[] | null;
}

export const AddressInput: React.FC<AddressInputProps> = ({
  value,
  onChange,
  onSelect,
  placeholder,
  userLocation,
  bbox,
}) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (value && isTyping) {
        getSuggestions(value, userLocation, bbox).then(setSuggestions);
      } else {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [value, userLocation, bbox, isTyping]);

  const handleSelect = (suggestion: any) => {
    const address = suggestion.place_name;
    const [lng, lat] = suggestion.center;
    onChange(address);
    onSelect(address, { lat, lng });
    setSuggestions([]);
    setIsTyping(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setIsTyping(true);
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
      />
      {suggestions.length > 0 && (
        <div style={suggestionsListStyles}>
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              style={suggestionItemStyles}
              onClick={() => handleSelect(suggestion)}
            >
              {suggestion.place_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};