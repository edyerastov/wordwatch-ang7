import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@app/users/services/user.service';

@Component({
  selector: 'app-user-selected',
  templateUrl: './user-selected.component.html',
  styleUrls: ['./user-selected.component.scss']
})
export class UserSelectedComponent implements OnInit {
  userId: string = '';

  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit() {
    this.userId = this.route.snapshot.params['id'];
  }

  // To handle tab change event
  onSelect(prm: string): void {
    this.router.navigate([prm], { relativeTo: this.route, skipLocationChange: true });
  }
}
