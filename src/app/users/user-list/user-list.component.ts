import { Component, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, finalize, tap } from 'rxjs/operators';
import { PaginationInfo } from '@app/shared/model/pagination-info.model';
import { Router } from '@angular/router';

import { UserService } from '@app/users/services/user.service';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  styles: [
    `
      .angle-hided {
        display: none;
      }
    `
  ]
})
export class UserListComponent implements OnInit, OnDestroy {
  public list = new BehaviorSubject({ selected: null });

  public headers = [
    {
      name: 'FULLNAME',
      sort: false,
      reverseUserList: false,
      orderBy: 'UserFullName'
    },
    {
      name: 'USERNAME',
      sort: false,
      reverseUserList: false,
      orderBy: 'UserName'
    },
    {
      name: 'EMAIL',
      sort: false,
      reverseUserList: false,
      orderBy: 'Email'
    },
    {
      name: 'ROLE',
      sort: false,
      reverseUserList: false,
      orderBy: 'Role'
    },
    {
      name: 'ENABLED',
      sort: false,
      reverseUserList: false,
      orderBy: 'AccountStatus'
    }
  ];

  public sort: boolean = false;
  public userList: Array<any> = [];
  public reverseUserList: boolean = false;
  public userItemSelected: any = null;
  public selectedProfile: string = '';
  public selectedUser: any = {};
  public selectedRowId: string;
  public userListForm: FormGroup;

  public paginationInfo = new PaginationInfo();

  public selectedEmail: any;
  public selectedRole: any;

  public subscription: Subscription;

  public userSelect2Options = {
    multiple: false,
    searchable: true,
    width: '100%',
    allowClear: 'true',
    value: '',
    searchOnFocus: true
  };

  constructor(private userService: UserService, private router: Router, private fb: FormBuilder) {
    this.subscription = userService.getUpdate().subscribe(user => {
      if (user) {
        if (user.fullName !== undefined) {
          this.userItemSelected.fullName = user.fullName;
        }
        if (user.userName !== undefined) {
          this.userItemSelected.userName = user.userName;
        }
        if (user.email !== undefined) {
          this.userItemSelected.email = user.email;
        }
        if (user.roleName !== undefined) {
          this.userItemSelected.roleName = user.roleName.label;
        }
        if (user.active !== undefined) {
          this.userItemSelected.active = user.active;
        }
      }
    });
  }

  ngOnInit() {
    this.userListForm = this.fb.group({
      user: null,
      userSearch: null,
      email: null,
      emailSearch: null,
      searchInput: null,
      roles: null,
      rolesSearch: null,
      active: null
    });

    this.getUsersByPrm(this.getFilteredObj());

    this.list.subscribe(x => {
      if (x.selected === null) {
        this.userItemSelected = null;
      } else {
        this.userItemSelected = this.list.getValue();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  add() {
    this.router.navigate(['/newUser'], { replaceUrl: true });
  }

  invertUserList(header: any) {
    if (header.sort === false) {
      header.sort = true;
      this.headers.forEach(item => {
        if (item.orderBy !== header.orderBy) {
          item.sort = false;
        }
      });
    }
    header.reverseUserList = !header.reverseUserList;
    this.getUsersByPrm({ orderBy: header.orderBy, ascending: !header.reverseUserList });
  }

  // To handle name selection change event
  onUserNameChange(obj: any): void {
    setTimeout(() => {
      this.userItemSelected = null;
    }, 0);
    this.paginationInfo.pageNumber = 0;
    this.selectedUser = obj;
    this.getUsersByPrm(this.getFilteredObj());
  }

  // To handle clear role name event
  onUserNameClear(obj: any): void {
    this.paginationInfo.pageNumber = 0;
    this.selectedUser = {};
    this.getUsersByPrm(this.getFilteredObj());
  }

  // To handle email selection change event
  onEmailChange(obj: any): void {
    setTimeout(() => {
      this.userItemSelected = null;
    }, 0);
    this.paginationInfo.pageNumber = 0;
    this.selectedEmail = obj;
    this.getUsersByPrm(this.getFilteredObj());
  }

  // To handle clear email event
  onEmailClear(obj: any): void {
    this.paginationInfo.pageNumber = 0;
    this.selectedEmail = {};
    this.getUsersByPrm(this.getFilteredObj());
  }

  // To handle role selection change event
  onRoleChange(obj: any): void {
    setTimeout(() => {
      this.userItemSelected = null;
    }, 0);
    this.paginationInfo.pageNumber = 0;
    this.selectedRole = obj;
    console.log(this.selectedRole);
    this.getUsersByPrm(this.getFilteredObj());
  }

  // To handle clear role event
  onRoleClear(obj: any): void {
    this.paginationInfo.pageNumber = 0;
    this.selectedRole = {};
    this.getUsersByPrm(this.getFilteredObj());
  }

  onStatusChange(obj: any): void {
    setTimeout(() => {
      this.userItemSelected = null;
    }, 0);
    this.getUsersByPrm(this.getFilteredObj());
  }

  onSearch() {
    setTimeout(() => {
      this.userItemSelected = null;
    }, 0);
    if (this.selectedUser) {
      this.onUserNameChange(this.selectedUser);
    }
    if (this.selectedEmail) {
      this.onEmailChange(this.selectedEmail);
    }
    if (this.userListForm.value.searchInput !== null) {
      this.getUsersByPrm(this.getFilteredObj());
    }
    if (this.selectedRole) {
      this.onRoleChange(this.selectedRole);
    }
    if (this.userListForm.value.active !== null) {
      this.getUsersByPrm(this.getFilteredObj());
    }
  }

  clear(event: any) {
    setTimeout(() => {
      this.userItemSelected = null;
    }, 0);
    this.onUserNameClear(event);
    this.userListForm.controls.user.reset();
    this.onEmailClear(event);
    this.userListForm.controls.email.reset();
    this.onRoleClear(event);
    this.userListForm.controls.roles.reset();
    this.userListForm.controls.searchInput.reset();
    this.userListForm.controls.active.reset();
  }

  // To get users list based on prm
  getUsersByPrm(obj: any): void {
    this.userService
      .getUsersByPrm(obj)
      .pipe(
        tap((data: any) => {
          const users = JSON.parse(data);
          this.userList = users['_embedded']['collection'];
          console.log(users);
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

  // To set filtered object data
  getFilteredObj(): Object {
    setTimeout(() => {
      this.userItemSelected = null;
    }, 0);
    const obj: any = {};
    if (this.selectedEmail) {
      obj.emailUserId = this.selectedEmail.id;
    }
    if (this.userListForm.value.searchInput !== null) {
      obj.textSearch = this.userListForm.value.searchInput;
    }
    if (this.selectedRole) {
      obj.roleId = this.selectedRole.id;
    }
    if (this.userListForm.value.active !== null) {
      obj.accountStatus = this.userListForm.value.active;
    }
    obj.ascending = this.reverseUserList === false;
    if (this.selectedUser.id) {
      obj.userId = this.selectedUser.id;
    }
    if (this.paginationInfo.pageNumber) {
      obj.page = this.paginationInfo.pageNumber;
    }
    if (this.paginationInfo.pageSize) {
      obj.pageSize = this.paginationInfo.pageSize;
    }
    return obj;
  }

  // TO handle row click event
  onRowSelect(item: any) {
    this.selectedRowId = item.id;
    if (this.userItemSelected === item) {
      setTimeout(() => {
        this.userItemSelected = null;
      }, 0);
    } else {
      this.userItemSelected = null;
      setTimeout(() => {
        this.list.next(item);
        this.router.navigate(['/users/selected/' + item.id + '/details'], {
          replaceUrl: true,
          skipLocationChange: true
        });
      }, 0);
    }
  }

  // To handle page number change event
  onPageSizeSelect(data: any): void {
    this.paginationInfo.pageNumber = 0;
    this.paginationInfo.pageSize = data.pageSize;
    this.getUsersByPrm(this.getFilteredObj());
  }

  // To handle pagination page change event(next and previous)
  onPageChange(data: any): void {
    if (data.type === 'next') {
      this.paginationInfo.pageNumber = data.data.pageNumber;
    } else if (data.type === 'previous') {
      this.paginationInfo.pageNumber = data.data.pageNumber;
    }
    this.getUsersByPrm(this.getFilteredObj());
  }

  downloadCsv() {
    FileSaver.saveAs('/api/users.csv', 'users.csv');
  }
}
