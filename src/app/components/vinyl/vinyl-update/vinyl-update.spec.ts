import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VinylUpdate } from './vinyl-update';

describe('VinylUpdate', () => {
  let component: VinylUpdate;
  let fixture: ComponentFixture<VinylUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VinylUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VinylUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
