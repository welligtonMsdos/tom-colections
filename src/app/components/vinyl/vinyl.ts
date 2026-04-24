import { Component } from '@angular/core';
import { ListVinyl } from './list-vinyl/list-vinyl';
import { CardVinyl } from "./card-vinyl/card-vinyl";
import { HeaderVinyl } from "./header-vinyl/header-vinyl";

@Component({
  selector: 'app-vinyl',
  imports: [ListVinyl, CardVinyl, HeaderVinyl],
  templateUrl: './vinyl.html',
  styleUrl: './vinyl.css',
})
export class Vinyl {

}
