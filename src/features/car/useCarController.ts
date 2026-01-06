import { useEffect, useCallback } from 'react';
import { Vehicle } from '../../cesium/Vehicle';

interface KeyState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

export const useCarController = (vehicle: Vehicle | null) => {
  const keyState = useCallback(() => {
    const state: KeyState = {
      up: false,
      down: false,
      left: false,
      right: false,
    };
    return state;
  }, []);

  useEffect(() => {
    if (!vehicle) return;

    const keys: KeyState = keyState();

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          keys.up = true;
          vehicle.accelerate();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          keys.down = true;
          vehicle.decelerate();
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          keys.left = true;
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          keys.right = true;
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          keys.up = false;
          if (!keys.down) {
            vehicle.stopAcceleration();
          }
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          keys.down = false;
          if (!keys.up) {
            vehicle.stopAcceleration();
          }
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          keys.left = false;
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          keys.right = false;
          break;
      }
    };

    // Animation loop for continuous turning
    let animationFrameId: number;
    const updateLoop = () => {
      if (keys.left) {
        vehicle.turnLeft();
      }
      if (keys.right) {
        vehicle.turnRight();
      }
      animationFrameId = requestAnimationFrame(updateLoop);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    animationFrameId = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [vehicle, keyState]);
};
