import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { UsersListComponent } from './Components/users-list/users-list.component';
import { AddUserComponent } from './Components/add-user/add-user.component';
import { AuthGuard } from './guards/auth.guard';
import { IsLoggedInGuard } from './guards/is-logged-in.guard';
import { HomeComponent } from './Components/home/home.component';

const routes: Routes = [
  {path:'login' , component:LoginComponent , canActivate:[IsLoggedInGuard]},
  {path:'users_list', component:UsersListComponent , canActivate : [AuthGuard]},
  {path:'add_user' , component:AddUserComponent , canActivate : [AuthGuard]},
  {path:'home' , component:HomeComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
