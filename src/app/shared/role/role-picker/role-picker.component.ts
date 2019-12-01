import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { tap, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { RoleService } from '@app/roles/services/role.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-role-picker',
  templateUrl: './role-picker.component.html',
  styleUrls: ['./role-picker.component.scss']
})
export class RolePickerComponent {
  @Input() options: any = null;
  @Input() group: FormGroup;
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onClear: EventEmitter<any> = new EventEmitter<any>();

  public data: Array<any> = [];
  public searchStr: string = '';
  public onInputSearch: Subject<string> = new Subject();

  public roleListBuffer: Array<any> = [];
  public loading = false;
  public page = 0;

  constructor(private roleService: RoleService) {
    this.onInputSearch.pipe(debounceTime(0)).subscribe(value => {
      this.roleListBuffer = [];
      this.getRolesName({ query: this.searchStr, page: 0, _: 1558087664383 });
    });
  }

  // On item select from dropdown
  onItemSelect(data: any): void {
    if (data !== undefined) {
      if (data && data.type === 'focus') {
        this.getRolesName({ query: this.searchStr, page: 0, _: 1558087664383 });
      } else {
        if (data.label && data.id) {
          // this.shellService.changeState(false);
          this.onChange.emit(data);
          this.searchStr = '';
        }
      }
    }
  }

  // To handle clear event
  onItemClear(event: any) {
    this.onClear.emit('clear');
  }

  onScrollToEnd() {
    if (this.loading || this.data.length < 25) {
      this.page = 0;
      return;
    }
    this.fetchMore();
  }

  fetchMore() {
    this.page++;
    this.loading = true;
    // using timeout here to simulate backend API delay
    setTimeout(() => {
      this.getRolesName({ query: this.searchStr, page: this.page, _: 1558087664383 });
      this.loading = false;
    }, 0);
  }

  // Get and set role name list
  getRolesName(obj: any): void {
    this.roleService
      .getRolesByPrm(obj)
      .pipe(
        tap((data: any) => {
          this.data = data['_embedded']['collection'].map((item: any) => {
            return {
              id: item.id,
              label: item.name
            };
          });
          this.roleListBuffer = this.roleListBuffer.concat(this.data);
        }),
        finalize(() => {})
      )
      .subscribe();
  }
}
