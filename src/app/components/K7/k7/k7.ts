import { Component } from '@angular/core';
import { CardK7 } from "../card-k7/card-k7";
import { HeaderK7 } from '../header-k7/header-k7';
import { GridK7 } from '../grid-k7/grid-k7';

@Component({
  selector: 'app-k7',
  imports: [CardK7, HeaderK7, GridK7],
  templateUrl: './k7.html',
  styleUrl: './k7.css',
})
export class K7 {

}
