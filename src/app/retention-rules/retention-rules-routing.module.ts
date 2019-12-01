import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShellRouting } from '@app/shell/shell-routing.module';
import { RetentionListComponent } from '@app/retention-rules/retention-list/retention-list.component';
import { RetentionNewComponent } from '@app/retention-rules/retention-new/retention-new.component';
import { RetentionSelectedComponent } from '@app/retention-rules/retention-selected/retention-selected.component';
import { RetentionDetailsComponent } from '@app/retention-rules/retention-details/retention-details.component';
import { RetentionEditComponent } from '@app/retention-rules/retention-edit/retention-edit.component';
import { RetentionTargetsComponent } from '@app/retention-rules/retention-targets/retention-targets.component';
import { RetentionEnableComponent } from '@app/retention-rules/retention-enable/retention-enable.component';
import { RetentionDeleteComponent } from '@app/retention-rules/retention-delete/retention-delete.component';

const routes: Routes = [
  ShellRouting.childRoutes([
    {
      path: 'retention',
      component: RetentionListComponent,
      children: [
        {
          path: 'selected/:id',
          component: RetentionSelectedComponent,
          children: [
            {
              path: 'details',
              component: RetentionDetailsComponent
            },
            {
              path: 'edit',
              component: RetentionEditComponent
            },
            {
              path: 'edit-targets',
              component: RetentionTargetsComponent
            },
            {
              path: 'enable',
              component: RetentionEnableComponent
            },
            {
              path: 'delete',
              component: RetentionDeleteComponent
            }
          ]
        }
      ]
    },
    {
      path: 'newRetentionRule',
      component: RetentionNewComponent
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class RetentionRulesRoutingModule {}
