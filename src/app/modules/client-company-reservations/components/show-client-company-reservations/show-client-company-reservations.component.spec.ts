import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowClientCompanyReservationsComponent } from './show-client-company-reservations.component';



describe('ShowClientCompanyReservationsComponent', () => {
  let component: ShowClientCompanyReservationsComponent;
  let fixture: ComponentFixture<ShowClientCompanyReservationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowClientCompanyReservationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowClientCompanyReservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
