import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap, finalize } from 'rxjs/operators';
import { RoleService } from '../services/role.service';

@Component({
  selector: 'app-role-delete',
  templateUrl: './role-delete.component.html',
  styleUrls: ['./role-delete.component.scss']
})
export class RoleDeleteComponent implements OnInit, OnDestroy {
  private roleId: string = '';

  public roleDetails: any = {};
  public routerSubscriber: any;
  public roleList: Array<any>;

  constructor(private route: ActivatedRoute, private roleService: RoleService, public router: Router) {
    this.routerSubscriber = this.route.parent.params.subscribe(params => {
      this.roleId = params['id'];
      if (this.roleId !== undefined) {
        this.getRoleDetails();
      }
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.routerSubscriber.unsubscribe();
  }

  // To get role details based on id
  getRoleDetails(): void {
    this.roleService
      .getRoleDetails(this.roleId)
      .pipe(
        tap((data: any) => {
          this.roleDetails = data;
        }),
        finalize(() => {})
      )
      .subscribe();
  }

  // To delete role
  onRoleDelete(): void {
    if (this.roleDetails.id) {
      this.roleService
        .deleteRole(this.roleDetails.id)
        .pipe(
          tap((data: any) => {
            this.router.navigate(['/roles'], { relativeTo: this.route, skipLocationChange: true });
          }),
          finalize(() => {})
        )
        .subscribe();
    }
  }

  // To handle cancel click event
  onCancel(): void {
    this.router.navigate(['/roles/selected/' + this.roleDetails.id + '/details'], {
      replaceUrl: true,
      skipLocationChange: true
    });
  }
}
