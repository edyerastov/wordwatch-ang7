import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, tap } from 'rxjs/operators';
import { DeviceService } from '@app/devices/services/device.service';

@Component({
  selector: 'app-device-delete',
  templateUrl: './device-delete.component.html',
  styleUrls: ['./device-delete.component.scss']
})
export class DeviceDeleteComponent implements OnInit, OnDestroy {
  public deviceId: string = '';

  public deviceName: any = '';
  public routerSubscriber: any;

  constructor(private route: ActivatedRoute, private deviceService: DeviceService, public router: Router) {
    this.routerSubscriber = this.route.parent.params.subscribe(params => {
      this.deviceId = params['id'];
      if (this.deviceId !== undefined) {
        this.getDeviceName();
      }
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.routerSubscriber.unsubscribe();
  }

  getDeviceName(): void {
    this.deviceService
      .getDeviceDetails(this.deviceId)
      .pipe(
        tap((data: any) => {
          this.deviceName = data.name;
        }),
        finalize(() => {})
      )
      .subscribe();
  }

  onDeviceDelete(): void {
    if (this.deviceId) {
      this.deviceService
        .deleteDevice(this.deviceId)
        .pipe(
          tap((data: any) => {
            this.router.navigate(['/devices'], { relativeTo: this.route, skipLocationChange: true });
          }),
          finalize(() => {})
        )
        .subscribe();
    }
  }

  onCancel(): void {
    this.router.navigate(['/devices/selected/' + this.deviceId + '/details'], {
      replaceUrl: true,
      skipLocationChange: true
    });
  }
}
