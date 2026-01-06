import React from 'react';
import * as Cesium from 'cesium';

interface HUDProps {
  speed: number; // m/s
  position: Cesium.Cartographic;
  altitude: number;
}

export const HUD: React.FC<HUDProps> = ({ speed, position, altitude }) => {
  const speedKmh = Math.round(speed * 3.6);
  const speedMph = Math.round(speed * 2.237);
  const longitude = Cesium.Math.toDegrees(position.longitude).toFixed(6);
  const latitude = Cesium.Math.toDegrees(position.latitude).toFixed(6);

  return (
    <div className="absolute top-0 left-0 right-0 pointer-events-none z-10">
      {/* Top Bar */}
      <div className="bg-black bg-opacity-50 text-white p-4 flex justify-between items-center">
        <div className="text-lg font-bold">
          Car Simulation
        </div>
        <div className="text-sm">
          <div>Lon: {longitude}°</div>
          <div>Lat: {latitude}°</div>
        </div>
      </div>

      {/* Speedometer */}
      <div className="absolute bottom-8 left-8">
        <div className="bg-black bg-opacity-70 rounded-lg p-6 text-center min-w-[200px]">
          <div className="text-6xl font-bold text-green-400">
            {speedKmh}
          </div>
          <div className="text-sm text-gray-300 mt-2">km/h</div>
          <div className="text-xs text-gray-400 mt-1">
            {speedMph} mph
          </div>
          <div className="text-xs text-gray-500 mt-3 border-t border-gray-600 pt-2">
            Altitude: {Math.round(altitude)}m
          </div>
        </div>

        {/* Controls Guide */}
        <div className="bg-black bg-opacity-70 rounded-lg p-4 mt-4 text-xs text-gray-300">
          <div className="font-bold mb-2">Controls:</div>
          <div>↑ / W - Accelerate</div>
          <div>↓ / S - Brake</div>
          <div>← / A - Turn Left</div>
          <div>→ / D - Turn Right</div>
        </div>
      </div>
    </div>
  );
};
