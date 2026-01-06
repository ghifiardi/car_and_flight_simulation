import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as Cesium from 'cesium';

interface MiniMapProps {
  position: Cesium.Cartographic;
  heading: number;
}

export const MiniMap: React.FC<MiniMapProps> = ({ position, heading }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
    if (mapboxToken) {
      mapboxgl.accessToken = mapboxToken;
    }

    // Initialize map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [
        Cesium.Math.toDegrees(position.longitude),
        Cesium.Math.toDegrees(position.latitude),
      ],
      zoom: 14,
      attributionControl: false,
      interactive: false,
    });

    // Create custom marker element for car
    const markerElement = document.createElement('div');
    markerElement.className = 'car-marker';
    markerElement.style.width = '20px';
    markerElement.style.height = '20px';
    markerElement.style.backgroundColor = '#3b82f6';
    markerElement.style.border = '2px solid white';
    markerElement.style.borderRadius = '50% 50% 50% 0';
    markerElement.style.transform = `rotate(${heading}deg)`;
    markerElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

    const marker = new mapboxgl.Marker({
      element: markerElement,
      rotationAlignment: 'map',
    })
      .setLngLat([
        Cesium.Math.toDegrees(position.longitude),
        Cesium.Math.toDegrees(position.latitude),
      ])
      .addTo(map);

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      const lng = Cesium.Math.toDegrees(position.longitude);
      const lat = Cesium.Math.toDegrees(position.latitude);

      markerRef.current.setLngLat([lng, lat]);
      mapRef.current.setCenter([lng, lat]);

      // Update marker rotation
      const markerElement = markerRef.current.getElement();
      if (markerElement) {
        markerElement.style.transform = `rotate(${heading}deg)`;
      }
    }
  }, [position.longitude, position.latitude, heading]);

  return (
    <div className="absolute bottom-8 right-8 pointer-events-none z-10">
      <div className="bg-black bg-opacity-70 rounded-lg p-2 overflow-hidden">
        <div
          ref={mapContainerRef}
          className="w-64 h-64 rounded"
          style={{ minHeight: '256px', minWidth: '256px' }}
        />
        <div className="text-white text-xs text-center mt-2">Mini Map</div>
      </div>
    </div>
  );
};
