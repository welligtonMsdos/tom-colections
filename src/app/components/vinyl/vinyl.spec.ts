import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vinyl } from './vinyl';

describe('Vinyl', () => {
  let component: Vinyl;
  let fixture: ComponentFixture<Vinyl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vinyl]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vinyl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
