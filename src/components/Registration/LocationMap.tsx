import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { theme } from '../../styles/theme';
import { useMapbox } from '../../hooks/useMapbox';

const MapContainer = styled.div`
  width: 100%;
  height: 300px;
  border-radius: ${theme.borderRadius.medium};
  overflow: hidden;
  margin: ${theme.spacing.medium} 0;
  border: 1.5px solid ${theme.colors.text.disabled};
`;

const LocationDetails = styled.div`
  background: ${theme.colors.surface};
  padding: ${theme.spacing.medium};
  border-radius: ${theme.borderRadius.medium};
  margin-top: ${theme.spacing.medium};
  border: 1.5px solid ${theme.colors.text.disabled};
`;

const LocationText = styled.p`
  color: ${theme.colors.text.primary};
  margin: 0;
  font-size: ${theme.typography.fontSize.body};
  line-height: 1.5;
`;

interface LocationMapProps {
  onLocationConfirmed: (address: {
    streetAddress: string;
    suburb: string;
    state: string;
    postcode: string;
  }) => void;
}

export const LocationMap: React.FC<LocationMapProps> = ({ onLocationConfirmed }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [currentAddress, setCurrentAddress] = useState<{
    streetAddress: string;
    suburb: string;
    state: string;
    postcode: string;
  } | null>(null);

  const { getAddressFromCoordinates } = useMapbox();

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [133.7751, -25.2744], // Australia center
      zoom: 3
    });

    const mapInstance = map.current;

    // Add navigation controls
    mapInstance.addControl(new mapboxgl.NavigationControl());

    // Add click handler to map
    mapInstance.on('click', async (e) => {
      const { lng, lat } = e.lngLat;
      
      // Center map on clicked location with animation
      mapInstance.flyTo({
        center: [lng, lat],
        zoom: 16,
        essential: true,
        duration: 1000
      });

      // Update marker position
      if (!marker.current) {
        marker.current = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(mapInstance);
      } else {
        marker.current.setLngLat([lng, lat]);
      }

      try {
        const address = await getAddressFromCoordinates(lat, lng);
        setCurrentAddress(address);
        onLocationConfirmed(address);
      } catch (error) {
        console.error('Failed to get address:', error);
      }
    });

    // Get user's location with better error handling
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Fly to user's location with animation
        mapInstance.flyTo({
          center: [longitude, latitude],
          zoom: 16,
          essential: true,
          duration: 1000
        });

        // Add marker
        if (!marker.current) {
          marker.current = new mapboxgl.Marker()
            .setLngLat([longitude, latitude])
            .addTo(mapInstance);
        } else {
          marker.current.setLngLat([longitude, latitude]);
        }

        // Get address details
        try {
          const address = await getAddressFromCoordinates(latitude, longitude);
          setCurrentAddress(address);
          onLocationConfirmed(address);
        } catch (error) {
          console.error('Failed to get address:', error);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        // Set default view of Australia if geolocation fails
        mapInstance.flyTo({
          center: [133.7751, -25.2744],
          zoom: 3,
          essential: true
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 30000
      }
    );

    return () => {
      if (mapInstance) {
        mapInstance.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <>
      <MapContainer ref={mapContainer} />
      {currentAddress && (
        <LocationDetails>
          <LocationText>
            Current Location:<br />
            {currentAddress.streetAddress}<br />
            {currentAddress.suburb} {currentAddress.state} {currentAddress.postcode}
          </LocationText>
        </LocationDetails>
      )}
    </>
  );
}; 