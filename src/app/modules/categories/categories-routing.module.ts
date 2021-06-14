import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShowCategoriesComponent } from './components/show-categories/show-categories.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { CreateCategoryComponent } from './components/create-category/create-category.component';
import { UpdateCategoryComponent } from './components/update-category/update-category.component';
import { DetailsComponent } from './components/details/details.component';



const routes: Routes = [
  { path: "create", component: CreateCategoryComponent, canActivate: [AppRouteGuard] },
  { path: "details/:id", component: DetailsComponent, canActivate: [AppRouteGuard] },
  { path: "", component: ShowCategoriesComponent, canActivate: [AppRouteGuard] },
   { path: "UpdateCategory/:id", component: UpdateCategoryComponent, canActivate: [AppRouteGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }
