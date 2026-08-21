import { ComponentFixture, TestBed } from '@angular/core/testing';

import { K7 } from './k7';

describe('K7', () => {
  let component: K7;
  let fixture: ComponentFixture<K7>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [K7]
    })
    .compileComponents();

    fixture = TestBed.createComponent(K7);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
