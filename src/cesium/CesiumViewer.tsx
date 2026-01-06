import { useEffect, useRef } from 'react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

interface CesiumViewerProps {
  onViewerReady?: (viewer: Cesium.Viewer) => void;
}

export const CesiumViewer: React.FC<CesiumViewerProps> = ({ onViewerReady }) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const cesiumViewerRef = useRef<Cesium.Viewer | null>(null);

  useEffect(() => {
    if (!viewerRef.current || cesiumViewerRef.current) return;

    // Set Cesium Ion token from environment
    const cesiumToken = import.meta.env.VITE_CESIUM_TOKEN;
    if (cesiumToken) {
      Cesium.Ion.defaultAccessToken = cesiumToken;
    }

    // Initialize terrain provider and create viewer
    const initializeViewer = async () => {
      if (!viewerRef.current) return;

      try {
        const terrainProvider = await Cesium.createWorldTerrainAsync({
          requestWaterMask: true,
          requestVertexNormals: true,
        });

        // Create Cesium Viewer
        const viewer = new Cesium.Viewer(viewerRef.current, {
          terrainProvider: terrainProvider,
          timeline: false,
          animation: false,
          baseLayerPicker: true,
          fullscreenButton: false,
          geocoder: false,
          homeButton: true,
          infoBox: false,
          sceneModePicker: true,
          selectionIndicator: false,
          navigationHelpButton: false,
        });

        // Enable lighting
        viewer.scene.globe.enableLighting = true;

        // Set initial camera position (San Francisco Bay Area)
        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(-122.4194, 37.7749, 5000),
          orientation: {
            heading: 0.0,
            pitch: Cesium.Math.toRadians(-45),
            roll: 0.0,
          },
        });

        cesiumViewerRef.current = viewer;

        if (onViewerReady) {
          onViewerReady(viewer);
        }
      } catch (error) {
        console.error('Failed to initialize Cesium viewer:', error);
      }
    };

    initializeViewer();

    // Cleanup
    return () => {
      if (cesiumViewerRef.current) {
        cesiumViewerRef.current.destroy();
        cesiumViewerRef.current = null;
      }
    };
  }, [onViewerReady]);

  return (
    <div
      ref={viewerRef}
      className="w-full h-full"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
    />
  );
};
