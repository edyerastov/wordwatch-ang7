import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceService } from '@app/devices/services/device.service';

@Component({
  selector: 'app-device-selected',
  templateUrl: './device-selected.component.html',
  styleUrls: ['./device-selected.component.scss']
})
export class DeviceSelectedComponent implements OnInit {
  userId: string = '';

  constructor(private router: Router, private route: ActivatedRoute, private deviceService: DeviceService) {}

  ngOnInit() {
    this.userId = this.route.snapshot.params['id'];
  }

  // To handle tab change event
  onSelect(prm: string): void {
    this.router.navigate([prm], { relativeTo: this.route, skipLocationChange: true });
  }
}
