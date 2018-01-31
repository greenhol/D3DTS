import { World } from './world';
import { DATA } from './chart3DLifeTable.data';

export class Chart3DLifeTable extends World {
    private static DIST = 0.1;
    private data: number[][] = DATA;
    
    public init() {
        this.reset();
        this.cameraStartPosition.position.y = 2.5;
        this.cameraStartPosition.position.z = -10;
        this.cameraStartPosition.angleX = 15 * Math.PI / 180;
        this.cameraStartPosition.angleY = -90 * Math.PI / 180;
        
        this.dotsStyle.scale = 0.25;
        this.textsStyle.fontSize = '18px';

        const HALF_SIZE_X = this.data.length * Chart3DLifeTable.DIST / 2;
        const HALF_SIZE_Z = this.data[0].length * Chart3DLifeTable.DIST / 2;

        for(let i = 0; i < this.data.length; i++) {
            for(let j = 0; j < this.data[i].length; j++) {
                this.dots.push({coord: {x: -HALF_SIZE_X + Chart3DLifeTable.DIST * i, y: 0.1 * this.data[i][j], z: -HALF_SIZE_Z + Chart3DLifeTable.DIST * j}});
            }
        }

        this.paths.push(
            {
                coord: [
                    {x: HALF_SIZE_X, y: 0, z: HALF_SIZE_Z},
                    {x: -HALF_SIZE_X, y: 0, z: HALF_SIZE_Z},
                    {x: -HALF_SIZE_X, y: 0, z: -HALF_SIZE_Z},
                    {x: HALF_SIZE_X, y: 0, z: -HALF_SIZE_Z}
                ],
                close: true
            },
            {
                coord: [
                    {x: -HALF_SIZE_X, y: 0, z: HALF_SIZE_Z},
                    {x: -HALF_SIZE_X, y: 10, z: HALF_SIZE_Z},
                ],
                close: false
            }
        );

        this.texts.push({coord: {x: -HALF_SIZE_X, y: 0, z: -HALF_SIZE_Z}, value: '1871'});
        this.texts.push({coord: {x: -HALF_SIZE_X, y: 0, z: HALF_SIZE_Z}, value: '2017'});
        this.texts.push({coord: {x: -HALF_SIZE_X, y: 10, z: HALF_SIZE_Z}, value: '100'});
        this.texts.push({coord: {x: HALF_SIZE_X, y: 0, z: HALF_SIZE_Z}, value: '100'});
    }

    
}
