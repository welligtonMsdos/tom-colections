import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridK7 } from './grid-k7';

describe('GridK7', () => {
  let component: GridK7;
  let fixture: ComponentFixture<GridK7>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridK7]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridK7);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
