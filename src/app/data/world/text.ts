import { World } from './world';

export class Text extends World {

    private vx = 0.03;
    private vy = 0.025;
    private vz = 0.035;

    public init() {
        this.reset();
        this.cameraStartPosition.position.z = -5;
        this.cameraStartPosition.angleX = Math.PI * 6 / 5 - Math.PI;
        this.dots = [
            {coord: {x: 0, y: 0, z: 0}},
            // {coord: {x: -2, y: 0, z: 0}},
            // {coord: {x: 2, y: 0, z: 0}},
            // {coord: {x: 0, y: -2, z: 0}},
            // {coord: {x: 0, y: 2, z: 0}},
            // {coord: {x: 0, y: 0, z: -2}},
            // {coord: {x: 0, y: 0, z: 2}}
        ];
        this.paths = [
            {coord: [{x: -1, y: -1, z: -1}, {x: -1, y: 1, z: -1}, {x: -1, y: 1, z: 1}, {x: -1, y: -1, z: 1}], close: true},
            {coord: [{x: 1, y: -1, z: -1}, {x: 1, y: 1, z: -1}, {x: 1, y: 1, z: 1}, {x: 1, y: -1, z: 1}], close: true},
            {coord: [{x: -1, y: -1, z: -1}, {x: 1, y: -1, z: -1}, {x: 1, y: -1, z: 1}, {x: -1, y: -1, z: 1}], close: true},
            {coord: [{x: -1, y: 1, z: -1}, {x: 1, y: 1, z: -1}, {x: 1, y: 1, z: 1}, {x: -1, y: 1, z: 1}], close: true},
            {coord: [{x: -1, y: -1, z: -1}, {x: 1, y: -1, z: -1}, {x: 1, y: 1, z: -1}, {x: -1, y: 1, z: -1}], close: true},
            {coord: [{x: -1, y: -1, z: 1}, {x: 1, y: -1, z: 1}, {x: 1, y: 1, z: 1}, {x: -1, y: 1, z: 1}], close: true}
        ];
        this.texts = [{coord: {x: 0, y: 0, z: 0}, value: '(0,0,0)'}];
    }

    public animateCoord() {
        this.dots[0].coord.x = this.texts[0].coord.x += this.vx;
        this.dots[0].coord.y = this.texts[0].coord.y += this.vy;
        this.dots[0].coord.z = this.texts[0].coord.z += this.vz; 
        this.texts[0].value = `  (${this.texts[0].coord.x.toFixed(1)},${this.texts[0].coord.y.toFixed(1)},${this.texts[0].coord.z.toFixed(1)})`;
        if (Math.abs(this.texts[0].coord.x) > 1) this.vx = -this.vx;
        if (Math.abs(this.texts[0].coord.y) > 1) this.vy = -this.vy;
        if (Math.abs(this.texts[0].coord.z) > 1) this.vz = -this.vz;
    }

    public animateCameraPositionX(t: number): number {
        return 2.5 * Math.sin(t * Math.PI / 180);
    }

    public animateCameraPositionY(t: number): number {
        return Math.sin(1.78 * t * Math.PI / 180);
    }

    public animateCameraPositionZ(t: number): number {
        return -5 + 2 * Math.sin(t * Math.PI / 180);
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
