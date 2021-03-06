import { World } from './world';

export class Chart2D extends World {
    private static SIZE_Y = 4;
    private static DIST = 0.5;
    private static ANGLE_Y_AMP = Math.PI * 9 / 8 - Math.PI;
    private data: number[];
    
    public init() {
        this.reset();
        this.cameraStartPosition.position.x = 3.9;
        this.cameraStartPosition.position.y = 2;
        this.cameraStartPosition.position.z = -3;
        this.cameraStartPosition.angleY = Chart2D.ANGLE_Y_AMP;

        this.dotsStyle.shape.fill = 'steelblue';
        this.dotsStyle.shape.stroke = 'none';
        this.pathsStyle.shape.fill = '#aaf';
        this.textsStyle.shape.fill = 'steelblue';

        this.animateCoord(0);
    }

    public animateCameraRotationY(t: number): number {
        return Chart2D.ANGLE_Y_AMP + Math.sin(t/50) * 1.5 * Chart2D.ANGLE_Y_AMP;
    }

    public animateCoord?(t: number): void {
        if (!(t%25)) {
            this.createData();
            this.updateCoords();
        }
    }

    private createData(): void {
        this.data = [];
        for (let i = 0; i < 18; i++) {
            this.data.push(4*Math.random());
        }
    }

    private updateCoords(): void {

        this.dots = [];
        this.paths = [];
        this.texts = [];

        // Data
        for (let i = 0; i < this.data.length; i++) {
            this.dots.push({coord: {x: i * Chart2D.DIST, y: this.data[i], z: 0}});
            this.texts.push({
                coord: {x: i * Chart2D.DIST, y: this.data[i] + 0.25, z: 0},
                value: this.data[i].toFixed(1)
            })
        }
        for (let i = 0; i < this.data.length - 1; i++) {
            this.paths.push(
                {
                    coord: [
                        {x: i * Chart2D.DIST, y: 0, z: 0},
                        {x: i * Chart2D.DIST, y: this.data[i], z: 0},
                        {x: (i + 1) * Chart2D.DIST, y: this.data[i + 1], z: 0},
                        {x: (i + 1) * Chart2D.DIST, y: 0, z: 0}
                    ],
                    close: true
                }
            );
        }

        // Grid
        for (let i = 0; i <= Chart2D.SIZE_Y; i++) {
            this.paths.push(
                {
                    coord: [
                        {x: 0, y: i, z: 0},
                        {x: (this.data.length-1) * Chart2D.DIST, y: i, z: 0}
                    ],
                    close: true
                }
            );
            this.texts.push({
                coord: {x: -0.5, y: i, z: 0},
                value: (i).toFixed(1)
            })
        }
        for (let i = 0; i <= (this.data.length-1) * Chart2D.DIST; i+= Chart2D.DIST) {
            this.paths.push(
                {
                    coord: [
                        {x: i, y: 0, z: 0},
                        {x: i, y: Chart2D.SIZE_Y, z: 0}
                    ],
                    close: true
                }
            );
            this.texts.push({
                coord: {x: i, y: -0.25, z: 0},
                value: (i).toFixed(1)
            })
        }

        // Axis
        this.paths.push({coord: [{x: -0.5, y: -0.1, z: 0}, {x: this.data.length * Chart2D.DIST, y: -0.1, z: 0}], close: false});
        this.paths.push({coord: [{x: -0.1, y: -0.5, z: 0}, {x: -0.1, y: Chart2D.SIZE_Y + 0.5, z: 0}], close: false});           
    }
    
}
