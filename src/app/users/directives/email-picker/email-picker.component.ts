import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@app/users/services/user.service';
import { debounceTime, finalize, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-email-picker',
  templateUrl: './email-picker.component.html',
  styleUrls: ['./email-picker.component.scss']
})
export class EmailPickerComponent implements OnInit, OnChanges {
  @Input() emails: Array<any> = [];
  @Input() selected: Array<any> = [];
  @Input() options: any = null;
  @Input() group: FormGroup;
  @Output() onChangeEmail: EventEmitter<any> = new EventEmitter<any>();
  @Output() onClearEmail: EventEmitter<any> = new EventEmitter<any>();

  public emailList: Array<any> = [];
  public searchStr: string = '';
  public onInputSearch: Subject<string> = new Subject();

  public emailListBuffer: Array<any> = [];
  public loading = false;
  public page = 0;

  constructor(router: Router, route: ActivatedRoute, private userService: UserService) {
    this.onInputSearch.pipe(debounceTime(0)).subscribe(value => {
      this.emailListBuffer = [];
      this.getEmails({ query: this.searchStr, page: 0 });
    });
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {}

  onEmailChange(data: any): void {
    if (data !== undefined) {
      console.log('ok');
      this.onChangeEmail.emit(data);
    }
  }

  onEmailSelect(data: any): void {
    if (data !== undefined) {
      if (data && data.type === 'focus') {
        setTimeout(() => {
          this.getEmails({ query: this.searchStr, page: 0 });
        }, 0);
      } else {
        if (data.email && data.id) {
          this.onChangeEmail.emit(data);
        }
      }
    }
  }

  onEmailClear(event: any) {
    this.onClearEmail.emit('clear');
  }

  onScrollToEnd() {
    if (this.loading || this.emailList.length < 25) {
      return;
    }
    this.fetchMore();
  }

  fetchMore() {
    this.page++;
    this.loading = true;
    setTimeout(() => {
      this.getEmails({ query: this.searchStr, page: this.page });
      this.loading = false;
    }, 400);
  }

  getEmails(obj: any): void {
    this.userService
      .getUsersByPrm(obj)
      .pipe(
        tap((data: any) => {
          this.emailList = data['_embedded']['collection'].map((item: any) => {
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
          this.emailListBuffer = this.emailListBuffer.concat(this.emailList);
        }),
        finalize(() => {})
      )
      .subscribe();
  }
}
