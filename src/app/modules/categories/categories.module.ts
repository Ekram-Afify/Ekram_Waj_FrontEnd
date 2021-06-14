import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';
import { ShowCategoriesComponent } from './components/show-categories/show-categories.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '@shared/shared.module';
import { CreateCategoryComponent } from './components/create-category/create-category.component';
import { UpdateCategoryComponent } from './components/update-category/update-category.component';
import { DetailsComponent } from './components/details/details.component';


@NgModule({
  declarations: [ShowCategoriesComponent, CreateCategoryComponent, UpdateCategoryComponent, DetailsComponent],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    HttpClientModule,
    SharedModule,
  ]
})
export class CategoriesModule { }
