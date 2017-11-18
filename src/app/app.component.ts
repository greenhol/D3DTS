import { Component } from '@angular/core';
import { BellCurve } from './data/world/bell-curve';
import { RandomPoints } from './data/world/random-points';
import { CartesianAxes } from './data/world/cartesian-axes';
import { Grid } from './data/world/grid';
import { Cube } from './data/world/cube';
import { BouncingParticles } from './data/world/bouncing-particles';
import { CubeMesh } from './data/world/cube-mesh';

@Component({
  selector: 'd3d-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
// public world = new BellCurve();
// public world = new RandomPoints();
// public world = new CartesianAxes();
// public world = new Cube();
// public world = new Grid();
// public world = new BouncingParticles();
public world = new CubeMesh();

public cameraAngleX: number = Math.PI * 6 / 5 - Math.PI;
public cameraAngleY: number = 0;
public cameraAngleZ: number = 0;
public cameraPosX: number = 0;
public cameraPosY: number = 0;
public cameraPosZ: number = -5;

  public changeAngleX(event) {
    this.cameraAngleX = Math.PI * event / 50 - Math.PI;
  }
  
  public changeAngleY(event) {
    this.cameraAngleY = Math.PI * event / 50 - Math.PI;
  }

  public changeAngleZ(event) {
    this.cameraAngleZ = Math.PI * event / 50 - Math.PI;
  }

  public changePosX(event) {
    this.cameraPosX = event / 10 - 5;
  }

  public changePosY(event) {
    this.cameraPosY = event / 10 - 5;
  }

  public changePosZ(event) {
    this.cameraPosZ = -event / 10;
  }
}
