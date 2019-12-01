import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';

import { DeviceService } from '@app/devices/services/device.service';
import { DevicesListComponent } from './devices-list/devices-list.component';
import { DeviceRoutingModule } from '@app/devices/device-routing.module';
import { SharedModule } from '@app/shared';
import { DeviceSelectedComponent } from './device-selected/device-selected.component';
import { DeviceDetailsComponent } from './device-details/device-details.component';
import { DeviceRenameComponent } from './device-rename/device-rename.component';
import { DeviceDeleteComponent } from './device-delete/device-delete.component';
import { DeviceUserComponent } from './device-user/device-user.component';
import { DeviceNewComponent } from './device-new/device-new.component';

@NgModule({
  declarations: [
    DevicesListComponent,
    DeviceSelectedComponent,
    DeviceDetailsComponent,
    DeviceRenameComponent,
    DeviceDeleteComponent,
    DeviceUserComponent,
    DeviceNewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgSelectModule,
    DeviceRoutingModule,
    SharedModule
  ],
  exports: [],
  providers: [DeviceService]
})
export class DeviceModule {}
