import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, Route } from '@angular/router';
import { ShellComponent } from '@app/shell/shell.component';
import { AuthenticationGuard } from '@app/core';

@NgModule({
  declarations: [],
  imports: [CommonModule]
})
export class ShellRouting {
  static childRoutes(routes: Routes): Route {
    return {
      path: '',
      component: ShellComponent,
      children: routes,
      canActivate: [AuthenticationGuard],
      // Reuse ShellComponent instance when navigating between child views
      data: { reuse: true }
    };
  }
}
