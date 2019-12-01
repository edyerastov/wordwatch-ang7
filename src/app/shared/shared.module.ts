import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { PaginationComponent } from './interactions/pagination/pagination.component';
import { PageSizePickerComponent } from './interactions/page-size-picker/page-size-picker.component';
import { RolePickerComponent } from '@app/shared/role/role-picker/role-picker.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';
import { UserPickerComponent } from '@app/shared/user/user-picker/user-picker.component';
import { LocationPickerComponent } from '@app/storage-locations/directives/location-picker/location-picker.component';
import { DevicePickerComponent } from '@app/devices/directives/device-picker/device-picker.component';
import { GroupPickerComponent } from '@app/groups/directives/group-picker/group-picker.component';

@NgModule({
  imports: [CommonModule, NgSelectModule, ReactiveFormsModule],
  declarations: [
    LoaderComponent,
    PaginationComponent,
    PageSizePickerComponent,
    RolePickerComponent,
    UserPickerComponent,
    LocationPickerComponent,
    DevicePickerComponent,
    GroupPickerComponent
  ],
  exports: [
    LoaderComponent,
    PaginationComponent,
    PageSizePickerComponent,
    RolePickerComponent,
    UserPickerComponent,
    LocationPickerComponent,
    DevicePickerComponent,
    GroupPickerComponent
  ]
})
export class SharedModule {}
