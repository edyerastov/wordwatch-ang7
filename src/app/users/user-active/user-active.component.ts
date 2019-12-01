import { Component, OnInit } from '@angular/core';
import { UserService } from '@app/users/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-user-active',
  templateUrl: './user-active.component.html',
  styleUrls: ['./user-active.component.scss']
})
export class UserActiveComponent implements OnInit {
  private userId: string = '';
  private routerSubscriber: any;
  public userDetails: any = {};

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) {
    this.routerSubscriber = this.route.parent.params.subscribe(params => {
      this.userId = params['id'];
      if (this.userId !== undefined) {
        this.getUserDetails();
      }
    });
  }

  ngOnInit() {}

  // To get user details based on id
  getUserDetails(): void {
    this.userService
      .getUserDetails(this.userId)
      .pipe(
        tap((data: any) => {
          this.userDetails = data;
        }),
        finalize(() => {})
      )
      .subscribe();
  }

  // To handle update role event
  onUserUpdate(active: boolean): void {
    this.userService
      .activeUserDetails(this.userDetails.id, active ? 'reactivate' : 'deactivate')
      .subscribe((data: any) => {
        this.userService.sendUpdate({ state: true, active: active });
        this.router.navigate(['/users/selected/' + this.userId + '/details'], {
          replaceUrl: true,
          skipLocationChange: true
        });
      });
  }

  back() {
    this.router.navigate(['/users/selected/' + this.userId + '/details'], {
      replaceUrl: true,
      skipLocationChange: true
    });
  }
}
