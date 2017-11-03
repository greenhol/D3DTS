import { Component, ElementRef, ViewEncapsulation, Input } from '@angular/core';
import { D3Service, D3, Selection } from 'd3-ng2-service';
import { SpaceCoord, World } from './../../data/world/world';
import { Matrix, IdentityMatrix, RotaryMatrix, TranslateMatrix, AxisEnum } from './../../data/matrix/matrix';

interface PlaneCoord {
  x: number;
  y: number;
  dist: number;
}

interface PixelCoord {
  left: number;
  top: number;
  dist: number;
}

interface Point {
  world: SpaceCoord,
  pixel: PixelCoord
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
const STAGE_FAR = 20;

@Component({
  selector: 'd3d-stage',
  template: ``,
  styleUrls: ['./stage.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StageComponent {

  @Input() public set world(world: World) {
    
    this.worldPoints = world.coord;
    this.rxMatrix.angle = world.cameraStartPosition.angleX;
    this.ryMatrix.angle = world.cameraStartPosition.angleY;
    this.rzMatrix.angle = world.cameraStartPosition.angleZ;
    this.tMatrix.vector = world.cameraStartPosition.position;

    this.createData();
    this.createPoints();
    this.updatePoints();

    if (world.hasAnimation) {
      let t = 0;
      setInterval(() => {
        t++;
        if (world.animateCoord) {
          world.animateCoord(t);
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
        this.worldPoints = world.coord;
        this.transform();
      }, 40);
    }
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
  
  private worldPoints: SpaceCoord[];
  private data: Point[] = [];

  private static spaceToPlane(coord: SpaceCoord): PlaneCoord {
    if (coord.z < STAGE_NEAR) {
      return {
        x: 0,
        y: 0,
        dist: -1
      }
    }

    let lambda = 1/coord.z;
    let dist = (STAGE_NEAR*(STAGE_FAR-coord.z))/(coord.z*(STAGE_FAR-STAGE_NEAR));

    return {
      x: lambda * coord.x,
      y: lambda * coord.y,
      dist: dist
    }
  }

  private static planeToPixel(coord: PlaneCoord): PixelCoord {
    return {
      left: STAGE_WIDTH_HALF * coord.x * STAGE_RATIO_INVERTED + STAGE_WIDTH_HALF,
      top: -STAGE_HEIGHT_HALF * coord.y + STAGE_HEIGHT_HALF,
      dist: coord.dist
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

  private transform() {
    this.createData();
    this.updatePoints();    
  }

  private createData() {

    let myMatrix = new IdentityMatrix();
    myMatrix = Matrix.multiply(myMatrix, this.rzMatrix);
    myMatrix = Matrix.multiply(myMatrix, this.ryMatrix);
    myMatrix = Matrix.multiply(myMatrix, this.rxMatrix);    
    myMatrix = Matrix.multiply(myMatrix, this.tMatrix);        
    myMatrix = myMatrix.inv;

    this.data = this.worldPoints.map((point: SpaceCoord) => {
      let v = myMatrix.vectorMultiply(point);
      return {
          world: point,
          pixel: StageComponent.spaceToPixel(v)
      }
    });

    this.data.sort((a: Point, b: Point) => a.pixel.dist - b.pixel.dist);
  }

  private createPoints() {

    this.svgg.selectAll('*').remove();

    let shape = 'circle';
    this.svgg.selectAll(`${shape}.${shape}`)
      .data(this.data)
      .enter()
      .append(shape)
      .classed(shape, true)
      .style('stroke', '#aaa')
      .style('fill', '#ddd')
      // .style('fill-opacity', 0.5)
      // .style('stroke-opacity', 0.1)
      .style('stroke-width', 1);
  }

  private updatePoints() {
    let shape = 'circle';
    this.svgg.selectAll(`${shape}.${shape}`)
      .data(this.data)
      .classed('invisible', (d: Point) => d.pixel.dist < 0)
      .attr('cx', (d: Point) => d.pixel.left)
      .attr('cy', (d: Point) => d.pixel.top)
      .attr('r', (d: Point) => d.pixel.dist > 0 ? d.pixel.dist * 15 : 0);
      // .style('stroke', (d: Point) => {
      //   let c = Math.round(-255*d.pixel.dist+255);
      //   return 'rgb(' + c + ', ' + c + ', ' + c + ')';
      // })
      // .style('fill', (d: Point) => {
      //   let c = Math.round(-150*d.pixel.dist+200);
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

}
