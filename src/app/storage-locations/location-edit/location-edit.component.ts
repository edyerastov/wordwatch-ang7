import { Component, OnInit, DoCheck, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LocationsService } from '../services/locations.service';
import { ActivatedRoute, Router } from '@angular/router';
import { tap, finalize } from 'rxjs/operators';
import { Shell } from '@app/shell/shell.service';

@Component({
  selector: 'app-location-edit',
  templateUrl: './location-edit.component.html',
  styleUrls: ['./location-edit.component.scss']
})
export class LocationEditComponent implements OnInit, DoCheck, OnDestroy {
  public locationDetails: any = {};
  public locationConfiguration: any = {};
  public showCancelConfirmation = false;
  public locationEditForm: FormGroup;
  private routerSubscriber: any;
  private locationId = '';
  private defaultServiceCredentials: string = null;
  private defaultConnectionString: string = null;
  private defaultUsername: string = null;
  private defaultPassword: string = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private locationsService: LocationsService,
    private fb: FormBuilder,
    private shellService: Shell
  ) {
    this.routerSubscriber = this.route.parent.params.subscribe(params => {
      this.locationId = params['id'];
      if (this.locationId) {
        this.getLocationDetails();
      }
    });
  }

  ngOnInit() {
    this.locationEditForm = this.fb.group(
      {
        serviceCredentials: [null, Validators.required],
        connectionString: [null, Validators.required],
        username: [null, Validators.required],
        password: [null, [Validators.required, Validators.minLength(6)]],
        confirmation: [null, [Validators.required, Validators.minLength(6)]]
      },
      {
        validator: this.confirmPassword('password', 'confirmation')
      }
    );

    this.getLocationDetails();
  }

  ngDoCheck(): void {
    this.onActiveCheckbox();
  }

  ngOnDestroy() {
    this.routerSubscriber.unsubscribe();
    if (this.router.url.includes('/locations/selected/') && this.router.url.includes('/details')) {
      return;
    }
    this.router.navigate(['/locations']);
  }

  onActiveCheckbox() {
    if (this.locationEditForm.value.serviceCredentials) {
      this.locationEditForm.controls.username.disable();
      this.locationEditForm.controls.password.disable();
      this.locationEditForm.controls.confirmation.disable();
      this.locationEditForm.controls.username.setValue('');
      this.locationEditForm.controls.password.setValue('');
      this.locationEditForm.controls.confirmation.setValue('');
    } else {
      this.locationEditForm.controls.username.enable();
      this.locationEditForm.controls.password.enable();
      this.locationEditForm.controls.confirmation.enable();
    }
  }

  confirmPassword(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      }
    };
  }

  onLocationUpdate(): void {
    if (this.locationDetails.type !== 'azure') {
      if (this.locationDetails.serviceCredentials) {
        this.locationDetails.username = '';
        this.locationDetails.password = '';
        this.locationDetails.confirmation = '';
      }
    }

    const obj = Object.assign({}, this.locationDetails);
    obj.modified = new Date().toISOString();

    this.locationsService.updateLocationDetails(this.locationDetails.id, obj).subscribe(data => {
      this.router.navigate(['/roles/selected/' + this.locationDetails.id + '/details'], {
        replaceUrl: true,
        skipLocationChange: true
      });
    });
  }

  onCancel() {
    if (
      this.defaultServiceCredentials === this.locationDetails.serviceCredentials &&
      this.defaultConnectionString === this.locationConfiguration.connectionString &&
      this.defaultUsername === this.locationConfiguration.username &&
      this.defaultPassword === this.locationConfiguration.password
    ) {
      this.back();
    } else {
      this.shellService.changeState(false);
      this.showCancelConfirmation = true;
    }
  }

  back() {
    this.shellService.changeState(true);
    this.router.navigate(['../details'], { relativeTo: this.route, skipLocationChange: true });
  }

  getLocationDetails(): void {
    this.locationsService
      .getLocationDetails(this.locationId)
      .pipe(
        tap((data: any) => {
          this.locationDetails = data;
          this.locationConfiguration = data.configuration;

          this.locationEditForm.controls.serviceCredentials.setValue(this.locationDetails.serviceCredentials);
          this.locationEditForm.controls.connectionString.setValue(this.locationConfiguration.connectionString);
          this.locationEditForm.controls.username.setValue(this.locationConfiguration.username);
          this.locationEditForm.controls.password.setValue(this.locationConfiguration.password);

          if (
            !this.defaultServiceCredentials &&
            !this.defaultConnectionString &&
            !this.defaultUsername &&
            !this.defaultPassword
          ) {
            this.defaultServiceCredentials = this.locationDetails.serviceCredentials;
            this.defaultConnectionString = this.locationConfiguration.connectionString;
            this.defaultUsername = this.locationConfiguration.username;
            this.defaultPassword = this.locationConfiguration.password;
          }
        }),
        finalize(() => {})
      )
      .subscribe();
  }
}
