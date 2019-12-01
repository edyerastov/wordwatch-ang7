import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@app/users/services/user.service';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  private userId: string = '';
  private routerSubscriber: any;
  public userDetails: any = {};
  public groups: any = [];

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) {
    this.routerSubscriber = this.route.parent.params.subscribe(params => {
      this.userId = params['id'];
      if (this.userId !== undefined) {
        this.getUserDetails();
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
  getUserDetails(): void {
    this.userService
      .getUserDetails(this.userId)
      .pipe(
        tap((data: any) => {
          this.userDetails = data;
          this.groups = data._embedded.groups;
        }),
        finalize(() => {})
      )
      .subscribe();
  }
}
