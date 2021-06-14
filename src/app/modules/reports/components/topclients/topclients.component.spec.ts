import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopclientsComponent } from './topclients.component';

describe('TopclientsComponent', () => {
  let component: TopclientsComponent;
  let fixture: ComponentFixture<TopclientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopclientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopclientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
