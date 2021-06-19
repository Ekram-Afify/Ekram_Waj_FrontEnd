import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReservationOfferPriceComponent } from './reservation-offer-price.component';


describe('ReservationOfferPriceComponent', () => {
  let component: ReservationOfferPriceComponent;
  let fixture: ComponentFixture<ReservationOfferPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservationOfferPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationOfferPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
