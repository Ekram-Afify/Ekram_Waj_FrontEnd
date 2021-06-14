import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCompanyClientComponent } from './create-company-client.component';

describe('CreateCompanyClientComponent', () => {
  let component: CreateCompanyClientComponent;
  let fixture: ComponentFixture<CreateCompanyClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCompanyClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCompanyClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
