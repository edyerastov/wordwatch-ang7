import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { ShellRouting } from '@app/shell/shell-routing.module';
import { AboutComponent } from './about.component';

const routes: Routes = [
  ShellRouting.childRoutes([{ path: 'about', component: AboutComponent, data: { title: extract('About') } }])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AboutRoutingModule {}
