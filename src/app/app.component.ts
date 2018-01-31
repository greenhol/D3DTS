import { Component, ApplicationRef, ViewChild } from '@angular/core';
import { BellCurve } from './data/world/bell-curve';
import { HilbertCurve } from './data/world/hilbert-curve';
import { RandomPoints } from './data/world/random-points';
import { CartesianAxes } from './data/world/cartesian-axes';
import { Grid } from './data/world/grid';
import { Cube } from './data/world/cube';
import { BouncingParticles } from './data/world/bouncing-particles';
import { CubeMesh } from './data/world/cube-mesh';
import { Text } from './data/world/text';
import { World } from 'app/data/world/world';
import { StageComponent } from 'app/components/stage/stage.component';
import { Chart2D } from 'app/data/world/chart2D';
import { Chart3DLifeTable } from './data/world/chart3DLifeTable';

interface WorldSelector {
  displayName: string;
  world: World;
}

@Component({
  selector: 'd3d-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  public worlds: WorldSelector[] = [
    {displayName: 'Cartesian Axes', world: new CartesianAxes()},
    {displayName: 'Bell Curve', world: new BellCurve()},
    {displayName: 'Random Points', world: new RandomPoints()},
    {displayName: 'Cube', world: new Cube()},
    {displayName: 'Grid', world: new Grid()},
    {displayName: 'Bouncing Particles', world: new BouncingParticles()},
    {displayName: 'CubeMesh', world: new CubeMesh()},
    {displayName: 'Text', world: new Text()},
    {displayName: 'Hilbert Curve', world: new HilbertCurve()},
    {displayName: 'Chart 2D', world: new Chart2D()},
    {displayName: 'Chart 3D Life Table', world: new Chart3DLifeTable()},
  ];
  public worldSelector: WorldSelector = this.worlds[0];
  public world: World;

  public cameraAngleX: number = 0;
  public cameraAngleY: number = 0;
  public cameraAngleZ: number = 0;
  public cameraPosX: number = 0;
  public cameraPosY: number = 0;
  public cameraPosZ: number = 0;

  @ViewChild(StageComponent) private stage: StageComponent;

  constructor(private appRef: ApplicationRef) {
    this.onDropDownChange(this.worlds[0]);
  }

  public onDropDownChange(event: WorldSelector) {
    this.world = event.world;
    this.world.init();
    this.cameraAngleX = this.world.cameraStartPosition.angleX;
    this.cameraAngleY = this.world.cameraStartPosition.angleY;
    this.cameraAngleZ = this.world.cameraStartPosition.angleZ;
    this.cameraPosX = this.world.cameraStartPosition.position.x;
    this.cameraPosY = this.world.cameraStartPosition.position.y;
    this.cameraPosZ = this.world.cameraStartPosition.position.z;
  }

  public onResetClick(): void {
    this.onDropDownChange(this.worldSelector);
    this.stage.injectWorld(this.world);
  }

}
