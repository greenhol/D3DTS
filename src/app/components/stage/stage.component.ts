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

interface StagePoint extends SpaceDot {
  pixel: PixelCoord;
  dist: number;
}

interface StagePath extends SpacePath {
  pixel: PixelCoord[];
  dist: number;
}

interface StageText extends SpaceText {
  pixel: PixelCoord;
  dist: number;
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

  private currentWorld: World;
  private projectedDots: StagePoint[] = [];
  private projectedPaths: StagePath[] = [];
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
      this.currentWorld = undefined;
      this.flushElements();
      this.flushAnimation();
      return;
    }

    this.flushElements();    
    this.flushAnimation();
    
    this.currentWorld = world;
    this.drawOrder = world.drawOrder;

    this.rxMatrix.angle = world.cameraStartPosition.angleX;
    this.ryMatrix.angle = world.cameraStartPosition.angleY;
    this.rzMatrix.angle = world.cameraStartPosition.angleZ;
    this.tMatrix.vector = world.cameraStartPosition.position;

    this.createData();
    this.createElements();
    this.updateElements();

    if (world.hasAnimation) {
      this.startAnimation();
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
    this.projectedDots = this.currentWorld.dots.map((point: SpaceDot): StagePoint => {
      let v = myMatrix.vectorMultiply(point.coord);
      return {
          coord: point.coord,
          pixel: StageComponent.spaceToPixel(v),
          dist: StageComponent.distanceToCamera(v)
      }
    });
    this.projectedDots.sort((a: StagePoint, b: StagePoint) => a.dist - b.dist);

    // Paths
    this.projectedPaths = this.currentWorld.paths.map((path: SpacePath): StagePath => {
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
          coord: path.coord,
          close: path.close,
          pixel: pixel,
          dist: (dist < 0) ? -1 : 1
      }
    });

    // Texts
    this.projectedTexts = this.currentWorld.texts.map((text: SpaceText): StageText => {
      let v = myMatrix.vectorMultiply(text.coord);
      return {
          coord: text.coord,
          value: text.value,
          pixel: StageComponent.spaceToPixel(v),
          dist: StageComponent.distanceToCamera(v)
      }
    });
    this.projectedTexts.sort((a: StageText, b: StageText) => a.dist - b.dist);
  }

  private flushAnimation() {
    clearInterval(this.timer);
  }

  private startAnimation() {
    let t = 0;
    this.timer = setInterval(() => {
      t++;
      if (this.currentWorld.animateCoord) {
        this.currentWorld.animateCoord(t);
      }
      if (this.currentWorld.animateCameraRotationX) {
        this.rxMatrix.angle = this.currentWorld.animateCameraRotationX(t);
      }
      if (this.currentWorld.animateCameraRotationY) {
        this.ryMatrix.angle = this.currentWorld.animateCameraRotationY(t);
      }
      if (this.currentWorld.animateCameraRotationZ) {
        this.rzMatrix.angle = this.currentWorld.animateCameraRotationZ(t);
      }
      if (this.currentWorld.animateCameraPositionX) {
        this.tMatrix.x = this.currentWorld.animateCameraPositionX(t);
      }
      if (this.currentWorld.animateCameraPositionY) {
        this.tMatrix.y = this.currentWorld.animateCameraPositionY(t);
      }
      if (this.currentWorld.animateCameraPositionZ) {
        this.tMatrix.z = this.currentWorld.animateCameraPositionZ(t);
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

  private createDots() {
    const shape = 'circle';
    this.svgg.selectAll(`${shape}.${shape}`)
      .data(this.projectedDots)
      .enter()
      .append(shape)
      .classed(shape, true)
      .style('stroke-width', this.currentWorld.dotsStyle.shape.strokeWidth)
      .style('stroke', this.currentWorld.dotsStyle.shape.stroke)
      .style('stroke-opacity', this.currentWorld.dotsStyle.shape.strokeOpacity)      
      .style('fill', this.currentWorld.dotsStyle.shape.fill)
      .style('fill-opacity', this.currentWorld.dotsStyle.shape.fillOpacity);
  }

  private createPaths() {
    const shape = 'path';
    this.svgg.selectAll(`${shape}.${shape}`)
      .data(this.projectedPaths)
      .enter()
      .append(shape)
      .classed(shape, true)
      .style('stroke-width', this.currentWorld.pathsStyle.shape.strokeWidth)
      .style('stroke', this.currentWorld.pathsStyle.shape.stroke)
      .style('stroke-opacity', this.currentWorld.pathsStyle.shape.strokeOpacity)      
      .style('fill', (d: StagePath) => d.close ? this.currentWorld.pathsStyle.shape.fill: 'none')
      .style('fill-opacity', (d: StagePath) => d.close ? this.currentWorld.pathsStyle.shape.fillOpacity : 0);
  }

  private createTexts() {
    const shape = 'text';
    this.svgg.selectAll(`${shape}.${shape}`)
      .data(this.projectedTexts)
      .enter()
      .append(shape)
      .classed(shape, true)
      .attr('xml:space', 'preserve')      
      .style('stroke-width', this.currentWorld.textsStyle.shape.strokeWidth)
      .style('stroke', this.currentWorld.textsStyle.shape.stroke)
      .style('stroke-opacity', this.currentWorld.textsStyle.shape.strokeOpacity)      
      .style('fill', this.currentWorld.textsStyle.shape.fill)
      .style('fill-opacity', this.currentWorld.textsStyle.shape.fillOpacity)
      // .style('text-anchor', 'middle')
      .style('alignment-baseline', this.currentWorld.textsStyle.alignmentBaseline);
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

  private updateDots() {
    const shape = 'circle';
    this.svgg.selectAll(`${shape}.${shape}`)
      .data(this.projectedDots)
      .classed('invisible', (d: StagePoint) => d.dist < 0)
      .attr('cx', (d: StagePoint) => d.pixel.left)
      .attr('cy', (d: StagePoint) => d.pixel.top)
      .attr('r', (d: StagePoint) => d.dist > 0 ? d.dist * 30 * this.currentWorld.dotsStyle.scale : 0);
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

  private updateTexts() {
    const shape = 'text';
    this.svgg.selectAll(`${shape}.${shape}`)
      .data(this.projectedTexts)
      .classed('invisible', (d: StagePoint) => d.dist < 0)
      .attr('x', (d: StageText) => d.pixel.left)
      .attr('y', (d: StageText) => d.pixel.top)
      .attr('font-size', (d: StageText) => d.dist > 0 ? d.dist * 100 * this.currentWorld.textsStyle.scale + 'px' : '0px')
      .text((d: StageText) => d.value);
  }

}
