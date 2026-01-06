import { useState, useEffect } from 'react';
import * as Cesium from 'cesium';
import { Vehicle, type VehicleState } from '../cesium/Vehicle';

export const useVehicleState = (vehicle: Vehicle | null) => {
  const [vehicleState, setVehicleState] = useState<VehicleState>({
    position: Cesium.Cartesian3.ZERO,
    speed: 0,
    acceleration: 0,
    heading: 0,
    altitude: 0,
  });

  useEffect(() => {
    if (!vehicle) return;

    let lastTime = performance.now();
    let animationFrameId: number;

    const updateVehicle = async (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;

      await vehicle.update(deltaTime);
      setVehicleState(vehicle.getState());

      animationFrameId = requestAnimationFrame(updateVehicle);
    };

    animationFrameId = requestAnimationFrame(updateVehicle);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [vehicle]);

  return vehicleState;
};
