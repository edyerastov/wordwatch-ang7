import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { GroupRoutingModule } from '@app/groups/group-routing.module';
import { SharedModule } from '@app/shared';

import { GroupService } from '@app/groups/services/group.service';
import { GroupsListComponent } from './groups-list/groups-list.component';
import { GroupSelectedComponent } from './group-selected/group-selected.component';
import { GroupNewComponent } from './group-new/group-new.component';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { GroupRenameComponent } from './group-rename/group-rename.component';
import { GroupEditComponent } from './group-edit/group-edit.component';
import { GroupDeleteComponent } from './group-delete/group-delete.component';
import { DeviceModule } from '@app/devices/device.module';

@NgModule({
  declarations: [
    GroupsListComponent,
    GroupSelectedComponent,
    GroupNewComponent,
    GroupDetailsComponent,
    GroupRenameComponent,
    GroupEditComponent,
    GroupDeleteComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgSelectModule,
    GroupRoutingModule,
    SharedModule,
    DeviceModule
  ],
  exports: [],
  providers: [GroupService]
})
export class GroupModule {}
