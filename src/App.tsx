import { useState, useCallback } from 'react';
import * as Cesium from 'cesium';
import { CesiumViewer } from './cesium/CesiumViewer';
import { Vehicle } from './cesium/Vehicle';
import { HUD } from './react/components/HUD';
import { MiniMap } from './react/components/MiniMap';
import { useCarController } from './features/car/useCarController';
import { useVehicleState } from './utils/useVehicleState';

function App() {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const vehicleState = useVehicleState(vehicle);
  
  useCarController(vehicle);

  const handleViewerReady = useCallback((viewer: Cesium.Viewer) => {
    const newVehicle = new Vehicle(viewer);
    setVehicle(newVehicle);

    // Track the vehicle with camera
    const entity = newVehicle.getEntity();
    if (entity) {
      viewer.trackedEntity = entity;
    }
  }, []);

  const cartographicPosition = vehicle
    ? vehicle.getCartographicPosition()
    : new Cesium.Cartographic(0, 0, 0);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <CesiumViewer onViewerReady={handleViewerReady} />
      
      {vehicle && (
        <>
          <HUD
            speed={vehicleState.speed}
            position={cartographicPosition}
            altitude={vehicleState.altitude}
          />
          <MiniMap
            position={cartographicPosition}
            heading={vehicleState.heading}
          />
        </>
      )}
    </div>
  );
}

export default App;
