import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupService } from '@app/groups/services/group.service';

@Component({
  selector: 'app-group-selected',
  templateUrl: './group-selected.component.html',
  styleUrls: ['./group-selected.component.scss']
})
export class GroupSelectedComponent implements OnInit {
  groupId: string = '';

  constructor(private router: Router, private route: ActivatedRoute, private groupService: GroupService) {}

  ngOnInit() {
    this.groupId = this.route.snapshot.params['id'];
  }

  // To handle tab change event
  onSelect(prm: string): void {
    this.router.navigate([prm], { relativeTo: this.route, skipLocationChange: true });
  }
}
