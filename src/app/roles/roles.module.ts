import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { RolesRoutingModule } from './roles-routing.module';
import { SharedModule } from '@app/shared';
import { ClickOutsideModule } from 'ng-click-outside';
import { DeviceModule } from '@app/devices/device.module';
import { GroupModule } from '@app/groups/group.module';
import { UserModule } from '@app/users/user.module';

import { RoleListComponent } from './role-list/role-list.component';
import { RoleDetailsComponent } from './role-details/role-details.component';
import { SearchProfileSelectComponent } from './directives/search-profile-select/search-profile-select.component';
import { RoleNewComponent } from './role-new/role-new.component';
import { RoleEditComponent } from './role-edit/role-edit.component';
import { RoleDeleteComponent } from './role-delete/role-delete.component';
import { SearchProfilePickerComponent } from './directives/search-profile-picker/search-profile-picker.component';
import { PermissionPickerComponent } from './directives/permission-picker/permission-picker.component';
import { RoleSelectedComponent } from './role-selected/role-selected.component';
import { RoleService } from './services/role.service';
import { HttpClientModule } from '@angular/common/http';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    RolesRoutingModule,
    NgSelectModule,
    SharedModule,
    ReactiveFormsModule,
    HttpClientModule,
    DeviceModule,
    GroupModule,
    UserModule,
    ClickOutsideModule,
    NgbTabsetModule
  ],
  declarations: [
    RoleListComponent,
    RoleDetailsComponent,
    SearchProfileSelectComponent,
    RoleNewComponent,
    RoleEditComponent,
    RoleDeleteComponent,
    SearchProfilePickerComponent,
    PermissionPickerComponent,
    RoleSelectedComponent
  ],
  providers: [
    RoleService,
    {
      provide: 'state',
      useValue: () => {
        return {
          id: 1,
          name: 'Some Contact',
          website: 'http://some.website.com'
        };
      }
    }
  ]
})
export class RolesModule {}
