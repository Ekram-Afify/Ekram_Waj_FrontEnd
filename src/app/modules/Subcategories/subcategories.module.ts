import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubcategoriesRoutingModule } from './subcategories-routing.module';
import { ShowSubcategoriesComponent } from './Components/show-subcategories/show-subcategories.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '@shared/shared.module';
import { CreateSubCategoryComponent } from './Components/create-sub-category/create-sub-category.component';
import { DetailsComponent } from './Components/details/details.component';
import { UpdateSubcategoryComponent } from './Components/update-subcategory/update-subcategory.component';


@NgModule({
  declarations: [ShowSubcategoriesComponent, CreateSubCategoryComponent, DetailsComponent,UpdateSubcategoryComponent],
  imports: [
    CommonModule,
    SubcategoriesRoutingModule,
    HttpClientModule,
    SharedModule,
  ]
})
export class SubcategoriesModule { }
