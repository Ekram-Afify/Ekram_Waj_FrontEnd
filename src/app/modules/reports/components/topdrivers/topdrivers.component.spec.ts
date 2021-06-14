import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopdriversComponent } from './topdrivers.component';

describe('TopdriversComponent', () => {
  let component: TopdriversComponent;
  let fixture: ComponentFixture<TopdriversComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopdriversComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopdriversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
