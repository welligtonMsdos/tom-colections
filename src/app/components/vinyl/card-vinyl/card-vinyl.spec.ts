import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardVinyl } from './card-vinyl';

describe('CardVinyl', () => {
  let component: CardVinyl;
  let fixture: ComponentFixture<CardVinyl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardVinyl]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardVinyl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
