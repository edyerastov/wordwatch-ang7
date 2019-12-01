import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-location-selected',
  templateUrl: './location-selected.component.html',
  styleUrls: ['./location-selected.component.scss']
})
export class LocationSelectedComponent implements OnInit {
  licationType = '';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.licationType = this.route.snapshot.queryParamMap.get('type');
  }

  onEdit() {
    this.router.navigate(['edit'], { relativeTo: this.route, skipLocationChange: true });
  }
}
