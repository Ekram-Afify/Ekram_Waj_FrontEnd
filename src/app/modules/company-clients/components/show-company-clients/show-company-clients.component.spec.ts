import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCompanyClientsComponent } from './show-company-clients.component';

describe('ShowCompanyClientsComponent', () => {
  let component: ShowCompanyClientsComponent;
  let fixture: ComponentFixture<ShowCompanyClientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowCompanyClientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowCompanyClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
