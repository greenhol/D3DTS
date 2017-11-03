import { Component } from '@angular/core';
import { BellCurve } from './data/world/bell-curve';
import { RandomPoints } from './data/world/random-points';
import { CartesianAxes } from './data/world/cartesian-axes';
import { Grid } from './data/world/grid';
import { Cube } from './data/world/cube';

@Component({
  selector: 'd3d-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
private world = new BellCurve();
// private world = new RandomPoints();
// private world = new CartesianAxes();
// private world = new Cube();
// private world = new Grid();

private cameraAngleX: number = Math.PI * 6 / 5 - Math.PI;
private cameraAngleY: number = 0;
private cameraAngleZ: number = 0;
private cameraPosX: number = 0;
private cameraPosY: number = 0;
private cameraPosZ: number = -5;

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
