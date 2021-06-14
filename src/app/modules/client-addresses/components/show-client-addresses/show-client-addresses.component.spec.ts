import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowClientAddressesComponent } from './show-client-addresses.component';

describe('ShowClientAddressesComponent', () => {
  let component: ShowClientAddressesComponent;
  let fixture: ComponentFixture<ShowClientAddressesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowClientAddressesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowClientAddressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
