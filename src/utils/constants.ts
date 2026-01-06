/**
 * Constants for the car simulation
 */

// Earth radius in meters
export const EARTH_RADIUS_METERS = 6371000;

// Default starting position (San Francisco)
export const DEFAULT_START_LONGITUDE = -122.4194;
export const DEFAULT_START_LATITUDE = 37.7749;
export const DEFAULT_START_ALTITUDE = 100;

// Vehicle performance constants
export const MAX_SPEED_MS = 60; // m/s (~216 km/h)
export const ACCELERATION_RATE = 5; // m/s²
export const DECELERATION_RATE = 10; // m/s²
export const NATURAL_DECELERATION = 0.5; // m/s² when coasting
export const TURN_RATE = 2; // degrees per frame

// Terrain conformity
export const VEHICLE_HEIGHT_OFFSET = 2; // meters above terrain
