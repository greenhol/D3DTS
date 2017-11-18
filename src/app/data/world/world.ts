export interface SpaceCoord {
    x: number;
    y: number;
    z: number;
}

export interface CameraPosition {
    position: SpaceCoord;
    angleX: number;
    angleY: number;
    angleZ: number;
}
  
export abstract class World {
    public dots: SpaceCoord[] = [];
    public shapes: SpaceCoord[][] = [];
    public cameraStartPosition: CameraPosition = {
        position: {x: 0, y: 0, z: 0},
        angleX: 0,
        angleY: 0,
        angleZ: 0
    };
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
}
