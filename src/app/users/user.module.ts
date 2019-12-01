import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { UsersRoutingModule } from '@app/users/user-routing.module';

import { UserService } from '@app/users/services/user.service';
import { SharedModule } from '@app/shared';
import { UserListComponent } from '@app/users/user-list/user-list.component';
import { UserSelectedComponent } from './user-selected/user-selected.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserActiveComponent } from './user-active/user-active.component';
import { UserRoleComponent } from './user-role/user-role.component';
import { UserDevicesComponent } from './user-devices/user-devices.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserNewComponent } from './user-new/user-new.component';
import { DeviceModule } from '@app/devices/device.module';
import { EmailPickerComponent } from '@app/users/directives/email-picker/email-picker.component';
import { UserDevicesPickerComponent } from './directives/user-devices-picker/user-devices-picker.component';

@NgModule({
  declarations: [
    EmailPickerComponent,
    UserListComponent,
    UserSelectedComponent,
    UserDetailsComponent,
    UserActiveComponent,
    UserRoleComponent,
    UserDevicesComponent,
    UserEditComponent,
    UserNewComponent,
    UserDevicesPickerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgSelectModule,
    SharedModule,
    UsersRoutingModule,
    DeviceModule
  ],
  exports: [],
  providers: [UserService]
})
export class UserModule {}
