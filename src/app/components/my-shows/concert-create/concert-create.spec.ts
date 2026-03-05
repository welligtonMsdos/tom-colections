import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcertCreate } from './concert-create';

describe('ConcertCreate', () => {
  let component: ConcertCreate;
  let fixture: ComponentFixture<ConcertCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConcertCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConcertCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
