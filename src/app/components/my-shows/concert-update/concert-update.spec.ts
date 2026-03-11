import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcertUpdate } from './concert-update';

describe('ConcertUpdate', () => {
  let component: ConcertUpdate;
  let fixture: ComponentFixture<ConcertUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConcertUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConcertUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
