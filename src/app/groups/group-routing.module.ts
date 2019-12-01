import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellRouting } from '@app/shell/shell-routing.module';
import { GroupsListComponent } from '@app/groups/groups-list/groups-list.component';
import { GroupSelectedComponent } from '@app/groups/group-selected/group-selected.component';
import { GroupDetailsComponent } from '@app/groups/group-details/group-details.component';
import { GroupNewComponent } from '@app/groups/group-new/group-new.component';
import { GroupRenameComponent } from '@app/groups/group-rename/group-rename.component';
import { GroupEditComponent } from '@app/groups/group-edit/group-edit.component';
import { GroupDeleteComponent } from '@app/groups/group-delete/group-delete.component';

const routes: Routes = [
  ShellRouting.childRoutes([
    {
      path: 'groups',
      component: GroupsListComponent,
      children: [
        {
          path: 'selected/:id',
          component: GroupSelectedComponent,
          children: [
            {
              path: 'details',
              component: GroupDetailsComponent
            },
            {
              path: 'rename',
              component: GroupRenameComponent
            },
            {
              path: 'edit',
              component: GroupEditComponent
            },
            {
              path: 'delete',
              component: GroupDeleteComponent
            }
          ]
        }
      ]
    },
    {
      path: 'newGroup',
      component: GroupNewComponent
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class GroupRoutingModule {}
