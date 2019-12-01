import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { ShellRouting } from '@app/shell/shell-routing.module';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleSelectedComponent } from './role-selected/role-selected.component';
import { RoleDetailsComponent } from './role-details/role-details.component';
import { RoleNewComponent } from './role-new/role-new.component';
import { RoleEditComponent } from './role-edit/role-edit.component';
import { RoleDeleteComponent } from './role-delete/role-delete.component';

const routes: Routes = [
  ShellRouting.childRoutes([
    {
      path: 'roles',
      component: RoleListComponent,
      children: [
        {
          path: 'selected/:id',
          component: RoleSelectedComponent,
          children: [
            {
              path: 'details',
              component: RoleDetailsComponent
            },
            {
              path: 'edit',
              component: RoleEditComponent
            },
            {
              path: 'delete',
              component: RoleDeleteComponent
            }
          ]
        }
      ]
    },
    {
      path: 'newRole',
      component: RoleNewComponent
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class RolesRoutingModule {}
