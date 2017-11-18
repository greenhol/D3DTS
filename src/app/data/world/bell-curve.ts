import { World, SpaceCoord } from './world';

export class BellCurve extends World {
    private static SIZE = 15;
    private static DIST = 0.15;
    
    constructor() {
        super();
        this.cameraStartPosition.position.z = -5;
        this.cameraStartPosition.angleX = Math.PI * 6 / 5 - Math.PI;
        for (let i = -BellCurve.SIZE; i < BellCurve.SIZE; i++) {
            for (let j = -BellCurve.SIZE; j < BellCurve.SIZE; j++) {
                this.dots.push({x: BellCurve.DIST * i, y: 0, z: BellCurve.DIST * j});
            }
        }
    }
    
    public animateCoord(t: number): void {
        const amp = 3*Math.sin(t * Math.PI / 180);
        this.dots.forEach((dot: SpaceCoord) => {
            dot.y = amp * Math.exp(-(dot.x * dot.x + dot.z * dot.z));
        });
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
