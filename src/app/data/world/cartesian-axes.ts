import { World } from './world';

export class CartesianAxes extends World {
    private static SIZE = 5;
    private static DIST = 0.15;
    
    public init() {
        this.reset();
        this.cameraStartPosition.position.z = -5;
        this.cameraStartPosition.angleX = Math.PI * 6 / 5 - Math.PI;
        this.cameraStartPosition.angleY = Math.PI * 5 / 4 - Math.PI;

        for (let i = -CartesianAxes.SIZE; i < CartesianAxes.SIZE; i+=CartesianAxes.DIST) {
            this.dots.push({coord: {x: i, y: 0, z: 0}});
            this.dots.push({coord: {x: 0, y: i, z: 0}});
            this.dots.push({coord: {x: 0, y: 0, z: i}});
        }
    }
    
}
