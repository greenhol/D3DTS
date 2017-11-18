import { World, SpaceCoord } from './world';

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
    
    constructor() {
        super();
        this.cameraStartPosition.position.z = -5;
        this.cameraStartPosition.angleX = Math.PI * 6 / 5 - Math.PI;
        
        this.dots.push({ x: 0, y: 0, z: 0 });
        let dot: SpaceCoord = JSON.parse(JSON.stringify(this.dots[0]));
        let lastDot: SpaceCoord = JSON.parse(JSON.stringify(this.dots[0]));
        let direction: DirectionEnum;
      
        for (let i = 0; i < 1500; i++) {
          direction = Math.floor(Math.random() * 6);
          dot = JSON.parse(JSON.stringify(lastDot));
          switch (direction) {
            case DirectionEnum.UP:
              dot.y += RandomPoints.DIST;
            break;
            case DirectionEnum.DOWN:
              dot.y -= RandomPoints.DIST;
            break;
            case DirectionEnum.LEFT:
              dot.x += RandomPoints.DIST;
            break;
            case DirectionEnum.RIGHT:
              dot.x -= RandomPoints.DIST;
            break;
            case DirectionEnum.FORWARD:
              dot.z -= RandomPoints.DIST;
            break;
            case DirectionEnum.BACKWARD:
              dot.z += RandomPoints.DIST;
            break;
            default:
            console.log('NOK', direction);
          }
          if (Math.abs(dot.x) > RandomPoints.AREA || Math.abs(dot.y) > RandomPoints.AREA || Math.abs(dot.z) > RandomPoints.AREA) {
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
