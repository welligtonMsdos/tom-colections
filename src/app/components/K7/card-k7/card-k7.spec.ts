import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardK7 } from './card-k7';

describe('CardK7', () => {
  let component: CardK7;
  let fixture: ComponentFixture<CardK7>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardK7]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardK7);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
