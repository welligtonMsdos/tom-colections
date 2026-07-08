import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridVinyl } from './grid-vinyl';

describe('GridVinyl', () => {
  let component: GridVinyl;
  let fixture: ComponentFixture<GridVinyl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridVinyl]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridVinyl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
