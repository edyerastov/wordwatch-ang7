import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap, finalize } from 'rxjs/operators';
import { RoleService } from '../services/role.service';

@Component({
  selector: 'app-role-details',
  templateUrl: './role-details.component.html',
  styleUrls: ['./role-details.component.scss']
})
export class RoleDetailsComponent implements OnInit, OnDestroy {
  private roleId: string = '';
  private routerSubscriber: any;
  public roleDetails: any = {};
  public devices: Array<any>;
  public users: Array<any>;
  public groups: Array<any>;

  constructor(private route: ActivatedRoute, private router: Router, private roleService: RoleService) {
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
    if (
      this.router.url.includes('/roles/selected/') &&
      (this.router.url.includes('/edit') || this.router.url.includes('/delete'))
    ) {
      return;
    }
  }

  // To get role details based on id
  getRoleDetails(): void {
    this.roleService
      .getRoleDetails(this.roleId)
      .pipe(
        tap((data: any) => {
          const searchProfile = data._embedded['search-profile'];
          this.roleDetails = data;
          if (searchProfile) {
            this.roleDetails.searchProfile = {};
            this.roleDetails.searchProfile.type = searchProfile.type;
            Object.keys(searchProfile['_embedded']).forEach(key => {
              this.roleDetails.searchProfile[key] = searchProfile['_embedded'][key];
            });
          }
          delete this.roleDetails['_embedded'];
          this.devices = this.roleDetails.searchProfile.devices;
          this.users = this.roleDetails.searchProfile.users;
          this.groups = this.roleDetails.searchProfile.groups;
          console.log(this.roleDetails.searchProfile.type);
        }),
        finalize(() => {})
      )
      .subscribe();
  }

  show() {
    console.log(this.roleDetails);
  }
}
