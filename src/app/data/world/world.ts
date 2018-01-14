export interface SpaceCoord {
    x: number;
    y: number;
    z: number;
}

export interface ShapeStyle {
    strokeWidth: number;
    stroke: string;
    strokeOpacity: number;
    fill: string;
    fillOpacity: number;
}

export interface SpaceDot {
    coord: SpaceCoord
}

export interface DotsStyle {
    shape: ShapeStyle;
    scale: number;
}

export interface SpacePath {
    coord: SpaceCoord[],
    close: boolean
}

export interface PathsStyle {
    shape: ShapeStyle;
}

export interface SpaceText {
    coord: SpaceCoord,
    value: string
}

export interface TextsStyle {
    shape: ShapeStyle;
    alignmentBaseline: string;
    scale: number;
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
    public dotsStyle: DotsStyle;
    public paths: SpacePath[];
    public pathsStyle: PathsStyle;
    public texts: SpaceText[];
    public textsStyle: TextsStyle;

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
        this.dotsStyle = {
            shape: {
                strokeWidth: 1,
                stroke: '#aaa',
                strokeOpacity: 1,
                fill: '#ddd',
                fillOpacity: 1
            },
            scale: 1
        };
        this.paths = [];
        this.pathsStyle = {
            shape: {
                strokeWidth: 0.5,
                stroke: '#666',
                strokeOpacity: 1,
                fill: '#eee',
                fillOpacity: 0.5
            }
        };
        this.texts = [];
        this.textsStyle = {
            shape: {
                strokeWidth: 1,
                stroke: 'none',
                strokeOpacity: 1,
                fill: '#999',
                fillOpacity: 1
            },
            alignmentBaseline: 'central',
            scale: 1
        };

        this.cameraStartPosition = {
            position: {x: 0, y: 0, z: -5},
            angleX: 0,
            angleY: 0,
            angleZ: 0
        };
    }
}
