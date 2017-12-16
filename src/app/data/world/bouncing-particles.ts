import { World, SpaceCoord, SpaceDot } from './world';

interface Particle {
  position: SpaceCoord;
  velocity: SpaceCoord;
  staticX: boolean;
  staticY: boolean;
  staticZ: boolean;
}

export class BouncingParticles extends World {
  private static ACCELERATION = 0.01;
  private static BOX_X = 2;
  private static BOX_Z = 2;
  private static BOX_HEIGHT = 5;
  private static CYLINDER = 2;
  private particles: Particle[];

  public init() {
    this.reset();
    this.cameraStartPosition.position.z = -5;
    this.cameraStartPosition.angleX = Math.PI * 6 / 5 - Math.PI;

    this.shapes = [
      {
        coord: [
          {x: -BouncingParticles.BOX_X, y: 0, z: -BouncingParticles.BOX_Z},
          {x: BouncingParticles.BOX_X, y: 0, z: -BouncingParticles.BOX_Z},
          {x: BouncingParticles.BOX_X, y: 0, z: BouncingParticles.BOX_Z},
          {x: -BouncingParticles.BOX_X, y: 0, z: BouncingParticles.BOX_Z}
        ]
      },
      {
        coord: [
          {x: -BouncingParticles.BOX_X, y: BouncingParticles.BOX_HEIGHT, z: -BouncingParticles.BOX_Z},
          {x: -BouncingParticles.BOX_X, y: 0, z: -BouncingParticles.BOX_Z},
          {x: BouncingParticles.BOX_X, y: 0, z: -BouncingParticles.BOX_Z},
          {x: BouncingParticles.BOX_X, y: BouncingParticles.BOX_HEIGHT, z: -BouncingParticles.BOX_Z}
        ]
      },
      {
        coord: [
          {x: -BouncingParticles.BOX_X, y: BouncingParticles.BOX_HEIGHT, z: -BouncingParticles.BOX_Z},
          {x: -BouncingParticles.BOX_X, y: 0, z: -BouncingParticles.BOX_Z},
          {x: -BouncingParticles.BOX_X, y: 0, z: BouncingParticles.BOX_Z},
          {x: -BouncingParticles.BOX_X, y: BouncingParticles.BOX_HEIGHT, z: BouncingParticles.BOX_Z}
        ]
      },
      {
        coord: [
          {x: -BouncingParticles.BOX_X, y: BouncingParticles.BOX_HEIGHT, z: BouncingParticles.BOX_Z},
          {x: -BouncingParticles.BOX_X, y: 0, z: BouncingParticles.BOX_Z},
          {x: BouncingParticles.BOX_X, y: 0, z: BouncingParticles.BOX_Z},
          {x: BouncingParticles.BOX_X, y: BouncingParticles.BOX_HEIGHT, z: BouncingParticles.BOX_Z}
        ]
      },
      {
        coord: [
          {x: BouncingParticles.BOX_X, y: BouncingParticles.BOX_HEIGHT, z: BouncingParticles.BOX_Z},
          {x: BouncingParticles.BOX_X, y: 0, z: BouncingParticles.BOX_Z},
          {x: BouncingParticles.BOX_X, y: 0, z: -BouncingParticles.BOX_Z},
          {x: BouncingParticles.BOX_X, y: BouncingParticles.BOX_HEIGHT, z: -BouncingParticles.BOX_Z}
        ]
      }
    ];

    this.particles = [];
    for (let i = 0; i < 1500; i++) {

      let angle = 2*Math.PI*Math.random();
      let velocity = 0.2 * Math.random();

      this.particles.push({
        position: {
          x: 0,
          y: 0.01,
          z: 0
        },
        velocity: {
          x: velocity * Math.sin(angle),
          y: Math.random() * 0.3,
          z: velocity * Math.cos(angle),
        },
        staticX: false,
        staticY: false,
        staticZ: false
      });
    }
    this.dots = this.particles.map((particle: Particle): SpaceDot => {
       return {coord: particle.position};
    });
  }

  public animateCoord(t: number): void {
    this.particles.forEach((particle: Particle) => {

      if (particle.staticX && particle.staticY && particle.staticZ) return;

      // Y -> Vertical (Gravity)
      if (particle.position.y <= 0 && particle.velocity.y < 0) {
        particle.velocity.x *= 0.7;
        particle.velocity.y *= -0.7;
        particle.velocity.z *= 0.7;
      } else {
        particle.velocity.y -= BouncingParticles.ACCELERATION;
      }
      // X, Z Horizontal (Bounce in Box)
      if (Math.abs(particle.position.x) >= BouncingParticles.BOX_X-0.1) {
          particle.velocity.x *= -1;
      }
      if (Math.abs(particle.position.z) >= BouncingParticles.BOX_Z-0.1) {
          particle.velocity.z *= -1;
      }
      // X, Z Horizontal (Bounce in Cylinder)
      // if (Math.sqrt(particle.position.x * particle.position.x + particle.position.z *particle.position.z) >= BouncingParticles.CYLINDER) {
      //   particle.velocity.x = -particle.velocity.x;
      //   particle.velocity.z = -particle.velocity.z;
      // }

      // Update Position
      if (Math.abs(particle.velocity.x) < 0.001) particle.staticX = true;
      if (Math.abs(particle.velocity.y) < 0.001 && Math.abs(particle.position.y) < 0.001) particle.staticY = true;
      if (Math.abs(particle.velocity.z) < 0.001) particle.staticZ = true;

      if(!particle.staticX) particle.position.x += particle.velocity.x;
      if(!particle.staticX) particle.position.y += particle.velocity.y;
      if(!particle.staticX) particle.position.z += particle.velocity.z;      
    });
    this.dots = this.particles.map((particle: Particle): SpaceDot => {
      return {coord: particle.position};
   });
  }

  public animateCameraRotationY(t: number): number {
      return t * Math.PI / 180;
  }
}