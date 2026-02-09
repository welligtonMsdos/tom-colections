import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderVinyl } from './header-vinyl';

describe('HeaderVinyl', () => {
  let component: HeaderVinyl;
  let fixture: ComponentFixture<HeaderVinyl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderVinyl]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderVinyl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
