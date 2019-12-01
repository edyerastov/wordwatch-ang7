import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShellRouting } from '@app/shell/shell-routing.module';

import { UserListComponent } from '@app/users/user-list/user-list.component';
import { UserSelectedComponent } from '@app/users/user-selected/user-selected.component';
import { UserDetailsComponent } from '@app/users/user-details/user-details.component';
import { UserActiveComponent } from '@app/users/user-active/user-active.component';
import { UserRoleComponent } from '@app/users/user-role/user-role.component';
import { UserDevicesComponent } from '@app/users/user-devices/user-devices.component';
import { UserEditComponent } from '@app/users/user-edit/user-edit.component';
import { UserNewComponent } from '@app/users/user-new/user-new.component';

const routes: Routes = [
  ShellRouting.childRoutes([
    {
      path: 'users',
      component: UserListComponent,
      children: [
        {
          path: 'selected/:id',
          component: UserSelectedComponent,
          children: [
            {
              path: 'edit',
              component: UserEditComponent
            },
            {
              path: 'details',
              component: UserDetailsComponent
            },
            {
              path: 'active',
              component: UserActiveComponent
            },
            {
              path: 'role',
              component: UserRoleComponent
            },
            {
              path: 'devices',
              component: UserDevicesComponent
            }
          ]
        }
      ]
    },
    {
      path: 'newUser',
      component: UserNewComponent
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class UsersRoutingModule {}
