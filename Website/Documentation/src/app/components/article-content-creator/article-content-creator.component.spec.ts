import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleContentCreatorComponent } from './article-content-creator.component';

describe('ArticleContentCreatorComponent', () => {
  let component: ArticleContentCreatorComponent;
  let fixture: ComponentFixture<ArticleContentCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticleContentCreatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleContentCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
