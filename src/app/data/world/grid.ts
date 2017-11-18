import { World, SpaceCoord } from './world';

export class Grid extends World {
    private static SIZE = 1;
    private static DIST = 0.2;
    
    constructor() {
        super();
        this.cameraStartPosition.position.z = -5;
        this.cameraStartPosition.angleX = Math.PI * 6 / 5 - Math.PI;
        this.cameraStartPosition.angleY = Math.PI / 4 - Math.PI;

        for (let i = -Grid.SIZE; i <= Grid.SIZE; i+=Grid.DIST) {
            for (let j = -Grid.SIZE; j <= Grid.SIZE; j+=Grid.DIST) {
                for (let k = -Grid.SIZE; k <= Grid.SIZE; k+=Grid.DIST) {
                    this.dots.push({x: i, y: j, z: k});
                }
            }
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
