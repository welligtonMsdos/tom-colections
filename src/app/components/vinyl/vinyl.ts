import { Component } from '@angular/core';
import { CardVinyl } from "./card-vinyl/card-vinyl";
import { HeaderVinyl } from "./header-vinyl/header-vinyl";
import { GridVinyl } from './grid-vinyl/grid-vinyl';

@Component({
  selector: 'app-vinyl',
  imports: [GridVinyl, CardVinyl, HeaderVinyl],
  templateUrl: './vinyl.html',
  styleUrl: './vinyl.css',
})
export class Vinyl {

}
