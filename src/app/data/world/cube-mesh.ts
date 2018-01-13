import { World } from './world';

export class CubeMesh extends World {
    public init() {
        this.reset();
        this.cameraStartPosition.position.z = -5;
        this.cameraStartPosition.angleX = Math.PI * 6 / 5 - Math.PI;
        this.paths = [
            {coord: [{x: -1, y: -1, z: -1}, {x: -1, y: 1, z: -1}, {x: -1, y: 1, z: 1}, {x: -1, y: -1, z: 1}, {x: -1, y: -1, z: -1}], close: false},
            {coord: [{x: 1, y: -1, z: -1}, {x: 1, y: 1, z: -1}, {x: 1, y: 1, z: 1}, {x: 1, y: -1, z: 1}, {x: 1, y: -1, z: -1}], close: false},
            {coord: [{x: -1, y: -1, z: -1}, {x: 1, y: -1, z: -1}, {x: 1, y: -1, z: 1}, {x: -1, y: -1, z: 1}, {x: -1, y: -1, z: -1}], close: false},
            {coord: [{x: -1, y: 1, z: -1}, {x: 1, y: 1, z: -1}, {x: 1, y: 1, z: 1}, {x: -1, y: 1, z: 1}, {x: -1, y: 1, z: -1}], close: false},
            {coord: [{x: -1, y: -1, z: -1}, {x: 1, y: -1, z: -1}, {x: 1, y: 1, z: -1}, {x: -1, y: 1, z: -1}, {x: -1, y: -1, z: -1}], close: false},
            {coord: [{x: -1, y: -1, z: 1}, {x: 1, y: -1, z: 1}, {x: 1, y: 1, z: 1}, {x: -1, y: 1, z: 1}, {x: -1, y: -1, z: 1}], close: false}
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
