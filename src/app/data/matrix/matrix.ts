import { SpaceCoord } from '../world/world';

export enum AxisEnum {
    'X',
    'Y',
    'Z'
}

export class Matrix {

    public static MATRIX_SIZE = 4;

    public static multiply(A: Matrix, B: Matrix): Matrix {
        // A*B=C
        let C = new Matrix();
        for (let i = 0; i < Matrix.MATRIX_SIZE; i++) {
            for (let j = 0; j < Matrix.MATRIX_SIZE; j++) {
                for (let k = 0; k < Matrix.MATRIX_SIZE; k++) {
                    C.m[i][j] += A.m[i][k] * B.m[k][j];
                }
            }
        }
        return C;
    }

    public m = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

    constructor() {
    }

    public get det(): number {
        let m = this.m;
        return m[0][0]*m[1][1]*m[2][2]*m[3][3] + m[0][0]*m[1][2]*m[2][3]*m[3][1] + m[0][0]*m[1][3]*m[2][1]*m[3][2]
             + m[0][1]*m[1][0]*m[2][3]*m[3][2] + m[0][1]*m[1][2]*m[2][0]*m[3][3] + m[0][1]*m[1][3]*m[2][2]*m[3][0]
             + m[0][2]*m[1][0]*m[2][1]*m[3][3] + m[0][2]*m[1][1]*m[2][3]*m[3][0] + m[0][2]*m[1][3]*m[2][0]*m[3][1]
             + m[0][3]*m[1][0]*m[2][2]*m[3][1] + m[0][3]*m[1][1]*m[2][0]*m[3][2] + m[0][3]*m[1][2]*m[2][1]*m[3][0]
             - m[0][0]*m[1][1]*m[2][3]*m[3][2] - m[0][0]*m[1][2]*m[2][1]*m[3][3] - m[0][0]*m[1][3]*m[2][2]*m[3][1]
             - m[0][1]*m[1][0]*m[2][2]*m[3][3] - m[0][1]*m[1][2]*m[2][3]*m[3][0] - m[0][1]*m[1][3]*m[2][0]*m[3][2]
             - m[0][2]*m[1][0]*m[2][3]*m[3][1] - m[0][2]*m[1][1]*m[2][0]*m[3][3] - m[0][2]*m[1][3]*m[2][1]*m[3][0]
             - m[0][3]*m[1][0]*m[2][1]*m[3][2] - m[0][3]*m[1][1]*m[2][2]*m[3][0] - m[0][3]*m[1][2]*m[2][0]*m[3][1];
    }

    public get inv(): Matrix | null {
        let det = this.det;
        if (!det) return null;

        let m = this.m;
        let inv = new Matrix();

        inv.m[0][0] = m[1][1]*m[2][2]*m[3][3] + m[1][2]*m[2][3]*m[3][1] + m[1][3]*m[2][1]*m[3][2] - m[1][1]*m[2][3]*m[3][2] - m[1][2]*m[2][1]*m[3][3] - m[1][3]*m[2][2]*m[3][1];
        inv.m[0][1] = m[0][1]*m[2][3]*m[3][2] + m[0][2]*m[2][1]*m[3][3] + m[0][3]*m[2][2]*m[3][1] - m[0][1]*m[2][2]*m[3][3] - m[0][2]*m[2][3]*m[3][1] - m[0][3]*m[2][1]*m[3][2];
        inv.m[0][2] = m[0][1]*m[1][2]*m[3][3] + m[0][2]*m[1][3]*m[3][1] + m[0][3]*m[1][1]*m[3][2] - m[0][1]*m[1][3]*m[3][2] - m[0][2]*m[1][1]*m[3][3] - m[0][3]*m[1][2]*m[3][1];
        inv.m[0][3] = m[0][1]*m[1][3]*m[2][2] + m[0][2]*m[1][1]*m[2][3] + m[0][3]*m[1][2]*m[2][1] - m[0][1]*m[1][2]*m[2][3] - m[0][2]*m[1][3]*m[2][1] - m[0][3]*m[1][1]*m[2][2];
        
        inv.m[1][0] = m[1][0]*m[2][3]*m[3][2] + m[1][2]*m[2][0]*m[3][3] + m[1][3]*m[2][2]*m[3][0] - m[1][0]*m[2][2]*m[3][3] - m[1][2]*m[2][3]*m[3][0] - m[1][3]*m[2][0]*m[3][2];
        inv.m[1][1] = m[0][0]*m[2][2]*m[3][3] + m[0][2]*m[2][3]*m[3][0] + m[0][3]*m[2][0]*m[3][2] - m[0][0]*m[2][3]*m[3][2] - m[0][2]*m[2][0]*m[3][3] - m[0][3]*m[2][2]*m[3][0];
        inv.m[1][2] = m[0][0]*m[1][3]*m[3][2] + m[0][2]*m[1][0]*m[3][3] + m[0][3]*m[1][2]*m[3][0] - m[0][0]*m[1][2]*m[3][3] - m[0][2]*m[1][3]*m[3][0] - m[0][3]*m[1][0]*m[3][2];
        inv.m[1][3] = m[0][0]*m[1][2]*m[2][3] + m[0][2]*m[1][3]*m[2][0] + m[0][3]*m[1][0]*m[2][2] - m[0][0]*m[1][3]*m[2][2] - m[0][2]*m[1][0]*m[2][3] - m[0][3]*m[1][2]*m[2][0];
        
        inv.m[2][0] = m[1][0]*m[2][1]*m[3][3] + m[1][1]*m[2][3]*m[3][0] + m[1][3]*m[2][0]*m[3][1] - m[1][0]*m[2][3]*m[3][1] - m[1][1]*m[2][0]*m[3][3] - m[1][3]*m[2][1]*m[3][0];
        inv.m[2][1] = m[0][0]*m[2][3]*m[3][1] + m[0][1]*m[2][0]*m[3][3] + m[0][3]*m[2][1]*m[3][0] - m[0][0]*m[2][1]*m[3][3] - m[0][1]*m[2][3]*m[3][0] - m[0][3]*m[2][0]*m[3][1];
        inv.m[2][2] = m[0][0]*m[1][1]*m[3][3] + m[0][1]*m[1][3]*m[3][0] + m[0][3]*m[1][0]*m[3][1] - m[0][0]*m[1][3]*m[3][1] - m[0][1]*m[1][0]*m[3][3] - m[0][3]*m[1][1]*m[3][0];
        inv.m[2][3] = m[0][0]*m[1][3]*m[2][1] + m[0][1]*m[1][0]*m[2][3] + m[0][3]*m[1][1]*m[2][0] - m[0][0]*m[1][1]*m[2][3] - m[0][1]*m[1][3]*m[2][0] - m[0][3]*m[1][0]*m[2][1];
        
        inv.m[3][0] = m[1][0]*m[2][2]*m[3][1] + m[1][1]*m[2][0]*m[3][2] + m[1][2]*m[2][1]*m[3][0] - m[1][0]*m[2][1]*m[3][2] - m[1][1]*m[2][2]*m[3][0] - m[1][2]*m[2][0]*m[3][1];
        inv.m[3][1] = m[0][0]*m[2][1]*m[3][2] + m[0][1]*m[2][2]*m[3][0] + m[0][2]*m[2][0]*m[3][1] - m[0][0]*m[2][2]*m[3][1] - m[0][1]*m[2][0]*m[3][2] - m[0][2]*m[2][1]*m[3][0];
        inv.m[3][2] = m[0][0]*m[1][2]*m[3][1] + m[0][1]*m[1][0]*m[3][2] + m[0][2]*m[1][1]*m[3][0] - m[0][0]*m[1][1]*m[3][2] - m[0][1]*m[1][2]*m[3][0] - m[0][2]*m[1][0]*m[3][1];
        inv.m[3][3] = m[0][0]*m[1][1]*m[2][2] + m[0][1]*m[1][2]*m[2][0] + m[0][2]*m[1][0]*m[2][1] - m[0][0]*m[1][2]*m[2][1] - m[0][1]*m[1][0]*m[2][2] - m[0][2]*m[1][1]*m[2][0];

        inv.scalarMultiply(1/det);
        return inv;
    }

    public scalarMultiply(a: number) {
        for (let i = 0; i < Matrix.MATRIX_SIZE; i++) {
            for (let j = 0; j < Matrix.MATRIX_SIZE; j++) {
                this.m[i][j] *= a;
            }
        }
    }

    public vectorMultiply(p: SpaceCoord): SpaceCoord {
        let a = [p.x, p.y, p.z, 1];
        let b = [];
        let value: number;

        for (let i = 0; i < Matrix.MATRIX_SIZE; i++) {
            value = 0;
            for (let j = 0; j < Matrix.MATRIX_SIZE; j++) {
                value += this.m[i][j] * a[j];
            }
            b.push(value);
        }

        return {
            x: b[0],
            y: b[1],
            z: b[2]
        }
    }

    public log() {
        let output = '';
        for (let i = 0; i < Matrix.MATRIX_SIZE; i++) {
            for (let j = 0; j < Matrix.MATRIX_SIZE; j++) {
                output += this.m[i][j].toFixed(5) + ' ';
            }
            output += '\n';
        }
        console.log(output);
    }
    
}

export class IdentityMatrix extends Matrix {
    
    constructor() {
        super();
        for (let i = 0; i < Matrix.MATRIX_SIZE; i++) {
            this.m[i][i] = 1;
        }
    }

}

export class RotaryMatrix extends IdentityMatrix {
    
    private axis: AxisEnum;

    constructor(axis: AxisEnum, angle: number) {
        super();
        this.axis = axis;
        this.angle = angle;
    }

    public set angle(a: number) {
        const cosa = Math.cos(a);
        const sina = Math.sin(a);

        switch (this.axis) {
            case AxisEnum.X:
                this.m[1][1] = cosa;
                this.m[1][2] = -sina;
                this.m[2][1] = sina;
                this.m[2][2] = cosa;
            break;
            case AxisEnum.Y:
                this.m[0][0] = cosa;
                this.m[0][2] = sina;
                this.m[2][0] = -sina;
                this.m[2][2] = cosa;
            break;
            case AxisEnum.Z:
                this.m[0][0] = cosa;
                this.m[0][1] = -sina;
                this.m[1][0] = sina;
                this.m[1][1] = cosa;
            break;
        }
    }

}

export class TranslateMatrix extends IdentityMatrix {
    
    constructor(vector: SpaceCoord) {
        super();
        this.vector = vector;
    }

    public set vector(v: SpaceCoord) {
        this.m[0][3] = v.x;
        this.m[1][3] = v.y;
        this.m[2][3] = v.z;
    }

    public set x(v: number) {
        this.m[0][3] = v;
    }

    public set y(v: number) {
        this.m[1][3] = v;
    }

    public set z(v: number) {
        this.m[2][3] = v;
    }

}
