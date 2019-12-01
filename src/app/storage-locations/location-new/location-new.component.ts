import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Shell } from '@app/shell/shell.service';
import { Subscription } from 'rxjs';
import { LocationsService } from '@app/storage-locations/services/locations.service';

@Component({
  selector: 'app-location-new',
  templateUrl: './location-new.component.html',
  styleUrls: ['./location-new.component.scss']
})
export class LocationNewComponent implements OnInit {
  public locationNewForm: FormGroup;
  public showCancelConfirmation: Boolean = false;
  public subscription: Subscription;
  public locationDetails: any = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private locationService: LocationsService,
    public shellService: Shell
  ) {
    this.subscription = this.shellService.getConfirmation().subscribe(message => {
      this.showCancelConfirmation = message;
    });
  }

  ngOnInit() {
    this.locationNewForm = this.fb.group(
      {
        locationName: [null, [Validators.maxLength(32), Validators.required]],
        locationType: null,
        rootPath: null,
        active: false,
        username: [{ value: null, disabled: true }, [Validators.maxLength(32), Validators.required]],
        password: [{ value: null, disabled: true }, [Validators.required, Validators.minLength(6)]],
        confirmation: [{ value: null, disabled: true }, Validators.required],
        ip: null,
        info: null,
        connection: null
      },
      { validator: this.confirmPassword('password', 'confirmation') }
    );
  }

  onLocationCreate() {
    const newLocationData: any = {};

    newLocationData.confirmation = this.locationNewForm.value.confirmation;
    newLocationData.name = this.locationNewForm.value.locationName;
    newLocationData.serviceCredentials = this.locationNewForm.value.active;
    newLocationData.type = this.locationNewForm.value.locationType;

    switch (this.locationNewForm.value.locationType) {
      case 'localFiles':
        newLocationData.configuration = {
          rootPath: this.locationNewForm.value.rootPath
        };
        newLocationData.rootPath = this.locationNewForm.value.rootPath;
        break;
      case 'emc':
        newLocationData.configuration = {
          ip: this.locationNewForm.value.ip,
          pea: this.locationNewForm.value.info
        };
        break;
      case 'ntfsFileShare':
        newLocationData.configuration = {
          username: this.locationNewForm.value.username,
          password: this.locationNewForm.value.password,
          rootPath: this.locationNewForm.value.rootPath
        };
        break;
      case 'azure':
        newLocationData.configuration = {
          connectionString: this.locationNewForm.value.connection,
          containerName: this.locationNewForm.value.locationName
        };
        break;
    }

    this.locationService.newLocation(newLocationData).subscribe((data: any) => {
      this.router.navigateByUrl('/locations');
    });
  }

  onActiveCheckbox() {
    if (this.locationNewForm.value.active === true) {
      this.locationNewForm.controls.password.disable();
      this.locationNewForm.controls.confirmation.disable();
      this.locationNewForm.controls.username.disable();
      this.locationNewForm.controls.password.setValue('');
      this.locationNewForm.controls.confirmation.setValue('');
      this.locationNewForm.controls.username.setValue('');
    } else {
      this.locationNewForm.controls.password.enable();
      this.locationNewForm.controls.confirmation.enable();
      this.locationNewForm.controls.username.enable();
    }
  }

  confirmPassword(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  onLocationTypeChange(): void {
    if (this.locationNewForm.value.locationType === 'ntfsFileShare') {
      this.locationNewForm.controls.active.setValue(true);
    } else {
      this.locationNewForm.controls.active.setValue(false);
    }
  }

  confirm() {
    this.router.navigate([this.shellService.getRoute()], { replaceUrl: true });
    this.shellService.setConfirmation(false, '/home');
  }

  onCancel() {
    if (this.router.url === '/newLocations') {
      if (this.locationNewForm.value.locationName !== null || this.locationNewForm.value.locationType !== null) {
        this.shellService.changeState(false);
        this.showCancelConfirmation = true;
      } else {
        this.router.navigateByUrl('/locations');
      }
    }
  }
}
