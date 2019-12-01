import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '@app/shared';
import { ClickOutsideModule } from 'ng-click-outside';
import { HttpClientModule } from '@angular/common/http';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { StorageRulesRoutingModule } from './storage-rules-routing.module';
import { StorageRulesListComponent } from './storage-rules-list/storage-rules-list.component';
import { StorageRulesService } from './services/storage-rules.service';
import { StorageRuleNewComponent } from './storage-rule-new/storage-rule-new.component';
import { StorageRuleRenameComponent } from './storage-rule-rename/storage-rule-rename.component';
import { StorageRuleEditTargetsComponent } from './storage-rule-edit-targets/storage-rule-edit-targets.component';
import { StorageRuleEnableComponent } from './storage-rule-enable/storage-rule-enable.component';
import { StorageRuleDeleteComponent } from './storage-rule-delete/storage-rule-delete.component';
import { StorageRuleDetailsComponent } from '@app/storage-rules/storage-rule-details/storage-rule-details.component';
import { StorageRuleSelectedComponent } from '@app/storage-rules/storage-rule-selected/storage-rule-selected.component';
import { StorageRuleEditLocationsComponent } from './storage-rule-edit-locations/storage-rule-edit-locations.component';
import { StorageRulesPickerComponent } from './directives/storage-rules-picker/storage-rules-picker.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    NgSelectModule,
    SharedModule,
    ReactiveFormsModule,
    HttpClientModule,
    ClickOutsideModule,
    NgbTabsetModule,
    StorageRulesRoutingModule
  ],
  declarations: [
    StorageRulesListComponent,
    StorageRuleNewComponent,
    StorageRuleRenameComponent,
    StorageRuleEditTargetsComponent,
    StorageRuleEnableComponent,
    StorageRuleDeleteComponent,
    StorageRuleSelectedComponent,
    StorageRuleDetailsComponent,
    StorageRuleEditLocationsComponent,
    StorageRulesPickerComponent
  ],
  providers: [StorageRulesService]
})
export class StorageRulesModule {}
