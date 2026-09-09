import { Component } from '@angular/core';
import { CardVinyl } from "./card-vinyl/card-vinyl";
import { HeaderVinyl } from "./header-vinyl/header-vinyl";
import { ListVinyl } from './list-vinyl/list-vinyl';

@Component({
  selector: 'app-vinyl',
  imports: [ListVinyl, CardVinyl, HeaderVinyl],
  templateUrl: './vinyl.html',
  styleUrl: './vinyl.css',
})
export class Vinyl {

}
