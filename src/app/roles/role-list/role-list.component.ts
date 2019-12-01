import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { tap, finalize } from 'rxjs/operators';
import { RoleService } from '../services/role.service';
import { PaginationInfo } from '@app/shared/model/pagination-info.model';
import * as FileSaver from 'file-saver';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss'],
  styles: [
    `
      .angle-hided {
        display: none;
      }
    `
  ]
})
export class RoleListComponent implements OnInit, OnDestroy {
  showSearchPanel: Boolean;

  public list = new BehaviorSubject({ selected: null });

  public roleListForm: FormGroup;
  public selectedRole: any = {};
  public selectedRowId: string;
  public selectedProfile: string = '';
  public roleList: Array<any> = [];
  public reverseRoleList: boolean = false;
  public sort: boolean = false;
  public roleItemSelected: any = null;
  public roleName: string;

  public subscription: Subscription;

  public nameSelect2Options = {
    multiple: false,
    searchable: true,
    width: '100%',
    placeholder: 'Name',
    allowClear: 'true',
    value: '',
    searchOnFocus: true
  };
  public profileSelect2Options = {
    multiple: false,
    closeOnSelect: true,
    width: '100%',
    minimumResultsForSearch: -1,
    placeholder: 'Any'
  };
  public paginationInfo = new PaginationInfo();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private roleService: RoleService
  ) {
    this.subscription = roleService.getUpdate().subscribe(role => {
      if (role) {
        if (role.name !== undefined) {
          this.roleItemSelected.name = role.name;
        }
        if (role.searchProfileType !== undefined) {
          this.roleItemSelected.searchProfileType = role.searchProfileType;
        }
      }
    });
  }

  ngOnInit() {
    this.getRolesByPrm(this.getFilteredObj());

    this.roleListForm = this.fb.group({
      roles: [null],
      profiles: [null],
      rolesSearch: [null]
    });

    this.list.subscribe(x => {
      if (x.selected === null) {
        this.roleItemSelected = null;
      } else {
        this.roleItemSelected = this.list.getValue();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // To get all roles
  getRoleList(): void {
    this.roleService
      .getRoles()
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

  clear(event: any) {
    setTimeout(() => {
      this.roleItemSelected = null;
    }, 0);
    this.onSearchProfileClear(event);
    this.roleListForm.controls.roles.reset();
    this.onRoleNameClear(event);
    this.roleListForm.controls.profiles.reset();
  }

  add() {
    this.router.navigate(['/newRole'], { replaceUrl: true });
  }

  // TO handle row click event
  onRowSelect(item: any) {
    this.selectedRowId = item.id;
    if (this.roleItemSelected === item) {
      setTimeout(() => {
        this.roleItemSelected = null;
      }, 0);
    } else {
      this.roleItemSelected = null;
      setTimeout(() => {
        this.list.next(item);
        this.router.navigate(['/roles/selected/' + item.id + '/details'], {
          replaceUrl: true,
          skipLocationChange: true
        });
      }, 0);
    }
  }

  onSearch() {
    setTimeout(() => {
      this.roleItemSelected = null;
    }, 0);
    if (this.selectedRole) {
      this.onRoleNameChange(this.selectedRole);
    }
    if (this.selectedProfile) {
      this.onProfileSelect(this.selectedProfile);
    }
  }

  // To handle name selection change event
  onRoleNameChange(obj: any): void {
    setTimeout(() => {
      this.roleItemSelected = null;
    }, 0);
    this.paginationInfo.pageNumber = 0;
    this.selectedRole = obj;
    this.getRolesByPrm(this.getFilteredObj());
  }

  // To handle clear role name event
  onRoleNameClear(obj: any): void {
    this.paginationInfo.pageNumber = 0;
    this.selectedRole = {};
    this.getRolesByPrm(this.getFilteredObj());
  }

  // To handle profile selection change event
  onProfileSelect(obj: any): void {
    setTimeout(() => {
      this.roleItemSelected = null;
    }, 0);
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

  // To handle pagination page change event(next and previous)
  onPageChange(data: any): void {
    if (data.type === 'next') {
      this.paginationInfo.pageNumber = data.data.pageNumber;
    } else if (data.type === 'previous') {
      this.paginationInfo.pageNumber = data.data.pageNumber;
    }
    this.getRolesByPrm(this.getFilteredObj());
  }

  // To handle page number change event
  onPageSizeSelect(data: any): void {
    this.paginationInfo.pageNumber = 0;
    this.paginationInfo.pageSize = data.pageSize;
    this.getRolesByPrm(this.getFilteredObj());
  }

  // To set filtered object data
  getFilteredObj(): Object {
    setTimeout(() => {
      this.roleItemSelected = null;
    }, 0);
    const obj: any = {};
    if (this.selectedProfile) {
      obj.searchProfile = this.selectedProfile;
    }
    obj.ascending = this.reverseRoleList === false;
    obj.orderBy = 'RoleName';
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

  invertRoleList() {
    if (this.sort === false) {
      this.sort = true;
      return;
    }
    this.reverseRoleList = !this.reverseRoleList;
    this.getRolesByPrm(this.getFilteredObj());
  }

  downloadCsv() {
    FileSaver.saveAs('/api/roles.csv', 'roles.csv');
  }
}
