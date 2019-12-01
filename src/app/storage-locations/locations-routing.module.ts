import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShellRouting } from '@app/shell/shell-routing.module';

import { LocationsListComponent } from './locations-list/locations-list.component';
import { LocationSelectedComponent } from './location-selected/location-selected.component';
import { LocationDetailsComponent } from './location-details/location-details.component';
import { LocationNewComponent } from './location-new/location-new.component';
import { LocationEditComponent } from './location-edit/location-edit.component';

const routes: Routes = [
  ShellRouting.childRoutes([
    {
      path: 'locations',
      component: LocationsListComponent,
      children: [
        {
          path: 'selected/:id',
          component: LocationSelectedComponent,
          children: [
            {
              path: 'details',
              component: LocationDetailsComponent
            },
            {
              path: 'edit',
              component: LocationEditComponent
            }
          ]
        }
      ]
    },
    {
      path: 'newLocation',
      component: LocationNewComponent
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class LocationsRoutingModule {}
