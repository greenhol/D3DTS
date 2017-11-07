import { World, SpaceCoord } from './world';

interface Particle {
  position: SpaceCoord;
  velocity: SpaceCoord;
}

export class BouncingParticles extends World {
  private static ACCELERATION = 0.01;
  private static BOX_X = 3;
  private static BOX_Z = 3;
  private static CYLINDER = 2;
  private particles: Particle[];

  constructor() {
    super();
    this.cameraStartPosition.position.z = -5;
    this.cameraStartPosition.angleX = Math.PI * 6 / 5 - Math.PI;

    this.particles = [];
    for (let i = 0; i < 100; i++) {
      this.particles.push({
        position: {
          x: 0,
          y: 0,
          z: 0
        },
        velocity: {
          x: 0.1 * (Math.random() - 0.5),
          y: 0,
          z: 0.1 * (Math.random() - 0.5)
        }
      });
    }
    this.coord = this.particles.map((particle: Particle) => particle.position);

    console.log(this.particles);
  }

  public animateCoord(t: number): void {
    this.particles.forEach((particle: Particle) => {
      // Y -> Vertical (Gravity)
      if (particle.position.y <= 0) {
        particle.velocity.y = 0.01 + Math.random() * 0.25;
      } else {
        particle.velocity.y -= BouncingParticles.ACCELERATION;
      }
      // X, Z Horizontal (Bounce in Box)
    //   if (Math.abs(particle.position.x) >= BouncingParticles.BOX_X) {
    //       particle.velocity.x = -particle.velocity.x;
    //   }
    //   if (Math.abs(particle.position.z) >= BouncingParticles.BOX_Z) {
    //       particle.velocity.z = -particle.velocity.z;
    //   }
      // X, Z Horizontal (Bounce in Cylinder)
      if (Math.sqrt(particle.position.x * particle.position.x + particle.position.z *particle.position.z) >= BouncingParticles.CYLINDER) {
        particle.velocity.x = -particle.velocity.x;
        particle.velocity.z = -particle.velocity.z;
      }

      // Update Position
      particle.position.x += particle.velocity.x;
      particle.position.y += particle.velocity.y;
      particle.position.z += particle.velocity.z;
    });
    this.coord = this.particles.map((particle: Particle) => particle.position);
  }

  public animateCameraRotationY(t: number): number {
      return t * Math.PI / 180;
  }
}