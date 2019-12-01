import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RetentionListComponent } from './retention-list/retention-list.component';
import { RetentionSelectedComponent } from './retention-selected/retention-selected.component';
import { RetentionDetailsComponent } from './retention-details/retention-details.component';
import { RetentionNewComponent } from './retention-new/retention-new.component';
import { RetentionEditComponent } from './retention-edit/retention-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RetentionRulesRoutingModule } from '@app/retention-rules/retention-rules-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '@app/shared';
import { HttpClientModule } from '@angular/common/http';
import { ClickOutsideModule } from 'ng-click-outside';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { RetentionService } from '@app/retention-rules/services/retention.service';
import { RetentionTargetsComponent } from './retention-targets/retention-targets.component';
import { RetentionEnableComponent } from './retention-enable/retention-enable.component';
import { RetentionDeleteComponent } from './retention-delete/retention-delete.component';
import { RetentionPickerComponent } from './directives/retention-picker/retention-picker.component';

@NgModule({
  declarations: [
    RetentionListComponent,
    RetentionSelectedComponent,
    RetentionDetailsComponent,
    RetentionNewComponent,
    RetentionEditComponent,
    RetentionTargetsComponent,
    RetentionEnableComponent,
    RetentionDeleteComponent,
    RetentionPickerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    RetentionRulesRoutingModule,
    NgSelectModule,
    SharedModule,
    ReactiveFormsModule,
    HttpClientModule,
    ClickOutsideModule,
    NgbTabsetModule
  ],
  providers: [RetentionService]
})
export class RetentionRulesModule {}
