# Architecture Documentation

This document describes the architectural design of the car simulation engine, following patterns inspired by [@WilliamAvHolmberg/cesium-flight-simulator](https://github.com/WilliamAvHolmberg/cesium-flight-simulator).

## Design Philosophy

The architecture follows these key principles:

1. **Modularity**: Clear separation between visualization (Cesium), UI (React), and features
2. **Extensibility**: Easy to add new vehicle types or simulation modes
3. **Type Safety**: Full TypeScript coverage with strict typing
4. **Performance**: Efficient rendering and state management
5. **Maintainability**: Clear code structure with extracted constants

## Directory Structure

```
src/
├── cesium/              # Core 3D visualization engine
├── react/               # UI components and layouts
├── features/            # Feature-specific modules
├── utils/               # Shared utilities and hooks
├── App.tsx              # Application composition
└── main.tsx             # Entry point
```

## Layer Architecture

### Layer 1: Cesium Engine (`cesium/`)

The foundation layer handling 3D visualization and physics.

#### `CesiumViewer.tsx`
- **Purpose**: Initializes and manages the Cesium 3D viewer
- **Responsibilities**:
  - Set up terrain provider with async loading
  - Configure viewer options (lighting, camera, etc.)
  - Expose viewer instance to parent components
- **Key Features**:
  - Tokenized access via environment variables
  - World terrain with water masks and vertex normals
  - Initial camera positioning
  - Proper cleanup on unmount

#### `Vehicle.ts`
- **Purpose**: Core vehicle simulation class
- **Responsibilities**:
  - Vehicle physics (position, speed, acceleration, heading)
  - Terrain conformity (altitude sampling)
  - Entity creation and management in Cesium
  - State updates and animations
- **Key Features**:
  - Realistic physics with configurable parameters
  - Async terrain height sampling for ground conformity
  - 3D model rendering with path trails
  - Dynamic orientation based on heading
  - Public API for state access and control

### Layer 2: React Components (`react/`)

UI layer built with React components and TailwindCSS.

#### `components/HUD.tsx`
- **Purpose**: Heads-up display for vehicle information
- **Displays**:
  - Real-time speedometer (km/h and mph)
  - Geographic coordinates (longitude, latitude)
  - Current altitude
  - Control instructions
- **Styling**: TailwindCSS with glassmorphism effects

#### `components/MiniMap.tsx`
- **Purpose**: Top-down 2D map view with vehicle tracking
- **Features**:
  - Mapbox GL integration
  - Real-time position synchronization
  - Custom vehicle marker with heading indicator
  - Automatic camera tracking
- **Implementation Notes**:
  - Uses useRef for map and marker persistence
  - Tokenized Mapbox access
  - Rotation visualization via CSS transforms

### Layer 3: Features (`features/`)

Feature-specific implementations that extend core functionality.

#### `car/useCarController.ts`
- **Purpose**: Keyboard input handling for vehicle control
- **Responsibilities**:
  - Capture arrow keys and WASD inputs
  - Map inputs to vehicle actions
  - Maintain key state for continuous actions (turning)
  - Clean up event listeners
- **Implementation**:
  - Uses useRef for persistent key state
  - requestAnimationFrame for smooth turning
  - Proper cleanup in useEffect

### Layer 4: Utils (`utils/`)

Shared utilities, hooks, and configuration.

#### `useVehicleState.ts`
- **Purpose**: Hook for managing and updating vehicle state
- **Responsibilities**:
  - Subscribe to vehicle updates
  - Calculate delta time for physics
  - Trigger re-renders when state changes
- **Pattern**: Custom React hook with cleanup

#### `constants.ts`
- **Purpose**: Centralized configuration
- **Contains**:
  - Physics constants (speeds, acceleration rates)
  - Geographic defaults (starting position)
  - Terrain parameters (vehicle height offset)
  - Earth radius for calculations
- **Benefits**: Easy tuning without code changes

## Data Flow

```
User Input (Keyboard)
    ↓
useCarController Hook
    ↓
Vehicle Class Methods (accelerate, turn, etc.)
    ↓
Vehicle.update() [Physics Calculations]
    ↓
Cesium Entity Updates (position, orientation)
    ↓
useVehicleState Hook [State Extraction]
    ↓
React Components (HUD, MiniMap)
    ↓
UI Re-render
```

## State Management

### Vehicle State
- **Location**: `Vehicle` class
- **Type**: `VehicleState` interface
- **Properties**:
  - `position`: Cesium.Cartesian3 (3D world coordinates)
  - `speed`: number (m/s)
  - `acceleration`: number (m/s²)
  - `heading`: number (degrees)
  - `altitude`: number (meters)

### Component State
- **Location**: React components via hooks
- **Pattern**: Unidirectional data flow
- **Updates**: Triggered by `useVehicleState` via requestAnimationFrame

## Physics Engine

### Update Loop
```typescript
async update(deltaTime: number) {
  1. Update speed based on acceleration
  2. Apply natural deceleration when coasting
  3. Calculate new position based on speed and heading
  4. Sample terrain height at new position
  5. Update altitude for ground conformity
  6. Update Cesium entity via CallbackProperty
}
```

### Coordinate System
- **Input**: Geographic coordinates (longitude, latitude)
- **Internal**: Cesium.Cartesian3 (ECEF coordinates)
- **Calculations**: Uses Earth radius for distance/speed conversions
- **Output**: Both geographic and Cartesian available

### Terrain Conformity
- Uses `Cesium.sampleTerrainMostDetailed()`
- Async operation with error handling
- Maintains vehicle offset above ground
- Fallback to approximate altitude on failure

## Extensibility Points

### Adding New Vehicle Types

1. Extend or create new class based on `Vehicle`
2. Override physics constants in constructor
3. Change 3D model URL
4. Adjust terrain offset if needed

Example:
```typescript
class Aircraft extends Vehicle {
  constructor(viewer: Cesium.Viewer) {
    super(viewer);
    this.maxSpeed = 200; // m/s
    this.canFly = true;
  }
}
```

### Adding New Features

1. Create feature folder: `features/myfeature/`
2. Implement logic as hooks or classes
3. Import and use in `App.tsx`
4. Add UI components in `react/components/`

### Adding New UI Components

1. Create component in `react/components/`
2. Use TailwindCSS for styling
3. Subscribe to vehicle state via `useVehicleState`
4. Add to `App.tsx` composition

## Performance Considerations

### Optimization Strategies

1. **CallbackProperty**: Cesium entities use callbacks for dynamic updates
2. **requestAnimationFrame**: Smooth 60 FPS updates
3. **useRef**: Avoid unnecessary re-renders for mutable values
4. **Async Terrain Sampling**: Non-blocking height queries
5. **Efficient Re-renders**: Only update when vehicle state changes

### Known Limitations

1. **Bundle Size**: Cesium is large (~6MB), consider code splitting for production
2. **Terrain Loading**: Initial terrain load may take a few seconds
3. **Browser Compatibility**: Requires WebGL 2.0 support

## Security

### Environment Variables
- Tokens stored in `.env` (gitignored)
- Loaded via Vite's `import.meta.env`
- Never exposed in client code

### Type Safety
- Full TypeScript coverage
- Strict null checks
- No use of `any` (uses `unknown` for type casting where necessary)

## Testing Strategy

### Current State
- Manual testing via development server
- Build verification via TypeScript compiler
- Linting via ESLint

### Future Improvements
- Unit tests for physics calculations
- Integration tests for user interactions
- E2E tests for full scenarios
- Performance benchmarks

## Future Architecture Plans

### Flight Simulation Extension

Following the modular design:

```
features/
├── car/
│   └── useCarController.ts
└── flight/                    # NEW
    ├── Aircraft.ts            # Extends Vehicle
    ├── useFlightController.ts # 3D controls
    └── FlightHUD.tsx          # Altitude, airspeed, etc.
```

### Multi-vehicle Support

```
cesium/
├── Vehicle.ts (base class)
├── VehicleManager.ts          # NEW - manages multiple vehicles
└── SimulationEngine.ts        # NEW - coordinates all entities
```

### Advanced Features

- Weather system (`features/weather/`)
- Multiplayer sync (`features/multiplayer/`)
- AI drivers (`features/ai/`)
- Mission system (`features/missions/`)

## References

- [Cesium Documentation](https://cesium.com/learn/)
- [React Best Practices](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Original Inspiration](https://github.com/WilliamAvHolmberg/cesium-flight-simulator)
