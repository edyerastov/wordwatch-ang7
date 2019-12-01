import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RoleService } from '../services/role.service';
import { Shell } from '@app/shell/shell.service';
import { PaginationInfo } from '@app/shared/model/pagination-info.model';
import { SecutiryService } from '@app/shared/services/security.service';
import { finalize, tap } from 'rxjs/operators';
import { Profile } from '@app/roles/profile.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-role-new',
  templateUrl: './role-new.component.html',
  styleUrls: ['./role-new.component.scss']
})
export class RoleNewComponent implements OnInit {
  public showCancelConfirmation: Boolean = false;
  srchPrf: Boolean;
  role: {};
  public roleNewForm: FormGroup;

  public paginationInfo = new PaginationInfo();
  public selectedProfile: string = '';
  public roleList: Array<any> = [];
  public selectedRole: any = {};
  public roleDetails: any = {};
  public date = new Date();
  private roleId: string = '';
  private deviceIdList: Array<any> = [];
  private userIdList: Array<any> = [];
  private groupIdList: Array<any> = [];
  public subscription: Subscription;
  public profileSelectOptions = {
    multiple: false,
    closeOnSelect: true,
    width: '100%',
    minimumResultsForSearch: -1,
    placeholder: 'Profile'
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private roleService: RoleService,
    public shellService: Shell,
    public secutiryService: SecutiryService
  ) {
    this.subscription = this.shellService.getConfirmation().subscribe(message => {
      this.showCancelConfirmation = message;
    });
  }

  create(role: any) {
    // this.roleService.newRole(this.roleNewForm, role.id).subscribe((data: any) => {
    //
    // });
    this.router.navigate(['/roles'], { replaceUrl: true });
  }

  ngOnInit() {
    this.roleNewForm = this.fb.group({
      roleName: [null, Validators.required],
      permissions: [null, Validators.required],
      profiles: [null, Validators.required]
    });
  }

  createRole() {
    this.roleDetails = {
      name: this.roleNewForm.controls.roleName.value,
      permissions: this.roleNewForm.controls.permissions.value,
      searchProfile: {
        devices: this.deviceIdList,
        users: this.userIdList,
        groups: this.groupIdList,
        type: this.roleNewForm.controls.profiles.value
      }
    };

    this.roleService.newRole(this.roleDetails).subscribe(
      (data: any) => {
        this.router.navigate(['../roles'], {
          replaceUrl: true
        });
      },
      error => {
        console.log(error);
      }
    );
  }

  onChangeName() {
    if (this.roleNewForm.controls.roleName.valid) {
      this.shellService.changeState(false);
    } else {
      this.shellService.changeState(true);
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
        }),
        finalize(() => {})
      )
      .subscribe();
  }

  // To get roles list based on prm
  getRolesByPrm(obj: any): void {
    this.roleService
      .getRolesByPrm(obj)
      .pipe(
        tap((data: any) => {
          this.roleList = data['_embedded']['collection'];
          this.paginationInfo = (({ pageNumber, pageSize, totalPages, totalResults }) => ({
            pageNumber,
            pageSize,
            totalPages,
            totalResults
          }))(data);
        }),
        finalize(() => {})
      )
      .subscribe();
  }

  onProfileSelect(obj: any): void {
    if (obj.type !== 'focus') {
      this.paginationInfo.pageNumber = 0;
      this.selectedProfile = obj;
      this.getRolesByPrm(this.getFilteredObj());
    }
  }

  // To handle search profile clear event
  onSearchProfileClear(event: any): void {
    this.paginationInfo.pageNumber = 0;
    this.selectedProfile = '';
    this.getRolesByPrm(this.getFilteredObj());
  }

  confirm() {
    if (this.shellService.isPrevRoute) {
      this.router.navigate([this.shellService.getRoute()], { replaceUrl: true });
    } else {
      this.router.navigateByUrl('/roles');
    }
    this.shellService.setConfirmation(false, '/home');
  }

  cancel() {
    if (this.router.url === '/newRole') {
      if (
        this.roleNewForm.value.roleName !== null ||
        this.roleNewForm.value.permissions !== undefined ||
        this.roleNewForm.value.profiles !== null
      ) {
        this.shellService.changeState(false);
        this.showCancelConfirmation = true;
      } else {
        this.router.navigateByUrl('/roles');
      }
    }
  }

  propagating(e: Event) {
    e.stopPropagation();
  }

  // To set filtered object data
  getFilteredObj(): Object {
    const obj: any = {};
    if (this.selectedProfile) {
      obj.searchProfile = this.selectedProfile;
    }
    console.log(this.selectedRole);
    if (this.selectedRole.id) {
      obj.roleId = this.selectedRole.id;
    }
    if (this.paginationInfo.pageNumber) {
      obj.page = this.paginationInfo.pageNumber;
    }
    if (this.paginationInfo.pageSize) {
      obj.pageSize = this.paginationInfo.pageSize;
    }
    return obj;
  }
}
