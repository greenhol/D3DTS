export interface SpaceCoord {
    x: number;
    y: number;
    z: number;
}

export interface SpaceDot {
    coord: SpaceCoord
}

export interface SpacePath {
    coord: SpaceCoord[],
    close: boolean
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
    PATH,
    TEXT
}

export abstract class World {

    public dots: SpaceDot[];
    public paths: SpacePath[];
    public texts: SpaceText[];

    public drawOrder: SpaceElementTypeEnum[] = [
        SpaceElementTypeEnum.PATH,
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
        this.paths = [];
        this.texts = [];
        this.cameraStartPosition = {
            position: {x: 0, y: 0, z: -5},
            angleX: 0,
            angleY: 0,
            angleZ: 0
        };
    }
}
