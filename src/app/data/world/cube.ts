import { World, SpaceCoord } from './world';

export class Cube extends World {
    constructor() {
        super();
        this.dots = [
            {x: -1, y: -1, z: -1},
            {x: -1, y: -1, z: 1},
            {x: -1, y: 1, z: -1},
            {x: -1, y: 1, z: 1},
            {x: 1, y: -1, z: -1},
            {x: 1, y: -1, z: 1},
            {x: 1, y: 1, z: -1},
            {x: 1, y: 1, z: 1},
        ];
    }

    public animateCoord(t: number): void {
        const amp = Math.cos(5 * t * Math.PI / 180);
        this.dots = [
            {x: -1 * amp, y: -1 * amp, z: -1 * amp},
            {x: -1 * amp, y: -1 * amp, z: 1 * amp},
            {x: -1 * amp, y: 1 * amp, z: -1 * amp},
            {x: -1 * amp, y: 1 * amp, z: 1 * amp},
            {x: 1 * amp, y: -1 * amp, z: -1 * amp},
            {x: 1 * amp, y: -1 * amp, z: 1 * amp},
            {x: 1 * amp, y: 1 * amp, z: -1 * amp},
            {x: 1 * amp, y: 1 * amp, z: 1 * amp},
        ];
    }

    public animateCameraPositionX(t: number): number {
        return 5*Math.sin(t * Math.PI / 180);
    }

    public animateCameraPositionY(t: number): number {
        return 2*Math.sin(1.78 * t * Math.PI / 180);
    }

    public animateCameraPositionZ(t: number): number {
        return -5 + Math.sin(t * Math.PI / 180);
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
