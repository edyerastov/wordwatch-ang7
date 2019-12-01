import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '@app/shared';
import { ClickOutsideModule } from 'ng-click-outside';
import { LocationsRoutingModule } from './locations-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { LocationsService } from './services/locations.service';

import { LocationsListComponent } from './locations-list/locations-list.component';
import { LocationTypePickerComponent } from './directives/location-type-picker/location-type-picker.component';
import { LocationSelectedComponent } from './location-selected/location-selected.component';
import { LocationDetailsComponent } from './location-details/location-details.component';
import { LocationNewComponent } from './location-new/location-new.component';
import { LocationEditComponent } from './location-edit/location-edit.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    LocationsRoutingModule,
    NgSelectModule,
    SharedModule,
    ReactiveFormsModule,
    HttpClientModule,
    ClickOutsideModule,
    NgbTabsetModule
  ],
  declarations: [
    LocationsListComponent,
    LocationTypePickerComponent,
    LocationSelectedComponent,
    LocationDetailsComponent,
    LocationNewComponent,
    LocationEditComponent
  ],
  providers: [LocationsService]
})
export class StorageLocationsModule {}
