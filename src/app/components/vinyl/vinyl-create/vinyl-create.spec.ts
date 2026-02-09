import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VinylCreate } from './vinyl-create';

describe('VinylCreate', () => {
  let component: VinylCreate;
  let fixture: ComponentFixture<VinylCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VinylCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VinylCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
