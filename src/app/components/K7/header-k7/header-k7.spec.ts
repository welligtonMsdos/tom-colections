import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderK7 } from './header-k7';

describe('HeaderK7', () => {
  let component: HeaderK7;
  let fixture: ComponentFixture<HeaderK7>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderK7]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderK7);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
