import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellRouting } from '@app/shell/shell-routing.module';
import { DevicesListComponent } from '@app/devices/devices-list/devices-list.component';
import { DeviceSelectedComponent } from '@app/devices/device-selected/device-selected.component';
import { DeviceDetailsComponent } from '@app/devices/device-details/device-details.component';
import { DeviceRenameComponent } from '@app/devices/device-rename/device-rename.component';
import { DeviceDeleteComponent } from '@app/devices/device-delete/device-delete.component';
import { DeviceUserComponent } from '@app/devices/device-user/device-user.component';
import { DeviceNewComponent } from '@app/devices/device-new/device-new.component';

const routes: Routes = [
  ShellRouting.childRoutes([
    {
      path: 'devices',
      component: DevicesListComponent,
      children: [
        {
          path: 'selected/:id',
          component: DeviceSelectedComponent,
          children: [
            {
              path: 'details',
              component: DeviceDetailsComponent
            },
            {
              path: 'rename',
              component: DeviceRenameComponent
            },
            {
              path: 'delete',
              component: DeviceDeleteComponent
            },
            {
              path: 'user',
              component: DeviceUserComponent
            }
          ]
        }
      ]
    },
    {
      path: 'newDevice',
      component: DeviceNewComponent
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class DeviceRoutingModule {}
