import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShellRouting } from '@app/shell/shell-routing.module';
import { StorageRulesListComponent } from './storage-rules-list/storage-rules-list.component';
import { StorageRuleNewComponent } from './storage-rule-new/storage-rule-new.component';
import { StorageRuleRenameComponent } from '@app/storage-rules/storage-rule-rename/storage-rule-rename.component';
import { StorageRuleEditTargetsComponent } from '@app/storage-rules/storage-rule-edit-targets/storage-rule-edit-targets.component';
import { StorageRuleSelectedComponent } from '@app/storage-rules/storage-rule-selected/storage-rule-selected.component';
import { StorageRuleEditLocationsComponent } from '@app/storage-rules/storage-rule-edit-locations/storage-rule-edit-locations.component';
import { StorageRuleDetailsComponent } from '@app/storage-rules/storage-rule-details/storage-rule-details.component';
import { StorageRuleEnableComponent } from '@app/storage-rules/storage-rule-enable/storage-rule-enable.component';
import { StorageRuleDeleteComponent } from '@app/storage-rules/storage-rule-delete/storage-rule-delete.component';

const routes: Routes = [
  ShellRouting.childRoutes([
    {
      path: 'storage',
      component: StorageRulesListComponent,
      children: [
        {
          path: 'selected/:id',
          component: StorageRuleSelectedComponent,
          children: [
            {
              path: 'details',
              component: StorageRuleDetailsComponent
            },
            {
              path: 'edit-targets',
              component: StorageRuleEditTargetsComponent
            },
            {
              path: 'rename',
              component: StorageRuleRenameComponent
            },
            {
              path: 'edit-locations',
              component: StorageRuleEditLocationsComponent
            },
            {
              path: 'enable',
              component: StorageRuleEnableComponent
            },
            {
              path: 'delete',
              component: StorageRuleDeleteComponent
            }
          ]
        }
      ]
    },
    {
      path: 'newStorageRule',
      component: StorageRuleNewComponent
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class StorageRulesRoutingModule {}
