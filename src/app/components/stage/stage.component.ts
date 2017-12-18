import { Component, ElementRef, ViewEncapsulation, Input } from '@angular/core';
import { D3Service, D3, Selection } from 'd3-ng2-service';
import { SpaceCoord, World, SpaceElementTypeEnum, SpaceDot, SpacePath, SpaceText } from './../../data/world/world';
import { Matrix, IdentityMatrix, RotaryMatrix, TranslateMatrix, AxisEnum } from './../../data/matrix/matrix';

interface PlaneCoord {
  x: number;
  y: number;
}

interface PixelCoord {
  left: number;
  top: number;
}

interface StagePoint {
  world: SpaceCoord;
  pixel: PixelCoord;
  dist: number;
}

interface StagePath {
  world: SpaceCoord[];
  close: boolean;
  pixel: PixelCoord[];
  dist: number;
}

interface StageText {
  world: SpaceCoord;
  pixel: PixelCoord;
  dist: number;
  value: string;
}

// const STAGE_WIDTH = 1900;
// const STAGE_HEIGHT = 1056;
const STAGE_WIDTH = 1280;
const STAGE_HEIGHT = 720;
// const STAGE_WIDTH = 800;
// const STAGE_HEIGHT = 800;

const STAGE_WIDTH_HALF = STAGE_WIDTH/2;
const STAGE_HEIGHT_HALF = STAGE_HEIGHT/2;;
const STAGE_RATIO = STAGE_WIDTH / STAGE_HEIGHT;
const STAGE_RATIO_INVERTED = STAGE_HEIGHT / STAGE_WIDTH;
const STAGE_NEAR = 1;
const STAGE_FAR = 30;

@Component({
  selector: 'd3d-stage',
  template: ``,
  styleUrls: ['./stage.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StageComponent {

  @Input() public set world(world: World) {
    this.injectWorld(world);
  }

  @Input() public set cameraAngleX(angle: number) {
    this.rxMatrix.angle = angle;
    this.transform();
  }

  @Input() public set cameraAngleY(angle: number) {
    this.ryMatrix.angle = angle;
    this.transform();
  }

  @Input() public set cameraAngleZ(angle: number) {
    this.rzMatrix.angle = angle;
    this.transform();
  }

  @Input() public set cameraPosX(dist: number) {
    this.tMatrix.x = dist;
    this.transform();
  }

  @Input() public set cameraPosY(dist: number) {
    this.tMatrix.y = dist;
    this.transform();
  }

  @Input() public set cameraPosZ(dist: number) {
    this.tMatrix.z = dist;
    this.transform();
  }

  private d3: D3;
  private svg: any;
  private svgg: any;

  private rxMatrix: RotaryMatrix = new RotaryMatrix(AxisEnum.X, 0);
  private ryMatrix: RotaryMatrix = new RotaryMatrix(AxisEnum.Y, 0);
  private rzMatrix: RotaryMatrix = new RotaryMatrix(AxisEnum.Z, 0);
  private tMatrix: TranslateMatrix = new TranslateMatrix({x: 0, y: 0, z: 0});
  
  private worldDots: SpaceDot[];
  private projectedDots: StagePoint[] = [];
  private worldPaths: SpacePath[];
  private projectedPaths: StagePath[] = [];
  private worldTexts: SpaceText[];
  private projectedTexts: StageText[] = [];
  private drawOrder: SpaceElementTypeEnum[];

  private timer: number;

  private static spaceToPlane(coord: SpaceCoord): PlaneCoord {
    if (coord.z < STAGE_NEAR) {
      return {
        x: 0,
        y: 0
      }
    }

    const lambda = 1/coord.z;
    return {
      x: lambda * coord.x,
      y: lambda * coord.y
    }
  }

  private static distanceToCamera(coord: SpaceCoord): number {
    if (coord.z < STAGE_NEAR) {
      return -1;
    }
    return (STAGE_NEAR*(STAGE_FAR-coord.z))/(coord.z*(STAGE_FAR-STAGE_NEAR));
  }

  private static planeToPixel(coord: PlaneCoord): PixelCoord {
    return {
      left: STAGE_WIDTH_HALF * coord.x * STAGE_RATIO_INVERTED + STAGE_WIDTH_HALF,
      top: -STAGE_HEIGHT_HALF * coord.y + STAGE_HEIGHT_HALF
    }
  }

  private static spaceToPixel(coord: SpaceCoord): PixelCoord {
    return StageComponent.planeToPixel(StageComponent.spaceToPlane(coord));
  }

  constructor(private element: ElementRef, d3Service: D3Service) {
    this.d3 = d3Service.getD3();

    this.svg = this.d3.select(this.element.nativeElement)
      .append('svg')
      .classed('stage', true)
      .style("width", STAGE_WIDTH + 1)
      .style("height", STAGE_HEIGHT + 1);

    // Group
    this.svgg = this.svg.append('g')
      .attr('transform', 'translate(.5, .5)');
  }

  public injectWorld(world: World): void {
    
    if (!world) {
      this.worldDots = [];
      this.worldPaths = [];
      return;
    }

    this.flushElements();    
    this.flushAnimation();
    
    this.worldDots = world.dots;
    this.worldPaths = world.paths;
    this.worldTexts = world.texts;
    this.drawOrder = world.drawOrder;

    this.rxMatrix.angle = world.cameraStartPosition.angleX;
    this.ryMatrix.angle = world.cameraStartPosition.angleY;
    this.rzMatrix.angle = world.cameraStartPosition.angleZ;
    this.tMatrix.vector = world.cameraStartPosition.position;

    this.createData();
    this.createElements();
    this.updateElements();

    if (world.hasAnimation) {
      this.startAnimation(world);
    }
  }

  private transform() {
    this.createData();
    this.updateElements();    
  }

  private createData() {

    let myMatrix = new IdentityMatrix();
    myMatrix = Matrix.multiply(myMatrix, this.rzMatrix);
    myMatrix = Matrix.multiply(myMatrix, this.ryMatrix);
    myMatrix = Matrix.multiply(myMatrix, this.rxMatrix);    
    myMatrix = Matrix.multiply(myMatrix, this.tMatrix);        
    myMatrix = myMatrix.inv;

    // Dots
    this.projectedDots = this.worldDots.map((point: SpaceDot): StagePoint => {
      let v = myMatrix.vectorMultiply(point.coord);
      return {
          world: point.coord,
          pixel: StageComponent.spaceToPixel(v),
          dist: StageComponent.distanceToCamera(v)
      }
    });
    this.projectedDots.sort((a: StagePoint, b: StagePoint) => a.dist - b.dist);

    // Paths
    this.projectedPaths = this.worldPaths.map((path: SpacePath): StagePath => {
      let v = path.coord.map((vertex: SpaceCoord) => {
        return myMatrix.vectorMultiply(vertex);
      });

      let pixel: PixelCoord[] = [];
      let dist: number = 0;
      v.forEach((coord: SpaceCoord) => {
        pixel.push(StageComponent.spaceToPixel(coord));
        // dist += StageComponent.distanceToCamera(coord);
      });
      // dist /= v.length;
      dist = Math.min.apply(Math, v.map((coord: SpaceCoord) => StageComponent.distanceToCamera(coord)));
      
      return {
          world: path.coord,
          close: path.close,
          pixel: pixel,
          dist: (dist < 0) ? -1 : 1
      }
    });

    // Texts
    this.projectedTexts = this.worldTexts.map((text: SpaceText): StageText => {
      let v = myMatrix.vectorMultiply(text.coord);
      return {
          world: text.coord,
          pixel: StageComponent.spaceToPixel(v),
          dist: StageComponent.distanceToCamera(v),
          value: text.value
      }
    });
    this.projectedTexts.sort((a: StageText, b: StageText) => a.dist - b.dist);
  }

  private flushAnimation() {
    clearInterval(this.timer);
  }

  private startAnimation(world: World) {
    let t = 0;
    this.timer = setInterval(() => {
      t++;
      if (world.animateCoord) {
        world.animateCoord(t);
        this.worldDots = world.dots;
        this.worldPaths = world.paths;
      }
      if (world.animateCameraRotationX) {
        this.rxMatrix.angle = world.animateCameraRotationX(t);
      }
      if (world.animateCameraRotationY) {
        this.ryMatrix.angle = world.animateCameraRotationY(t);
      }
      if (world.animateCameraRotationZ) {
        this.rzMatrix.angle = world.animateCameraRotationZ(t);
      }
      if (world.animateCameraPositionX) {
        this.tMatrix.x = world.animateCameraPositionX(t);
      }
      if (world.animateCameraPositionY) {
        this.tMatrix.y = world.animateCameraPositionY(t);
      }
      if (world.animateCameraPositionZ) {
        this.tMatrix.z = world.animateCameraPositionZ(t);
      }
      this.transform();
    }, 40);
  }

  private flushElements() {
    this.svgg.selectAll('*').remove();    
  }

  private createElements() {
    this.flushElements();
    this.drawOrder.forEach((spaceElementType: SpaceElementTypeEnum) => {
      switch (spaceElementType) {
        case SpaceElementTypeEnum.DOT:
          this.createDots();
          break;
        case SpaceElementTypeEnum.PATH:
          this.createPaths();
          break;
        case SpaceElementTypeEnum.TEXT:
          this.createTexts();
          break;
      }
    })
  }

  private createPaths() {
    const shape = 'path';
    this.svgg.selectAll(`${shape}.${shape}`)
      .data(this.projectedPaths)
      .enter()
      .append(shape)
      .classed(shape, true)
      .style('stroke', '#666')
      .style('fill', 'none')
      // .style('fill-opacity', 1)
      .style('stroke-opacity', 1)
      .style('stroke-width', 0.5);
  }

  private createDots() {
    const shape = 'circle';
    this.svgg.selectAll(`${shape}.${shape}`)
      .data(this.projectedDots)
      .enter()
      .append(shape)
      .classed(shape, true)
      .style('stroke', '#aaa')
      .style('fill', '#ddd')
      // .style('fill-opacity', 0.5)
      // .style('stroke-opacity', 0.1)
      .style('stroke-width', 1);
  }

  private createTexts() {
    const shape = 'text';
    this.svgg.selectAll(`${shape}.${shape}`)
      .data(this.projectedTexts)
      .enter()
      .append(shape)
      .classed(shape, true)
      .style('stroke', 'none')
      .style('fill', '#999')
      .attr('xml:space', 'preserve')
      // .style('text-anchor', 'middle')
      .style('alignment-baseline', 'central');
  }

  private updateElements() {
    this.drawOrder.forEach((spaceElementType: SpaceElementTypeEnum) => {
      switch (spaceElementType) {
        case SpaceElementTypeEnum.DOT:
          this.updateDots();
          break;
        case SpaceElementTypeEnum.PATH:
          this.updatePaths();
          break;
        case SpaceElementTypeEnum.TEXT:
          this.updateTexts();
          break;
      }
    })
  }

  private updatePaths() {
    const shape = 'path';
    this.svgg.selectAll(`${shape}.${shape}`)
      .data(this.projectedPaths)
      .classed('invisible', (d: StagePoint) => d.dist < 0)
      .attr('d', (d: StagePath) => {
        let p = 'M' + d.pixel[0].left + ' ' + d.pixel[0].top + ' ';
        for (let i = 1; i < d.pixel.length; i++) {
          p += 'L' + d.pixel[i].left + ' ' + d.pixel[i].top + ' ';
        }
        return d.close ? p + 'Z' : p;
      })
  }

  private updateDots() {
    const shape = 'circle';
    this.svgg.selectAll(`${shape}.${shape}`)
      .data(this.projectedDots)
      .classed('invisible', (d: StagePoint) => d.dist < 0)
      .attr('cx', (d: StagePoint) => d.pixel.left)
      .attr('cy', (d: StagePoint) => d.pixel.top)
      .attr('r', (d: StagePoint) => d.dist > 0 ? d.dist * 30 : 0);
      // .style('stroke', (d: Point) => {
      //   let c = Math.round(-255*d.dist+255);
      //   return 'rgb(' + c + ', ' + c + ', ' + c + ')';
      // })
      // .style('fill', (d: Point) => {
      //   let c = Math.round(-150*d.dist+200);
      //   return 'rgb(' + c + ', ' + c + ', ' + c + ')';
      // });
      // .style('fill', (d: Point) => {
      //   if (d.world.x == 0 && d.world.y == 0) {
      //     return 'red';
      //   } else if (d.world.y == 0 && d.world.z == 0) {
      //     return 'blue';
      //   } else if (d.world.z == 0 && d.world.x == 0) {
      //     return 'green';
      //   }
      //   return '#eee';
      // });
  }

  private updateTexts() {
    const shape = 'text';
    this.svgg.selectAll(`${shape}.${shape}`)
      .data(this.projectedTexts)
      .classed('invisible', (d: StagePoint) => d.dist < 0)
      .attr('x', (d: StageText) => d.pixel.left)
      .attr('y', (d: StageText) => d.pixel.top)
      .attr('font-size', (d: StageText) => d.dist > 0 ? d.dist * 120 + 'px' : '0px')
      .text((d: StageText) => d.value);
  }

}
