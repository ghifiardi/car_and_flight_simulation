# Car and Flight Simulation

A foundational car simulation engine built with Cesium, React, and TypeScript. Features real-world 3D terrain rendering, realistic vehicle dynamics with terrain conformity, and an intuitive HUD interface with mini-map tracking.

## Features

### 🌍 3D Terrain Rendering with Cesium
- Global terrain visualization using Cesium Ion
- Real-world coordinate system support
- Dynamic lighting and high-quality imagery

### 🚗 Advanced Car Dynamics
- Realistic vehicle physics with position, speed, and acceleration
- Automatic terrain conformity (aligns with ground altitude)
- Smooth acceleration and deceleration
- Responsive steering controls

### 📊 Interactive UI
- Real-time speedometer (km/h and mph)
- Location display (longitude, latitude, altitude)
- Control guide overlay
- Styled with TailwindCSS for modern aesthetics

### 🗺️ Mini-Map Integration
- Mapbox GL-based real-time tracking
- Dynamic vehicle marker with heading indicator
- Synchronized with main 3D view

### 🏗️ Modular Architecture
- **`cesium/`** - Core simulation engine and vehicle logic
- **`react/`** - UI components (HUD, controls)
- **`features/`** - Feature extensions (car controller)
- **`utils/`** - Shared utilities and hooks
- Extensible design for future flight simulation integration

## Prerequisites

- Node.js 18+ and npm
- Cesium Ion access token ([Get one here](https://cesium.com/ion/tokens))
- Mapbox access token ([Get one here](https://account.mapbox.com/access-tokens/))

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ghifiardi/car_and_flight_simulation.git
   cd car_and_flight_simulation
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your tokens:
   ```env
   VITE_CESIUM_TOKEN=your_cesium_ion_token_here
   VITE_MAPBOX_TOKEN=your_mapbox_token_here
   ```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Controls

- **↑ / W** - Accelerate
- **↓ / S** - Brake/Decelerate
- **← / A** - Turn Left
- **→ / D** - Turn Right

The camera automatically tracks the vehicle. Use the mouse to adjust the viewing angle.

## Project Structure

```
src/
├── cesium/              # Cesium engine core
│   ├── CesiumViewer.tsx # Main 3D viewer component
│   └── Vehicle.ts       # Vehicle class with dynamics
├── react/               # React UI components
│   └── components/
│       ├── HUD.tsx      # Heads-up display
│       └── MiniMap.tsx  # Mapbox mini-map
├── features/            # Feature modules
│   └── car/
│       └── useCarController.ts  # Keyboard input handler
├── utils/               # Utilities
│   └── useVehicleState.ts       # Vehicle state management
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles with Tailwind
```

## Technologies Used

- **Cesium** - 3D geospatial visualization
- **React 19** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Mapbox GL** - Mini-map rendering
- **Resium** - React bindings for Cesium

## Extensibility

The architecture is designed to support future additions:

- **Flight Simulation**: Add aircraft classes in `cesium/`, flight controls in `features/flight/`
- **Additional Vehicles**: Extend the `Vehicle` base class for boats, bikes, etc.
- **Multiplayer**: Integrate real-time sync in a new `features/multiplayer/` module
- **Weather Systems**: Add environmental effects in `features/weather/`

## License

MIT

## Acknowledgments

Inspired by [@WilliamAvHolmberg/cesium-flight-simulator](https://github.com/WilliamAvHolmberg/cesium-flight-simulator)
