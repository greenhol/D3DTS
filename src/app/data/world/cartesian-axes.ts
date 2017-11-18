import { World, SpaceCoord } from './world';

export class CartesianAxes extends World {
    private static SIZE = 5;
    private static DIST = 0.15;
    
    constructor() {
        super();
        this.cameraStartPosition.position.z = -5;
        this.cameraStartPosition.angleX = Math.PI * 6 / 5 - Math.PI;
        this.cameraStartPosition.angleY = Math.PI / 4 - Math.PI;

        for (let i = -CartesianAxes.SIZE; i < CartesianAxes.SIZE; i+=CartesianAxes.DIST) {
            this.dots.push({x: i, y: 0, z: 0});
            this.dots.push({x: 0, y: i, z: 0});
            this.dots.push({x: 0, y: 0, z: i});
        }
    }
    
}
