import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceService } from '@app/devices/services/device.service';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.scss']
})
export class DeviceDetailsComponent implements OnInit, OnDestroy {
  private userId: string = '';
  private routerSubscriber: any;
  public deviceDetails: any = {};
  public groups: any = [];

  constructor(private route: ActivatedRoute, private router: Router, private deviceService: DeviceService) {
    this.routerSubscriber = this.route.parent.params.subscribe(params => {
      this.userId = params['id'];
      if (this.userId !== undefined) {
        this.getDeviceDetails();
      }
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.routerSubscriber.unsubscribe();
    if (
      this.router.url.includes('/roles/selected/') &&
      (this.router.url.includes('/edit') || this.router.url.includes('/delete'))
    ) {
      return;
    }
  }

  // To get role details based on id
  getDeviceDetails(): void {
    this.deviceService
      .getDeviceDetails(this.userId)
      .pipe(
        tap((data: any) => {
          this.deviceDetails = data;
          this.groups = data._embedded.groups;
        }),
        finalize(() => {})
      )
      .subscribe();
  }
}
