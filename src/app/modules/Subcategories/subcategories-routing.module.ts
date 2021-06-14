import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShowSubcategoriesComponent } from './Components/show-subcategories/show-subcategories.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { CreateSubCategoryComponent } from './Components/create-sub-category/create-sub-category.component';
import { UpdateSubcategoryComponent } from './Components/update-subcategory/update-subcategory.component';
import { DetailsComponent } from './Components/details/details.component';



const routes: Routes = [
  { path: "create", component: CreateSubCategoryComponent, canActivate: [AppRouteGuard] },
  { path: "details/:id", component: DetailsComponent, canActivate: [AppRouteGuard] },
  { path: "", component: ShowSubcategoriesComponent, canActivate: [AppRouteGuard] },
   { path: "UpdateSubCategory/:id", component: UpdateSubcategoryComponent, canActivate: [AppRouteGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubcategoriesRoutingModule { }
