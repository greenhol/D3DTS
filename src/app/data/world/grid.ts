import { World } from './world';

export class Grid extends World {
    private static SIZE = 1;
    private static DIST = 0.2;
    
    public init() {
        this.reset();
        this.cameraStartPosition.position.z = -3;
        this.cameraStartPosition.angleX = 0;
        this.cameraStartPosition.angleY = 0;

        for (let i = -Grid.SIZE; i <= Grid.SIZE; i+=Grid.DIST) {
            for (let j = -Grid.SIZE; j <= Grid.SIZE; j+=Grid.DIST) {
                for (let k = -Grid.SIZE; k <= Grid.SIZE; k+=Grid.DIST) {
                    this.dots.push({coord: {x: i, y: j, z: k}});
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
