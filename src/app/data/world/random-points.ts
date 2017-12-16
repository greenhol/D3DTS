import { World, SpaceCoord, SpaceDot } from './world';

enum DirectionEnum {
    'UP',
    'DOWN',
    'LEFT',
    'RIGHT',
    'FORWARD',
    'BACKWARD'
}

export class RandomPoints extends World {
    private static AREA = 20;
    private static DIST = 0.15;
    
    public init() {
      this.reset();
      this.cameraStartPosition.position.z = -5;
      this.cameraStartPosition.angleX = 0;
      
      this.dots.push({coord: { x: 0, y: 0, z: 0 }});
      let dot: SpaceDot = JSON.parse(JSON.stringify(this.dots[0]));
      let lastDot: SpaceDot = JSON.parse(JSON.stringify(this.dots[0]));
      let direction: DirectionEnum;
    
      for (let i = 0; i < 1500; i++) {
        direction = Math.floor(Math.random() * 6);
        dot = JSON.parse(JSON.stringify(lastDot));
        switch (direction) {
          case DirectionEnum.UP:
            dot.coord.y += RandomPoints.DIST;
          break;
          case DirectionEnum.DOWN:
            dot.coord.y -= RandomPoints.DIST;
          break;
          case DirectionEnum.LEFT:
            dot.coord.x += RandomPoints.DIST;
          break;
          case DirectionEnum.RIGHT:
            dot.coord.x -= RandomPoints.DIST;
          break;
          case DirectionEnum.FORWARD:
            dot.coord.z -= RandomPoints.DIST;
          break;
          case DirectionEnum.BACKWARD:
            dot.coord.z += RandomPoints.DIST;
          break;
          default:
          console.log('NOK', direction);
        }
        if (Math.abs(dot.coord.x) > RandomPoints.AREA || Math.abs(dot.coord.y) > RandomPoints.AREA || Math.abs(dot.coord.z) > RandomPoints.AREA) {
          continue;
        }
        lastDot = JSON.parse(JSON.stringify(dot));
        this.dots.push(JSON.parse(JSON.stringify(lastDot)));
      }
    }
    
    public animateCameraRotationX(t: number): number {
        return t * Math.PI / 180;
    }

    public animateCameraRotationY(t: number): number {
        return 0.6253 * t * Math.PI / 180;
    }

    public animateCameraRotationZ(t: number): number {
        return 1.234 * t * Math.PI / 180;
    }
}
