import * as Cesium from 'cesium';

export interface VehicleState {
  position: Cesium.Cartesian3;
  speed: number; // m/s
  acceleration: number; // m/s²
  heading: number; // degrees
  altitude: number; // meters
}

export class Vehicle {
  private state: VehicleState;
  private entity: Cesium.Entity | null = null;
  private viewer: Cesium.Viewer;
  private readonly maxSpeed = 60; // m/s (~216 km/h)
  private readonly accelerationRate = 5; // m/s²
  private readonly decelerationRate = 10; // m/s²

  constructor(viewer: Cesium.Viewer, initialPosition?: Cesium.Cartesian3) {
    this.viewer = viewer;
    
    // Default starting position (San Francisco)
    const defaultPosition = Cesium.Cartesian3.fromDegrees(
      -122.4194,
      37.7749,
      100
    );

    this.state = {
      position: initialPosition || defaultPosition,
      speed: 0,
      acceleration: 0,
      heading: 0,
      altitude: 100,
    };

    this.createEntity();
  }

  private createEntity(): void {
    this.entity = this.viewer.entities.add({
      position: new Cesium.CallbackProperty(() => this.state.position, false) as any,
      orientation: new Cesium.CallbackProperty(() => {
        const hpr = new Cesium.HeadingPitchRoll(
          Cesium.Math.toRadians(this.state.heading),
          0,
          0
        );
        return Cesium.Transforms.headingPitchRollQuaternion(
          this.state.position,
          hpr
        );
      }, false) as any,
      model: {
        uri: 'https://raw.githubusercontent.com/CesiumGS/cesium/main/Apps/SampleData/models/GroundVehicle/GroundVehicle.glb',
        minimumPixelSize: 64,
        maximumScale: 20000,
      },
      path: {
        resolution: 1,
        material: new Cesium.PolylineGlowMaterialProperty({
          glowPower: 0.1,
          color: Cesium.Color.YELLOW,
        }),
        width: 10,
        leadTime: 0,
        trailTime: 60,
      },
    });
  }

  public accelerate(): void {
    if (this.state.speed < this.maxSpeed) {
      this.state.acceleration = this.accelerationRate;
    }
  }

  public decelerate(): void {
    if (this.state.speed > 0) {
      this.state.acceleration = -this.decelerationRate;
    }
  }

  public stopAcceleration(): void {
    this.state.acceleration = 0;
  }

  public turnLeft(amount: number = 2): void {
    this.state.heading = (this.state.heading - amount + 360) % 360;
  }

  public turnRight(amount: number = 2): void {
    this.state.heading = (this.state.heading + amount) % 360;
  }

  public async update(deltaTime: number): Promise<void> {
    // Update speed based on acceleration
    this.state.speed += this.state.acceleration * deltaTime;
    this.state.speed = Math.max(0, Math.min(this.state.speed, this.maxSpeed));

    // Natural deceleration when not accelerating
    if (this.state.acceleration === 0 && this.state.speed > 0) {
      this.state.speed = Math.max(0, this.state.speed - 0.5 * deltaTime);
    }

    // Update position based on speed and heading
    if (this.state.speed > 0) {
      const distance = this.state.speed * deltaTime;
      const cartographic = Cesium.Cartographic.fromCartesian(this.state.position);
      
      // Convert heading to radians (0 = North, 90 = East)
      const headingRadians = Cesium.Math.toRadians(this.state.heading);
      
      // Calculate new position
      const newCartographic = new Cesium.Cartographic(
        cartographic.longitude + (distance * Math.sin(headingRadians)) / (6371000 * Math.cos(cartographic.latitude)),
        cartographic.latitude + (distance * Math.cos(headingRadians)) / 6371000,
        cartographic.height
      );

      // Sample terrain height
      await this.updateTerrainHeight(newCartographic);
      
      this.state.position = Cesium.Cartesian3.fromRadians(
        newCartographic.longitude,
        newCartographic.latitude,
        this.state.altitude
      );
    }
  }

  private async updateTerrainHeight(cartographic: Cesium.Cartographic): Promise<void> {
    try {
      const terrainProvider = this.viewer.terrainProvider;
      const positions = [
        new Cesium.Cartographic(
          cartographic.longitude,
          cartographic.latitude,
          0
        ),
      ];

      const updatedPositions = await Cesium.sampleTerrainMostDetailed(
        terrainProvider,
        positions
      );

      if (updatedPositions && updatedPositions[0]) {
        // Keep vehicle slightly above terrain
        this.state.altitude = updatedPositions[0].height + 2;
      }
    } catch (error) {
      console.warn('Failed to sample terrain:', error);
      // Use approximate altitude if terrain sampling fails
      this.state.altitude = Math.max(this.state.altitude, 10);
    }
  }

  public getState(): VehicleState {
    return { ...this.state };
  }

  public getCartographicPosition(): Cesium.Cartographic {
    return Cesium.Cartographic.fromCartesian(this.state.position);
  }

  public destroy(): void {
    if (this.entity) {
      this.viewer.entities.remove(this.entity);
      this.entity = null;
    }
  }
}
