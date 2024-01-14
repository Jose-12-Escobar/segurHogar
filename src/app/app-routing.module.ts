import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TarifaComponent } from './pages/tarifa/tarifa.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { loginGuard } from './guards/login.guard';
import { isAdminGuard } from './guards/isAdmin.guard';
import { isClientGuard } from './guards/isClient.guard';

const app_routes: Routes = [
  { path: 'auth',  loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
  { path: 'admin', canActivate: [loginGuard, isAdminGuard], loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule) },
  { path: 'client', canActivate: [loginGuard, isClientGuard], loadChildren: () => import('./modules/client/client.module').then(m => m.ClientModule) },
  { path: 'home', component: HomeComponent },
  { path: 'tarifas', component: TarifaComponent },
  { path: 'notFound', component: NotFoundComponent },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: '**', pathMatch: 'full', redirectTo: 'notFound' },
]
@NgModule({
  imports: [RouterModule.forRoot(app_routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
