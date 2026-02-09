import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListVinyl } from './list-vinyl';

describe('ListVinyl', () => {
  let component: ListVinyl;
  let fixture: ComponentFixture<ListVinyl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListVinyl]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListVinyl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
