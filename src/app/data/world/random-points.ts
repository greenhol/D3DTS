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
        
        this.coord.push({ x: 0, y: 0, z: 0 });
        let coord: SpaceCoord = JSON.parse(JSON.stringify(this.coord[0]));
        let lastCoord: SpaceCoord = JSON.parse(JSON.stringify(this.coord[0]));
        let direction: DirectionEnum;
      
        for (let i = 0; i < 1500; i++) {
          direction = Math.floor(Math.random() * 6);
          coord = JSON.parse(JSON.stringify(lastCoord));
          switch (direction) {
            case DirectionEnum.UP:
              coord.y += RandomPoints.DIST;
            break;
            case DirectionEnum.DOWN:
              coord.y -= RandomPoints.DIST;
            break;
            case DirectionEnum.LEFT:
              coord.x += RandomPoints.DIST;
            break;
            case DirectionEnum.RIGHT:
              coord.x -= RandomPoints.DIST;
            break;
            case DirectionEnum.FORWARD:
              coord.z -= RandomPoints.DIST;
            break;
            case DirectionEnum.BACKWARD:
              coord.z += RandomPoints.DIST;
            break;
            default:
            console.log('NOK', direction);
          }
          if (Math.abs(coord.x) > RandomPoints.AREA || Math.abs(coord.y) > RandomPoints.AREA || Math.abs(coord.z) > RandomPoints.AREA) {
            continue;
          }
          lastCoord = JSON.parse(JSON.stringify(coord));
          this.coord.push(JSON.parse(JSON.stringify(lastCoord)));
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
