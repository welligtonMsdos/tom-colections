import { Component } from '@angular/core';
import { CardCd } from "./card-cd/card-cd";
import { HeaderCd } from "./header-cd/header-cd";
import { ListCd } from './list-cd/list-cd';

@Component({
  selector: 'app-cd',
  imports: [ListCd, CardCd, HeaderCd],
  templateUrl: './cd.html',
  styleUrl: './cd.css',
})
export class Cd {

}
