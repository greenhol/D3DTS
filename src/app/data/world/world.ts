export interface SpaceCoord {
    x: number;
    y: number;
    z: number;
}

export interface SpaceDot {
    coord: SpaceCoord
}

export interface SpaceShape {
    coord: SpaceCoord[]
}

export interface SpaceText {
    coord: SpaceCoord,
    value: string
}

export interface CameraPosition {
    position: SpaceCoord;
    angleX: number;
    angleY: number;
    angleZ: number;
}

export enum SpaceElementTypeEnum {
    DOT,
    SHAPE,
    TEXT
}

export abstract class World {

    public dots: SpaceDot[];
    public shapes: SpaceShape[];
    public texts: SpaceText[];

    public drawOrder: SpaceElementTypeEnum[] = [
        SpaceElementTypeEnum.SHAPE,
        SpaceElementTypeEnum.DOT,
        SpaceElementTypeEnum.TEXT
    ];

    public cameraStartPosition: CameraPosition;

    public abstract init(): void;
    public animateCameraRotationX?(t: number): number;
    public animateCameraRotationY?(t: number): number;
    public animateCameraRotationZ?(t: number): number;
    public animateCameraPositionX?(t: number): number;
    public animateCameraPositionY?(t: number): number;
    public animateCameraPositionZ?(t: number): number;
    public animateCoord?(t: number): void;
    
    public get hasAnimation(): boolean {
        return !!(this.animateCoord || this.animateCameraRotationX || this.animateCameraRotationY || this.animateCameraRotationZ
            || this.animateCameraPositionX || this.animateCameraPositionY || this.animateCameraPositionZ)
    }
    
    constructor() {
        this.reset();
    }
    
    public reset(): void {
        this.dots = [];
        this.shapes = [];
        this.texts = [];
        this.cameraStartPosition = {
            position: {x: 0, y: 0, z: -5},
            angleX: 0,
            angleY: 0,
            angleZ: 0
        };
    }
}
