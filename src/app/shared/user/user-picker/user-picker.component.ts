import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@app/users/services/user.service';
import { debounceTime, finalize, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-user-picker',
  templateUrl: './user-picker.component.html',
  styleUrls: ['./user-picker.component.scss']
})
export class UserPickerComponent implements OnInit, OnChanges {
  @Input() users: Array<any> = [];
  @Input() selected: Array<any> = [];
  @Input() options: any = null;
  @Input() group: FormGroup;
  @Output() onChangeUsers: EventEmitter<any> = new EventEmitter<any>();
  @Output() onClearUsers: EventEmitter<any> = new EventEmitter<any>();

  public userList: Array<any> = [];
  public searchStr: string = '';
  public onInputSearch: Subject<string> = new Subject();

  public userListBuffer: Array<any> = [];
  public loading = false;
  public page = 0;

  constructor(router: Router, route: ActivatedRoute, private userService: UserService) {
    this.onInputSearch.pipe(debounceTime(0)).subscribe(value => {
      this.userListBuffer = [];
      this.getUsers({ query: this.searchStr, page: 0 });
    });
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {}

  onUserSelect(data: any): void {
    if (data !== undefined) {
      if (data && data.type === 'focus') {
        setTimeout(() => {
          this.getUsers({ query: this.searchStr, page: 0 });
        }, 0);
      } else {
        if (data.userName && data.id) {
          this.onChangeUsers.emit(data);
          this.searchStr = '';
        }
      }
    }
  }

  onUserClear(event: any) {
    this.onClearUsers.emit('clear');
  }

  onScrollToEnd() {
    if (this.loading || this.userList.length < 25) {
      return;
    }
    this.fetchMore();
  }

  fetchMore() {
    this.page++;
    this.loading = true;
    setTimeout(() => {
      this.getUsers({ query: this.searchStr, page: this.page });
      this.loading = false;
    }, 400);
  }

  getUsers(obj: any): void {
    this.userService
      .getUsersByPrm(obj)
      .pipe(
        tap((data: any) => {
          this.userList = data['_embedded']['collection'].map((item: any) => {
            return {
              id: item.id,
              fullName: item.fullName,
              userName: item.userName,
              email: item.email,
              forceChangePassword: item.forceChangePassword,
              roleName: item.roleName,
              active: item.active,
              adUser: item.adUser
            };
          });
          this.userListBuffer = this.userListBuffer.concat(this.userList);
        }),
        finalize(() => {})
      )
      .subscribe();
  }
}
