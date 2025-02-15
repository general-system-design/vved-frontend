import { useState } from 'react';
import mapboxgl from 'mapbox-gl';

// Replace with your Mapbox access token
const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

interface Address {
  streetAddress: string;
  suburb: string;
  state: string;
  postcode: string;
}

interface UseMapboxReturn {
  getAddressFromCoordinates: (latitude: number, longitude: number) => Promise<Address>;
  searchAddress: (query: string) => Promise<Address[]>;
  isLoading: boolean;
  error: string | null;
}

export const useMapbox = (): UseMapboxReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

  const getAddressFromCoordinates = async (latitude: number, longitude: number): Promise<Address> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_ACCESS_TOKEN}&country=AU&types=address`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }

      const data = await response.json();
      const feature = data.features[0];

      if (!feature) {
        throw new Error('No address found at this location');
      }

      // Parse the Mapbox response into our address format
      const address = parseMapboxResponse(feature);
      return address;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get address';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const searchAddress = async (query: string): Promise<Address[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${MAPBOX_ACCESS_TOKEN}&country=AU&types=address&autocomplete=true`
      );

      if (!response.ok) {
        throw new Error('Failed to search addresses');
      }

      const data = await response.json();
      return data.features.map(parseMapboxResponse);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search addresses';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const parseMapboxResponse = (feature: any): Address => {
    const context = feature.context || [];
    const address: Address = {
      streetAddress: feature.text || '',
      suburb: '',
      state: '',
      postcode: ''
    };

    // Parse the context array to get suburb, state, and postcode
    context.forEach((item: any) => {
      if (item.id.startsWith('locality')) {
        // Use locality for suburb instead of place
        address.suburb = item.text;
      } else if (item.id.startsWith('place') && !address.suburb) {
        // Fallback to place only if locality isn't found
        address.suburb = item.text;
      } else if (item.id.startsWith('region')) {
        address.state = item.text;
      } else if (item.id.startsWith('postcode')) {
        address.postcode = item.text;
      }
    });

    // Clean up the street address if it includes the house number
    if (feature.address) {
      address.streetAddress = `${feature.address} ${address.streetAddress}`;
    }

    // Convert state names to abbreviations
    const stateAbbreviations: { [key: string]: string } = {
      'New South Wales': 'NSW',
      'Victoria': 'VIC',
      'Queensland': 'QLD',
      'Western Australia': 'WA',
      'South Australia': 'SA',
      'Tasmania': 'TAS',
      'Australian Capital Territory': 'ACT',
      'Northern Territory': 'NT'
    };

    if (address.state in stateAbbreviations) {
      address.state = stateAbbreviations[address.state];
    }

    return address;
  };

  return {
    getAddressFromCoordinates,
    searchAddress,
    isLoading,
    error
  };
}; 