import { World, SpaceCoord, SpaceDot } from './world';

export class BellCurve extends World {
    private static SIZE = 15;
    private static DIST = 0.15;
    
    public init() {
        this.reset();
        this.cameraStartPosition.position.z = -5;
        this.cameraStartPosition.angleX = 0;
        for (let i = -BellCurve.SIZE; i < BellCurve.SIZE; i++) {
            for (let j = -BellCurve.SIZE; j < BellCurve.SIZE; j++) {
                this.dots.push({coord: {x: BellCurve.DIST * i, y: 0, z: BellCurve.DIST * j}});
            }
        }
    }
    
    public animateCoord(t: number): void {
        const amp = 3*Math.sin(t * Math.PI / 180);
        this.dots.forEach((dot: SpaceDot) => {
            dot.coord.y = amp * Math.exp(-(dot.coord.x * dot.coord.x + dot.coord.z * dot.coord.z));
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
