# Setup Guide

This guide will help you set up and run the car simulation engine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** version 18 or higher
- **npm** (comes with Node.js)
- A modern web browser (Chrome, Firefox, Edge, or Safari)

## API Tokens

You'll need two free API tokens to run the application:

### 1. Cesium Ion Access Token

1. Go to [https://cesium.com/ion/](https://cesium.com/ion/)
2. Sign up for a free account or log in
3. Navigate to "Access Tokens" in your dashboard
4. Create a new token or use the default token
5. Copy the token value

### 2. Mapbox Access Token

1. Go to [https://account.mapbox.com/](https://account.mapbox.com/)
2. Sign up for a free account or log in
3. Navigate to "Access Tokens"
4. Create a new token with default public scopes
5. Copy the token value

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/ghifiardi/car_and_flight_simulation.git
cd car_and_flight_simulation
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Cesium (3D visualization)
- React (UI framework)
- TypeScript (type safety)
- Vite (build tool)
- TailwindCSS (styling)
- Mapbox GL (mini-map)

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit the `.env` file and add your tokens:

```env
VITE_CESIUM_TOKEN=your_cesium_token_here
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

**Important:** Never commit the `.env` file to version control. It's already included in `.gitignore`.

### 4. Start the Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5173`

Open this URL in your browser to see the simulation.

## How to Use

### Controls

- **↑ or W** - Accelerate the car
- **↓ or S** - Brake/Decelerate
- **← or A** - Turn left
- **→ or D** - Turn right

### Camera Controls

The camera automatically tracks the vehicle. You can:
- **Left-click + drag** - Rotate the view around the vehicle
- **Right-click + drag** - Pan the view
- **Scroll wheel** - Zoom in/out
- **Middle-click + drag** - Pan the view

### UI Elements

- **Top Bar**: Shows coordinates (longitude and latitude)
- **Bottom Left**: 
  - Speedometer (displays speed in km/h and mph)
  - Altitude display
  - Control guide
- **Bottom Right**: Mini-map showing real-time vehicle position

## Building for Production

To create a production build:

```bash
npm run build
```

The optimized files will be in the `dist` directory.

To preview the production build:

```bash
npm run preview
```

## Troubleshooting

### Port Already in Use

If port 5173 is already in use, Vite will automatically use the next available port. Check the terminal output for the actual URL.

### Cesium Not Loading

- Verify your Cesium token is correct in `.env`
- Check browser console for error messages
- Ensure you have a stable internet connection

### Mini-map Not Displaying

- Verify your Mapbox token is correct in `.env`
- Check browser console for error messages
- Some ad blockers may interfere with Mapbox - try disabling them

### Performance Issues

- Close other browser tabs
- Update your graphics drivers
- Try a different browser (Chrome generally has best WebGL performance)
- Reduce the terrain detail in Cesium settings

## Code Structure

```
src/
├── cesium/              # 3D visualization engine
│   ├── CesiumViewer.tsx # Main viewer component
│   └── Vehicle.ts       # Vehicle physics and rendering
├── react/               # UI components
│   └── components/
│       ├── HUD.tsx      # Heads-up display
│       └── MiniMap.tsx  # Mapbox mini-map
├── features/            # Feature modules
│   └── car/
│       └── useCarController.ts  # Keyboard input
├── utils/               # Utilities
│   ├── useVehicleState.ts       # State management
│   └── constants.ts             # Configuration constants
├── App.tsx              # Main application
└── main.tsx             # Entry point
```

## Next Steps

### Customization Ideas

1. **Change Starting Location**: Edit `DEFAULT_START_LONGITUDE` and `DEFAULT_START_LATITUDE` in `src/utils/constants.ts`

2. **Adjust Vehicle Performance**: Modify constants in `src/utils/constants.ts`:
   - `MAX_SPEED_MS` - Maximum speed
   - `ACCELERATION_RATE` - How fast the car accelerates
   - `DECELERATION_RATE` - How fast the car brakes

3. **Add New Features**: The modular architecture makes it easy to add:
   - Multiple vehicles
   - Different vehicle types
   - Weather effects
   - Time of day changes
   - Flight simulation (as intended)

## Support

For issues or questions:
1. Check the [README.md](README.md) for additional information
2. Open an issue on GitHub
3. Review the code comments for implementation details

## License

This project is licensed under the MIT License.
